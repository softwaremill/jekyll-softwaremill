---
title: Replacing Akka actors with Akka streams
description: An example of how code typically implemented with actors can be implemented using streams
author: Adam Warski
author_login: warski
categories:
- scala
- akka
- actors
- amazon
- reactive
- company
layout: simple_post
---

I was recently working on simple automation of running short-lived Docker containers using the [Amazon EC2 Container Service (ECS)](https://aws.amazon.com/ecs/). The high-level overview of the steps that had to be done is the following:

- submit a new `RunTaskRequest` using the amazon sdk. This results in a `Future[String]`, which is completed with the id of the task (called `taskArn`)
- if the `RunTaskRequest` doesn’t complete within 5 seconds, return a failed result
- each 500 milliseconds, poll ECS by using a `DescribeTaskRequest` with the task id, to see if the task is completed
- get the result of the task from an external system
- if the total time of the computation exceeds 3 minutes, return a failed result
- provide continuous feedback to the user on the progress of the computation

At first I wanted to implement the above using an actor, which would have three states: submitting the `RunTaskRequest`, polling for task status, and finally getting the results. The poll ticker and the timeouts could be managed by the Akka scheduler. Feedback would be provided by sending messages to a user-provided actor. Overall, a pretty standard solution using Akka actors.

This would work fine, however the pure-actor solution has some drawbacks. First, the timers would have to be manually managed using a side-effecting API. Properly setting up and clearing timers can be error prone. Secondly, the flow of the algorithm wouldn’t be clearly visible: one would have to read into the actor code to understand, even on a high level, what is happening. So a question arises: can we do better than that?

The answer is [Akka streams](http://doc.akka.io/docs/akka/2.4/scala/stream/index.html). While you might not see a stream in the high-level overview at first, it’s there! Let’s take a look at the code; but first we need an interface to ECS. Let’s assume we have the following:

```
trait Ecs {
  // returns a future completed with the task arn
  def submitRunTask(): Future[String]
  // returns a future completed with a string representation of the task’s state
  def getStatus(taskArn: String): Future[String]
}

val ecs: Ecs = ...
```

Then, we’ll define a simple family of case classes through which we’ll communicate progress to the user (in the same way, we would communicate progress by sending messages to a user-provided feedback actor):

```
sealed trait SubmitRequestStatus
object SubmitRequestStatus {
  case object Started extends SubmitRequestStatus
  case object Running extends SubmitRequestStatus
  case object Stopped extends SubmitRequestStatus
  case object Timedout extends SubmitRequestStatus
  case object Failed extends SubmitRequestStatus
}
```

The user of our code expects to receive a single `Started` status update, then a number of `Running` statuses (when we poll the task status), finally a `Stopped` one. If anything goes wrong, we can get a `Timedout` or `Failed` status.

Having these definitions in place, we can now define the logic of the computation using streams. Here’s the complete code:

```
Source
  .fromFuture(ecs.submitRunTask())
  .initialTimeout(5.seconds)
  .flatMapConcat { taskArn =>
    val statusSource = Source
      .tick(0.seconds, 500.milliseconds, ())
      .mapAsync(1)(_ => ecs.getStatus(taskArn))
      .map { status =>
        if (status == "STOPPED") Stopped else Running
      }

    Source(List(Started)).concat(statusSource)
  }
  // a not-so-nice-way to complete the stream when we encounter "Stopped"
  // and emit "Stopped" downstream as well
  .mapConcat {
    case Stopped => List((Stopped, true), (Stopped, false))
    case x => List((x, true))
  }
  .takeWhile(_._2)
  .map(_._1)
  .completionTimeout(3.minutes)
  .recover {
    case e: TimeoutException => Timedout
    case e: Exception => Failed // in reality probably at least log the exception
  }
```

Let’s take a look at the code step-by-step:

```
Source
  .fromFuture(ecs.submitRunTask())
  .initialTimeout(5.seconds)
```

First we create a single-element stream basing on a `Future` returned when we submit a task. We use the `initialTimeout` stream combinator to specify that the first (and only) element of the stream must be emitted within 5 seconds, effectively creating a timeout for the submit-task future completion.

```
  .flatMapConcat { taskArn =>
    val statusSource = Source
      .tick(0.seconds, 500.milliseconds, ())
      .mapAsync(1)(_ => ecs.getStatus(taskArn))
      .map { status =>
        if (status == "STOPPED") Stopped else Running
      }

    Source(List(Started)).concat(statusSource)
  }
```

Next, when the task is submitted, we need to poll ECS for the task status. To do that, we create a tick-source (`Source.tick`), which emits the given element (here, unit value `()`) every 500 milliseconds. On each tick, we get the task status. However, this results in a `Future` - we “flatten” this future into the stream using `mapAsync` with a parallelism of 1 (if getting the task status takes too long, we don’t want to run another one in parallel); this way we obtain a stream of `String`s, which are the status values. Finally, we translate the string status into our model, either `Stopped` or `Running`.

As the user expects a `Started` element before any `Running` elements, we need to emit it as soon as we get the `taskArn` (task id). Hence, we concat a single-element stream (`Source(List(Started))` - which is immediately emitted), with the stream of task statuses as obtained from ecs (`statusSource`).

Similarly, we concat the original source which results in the run task id, with the source of task statuses. However, as the second source depends on the result of the first, we need to use `flatMapConcat`. Here, the `flatMap` operates on `Graph`s - which are descriptions of how data should be processed in the stream.

```
  // a not-so-nice-way to complete the stream when we encounter "Stopped"
  // and emit "Stopped" downstream as well
  .mapConcat {
    case Stopped => List((Stopped, true), (Stopped, false))
    case x => List((x, true))
  }
  .takeWhile(_._2)
  .map(_._1)
```

And we’re almost done! We just need a way to complete the stream once a `Stopped` element is emitted. This can be done using `takeWhile`, which we’ve also used when [implementing data windowing using akka streams](https://softwaremill.com/windowing-data-in-akka-streams/). But, we also want to emit this element; here we have to work around a limitation of the available akka streams combinators. We enrich each element with a “should continue” boolean flag, and by default this is true, while for `Stopped` we emit the status twice: once with true (will go through `takeWhile`, once with false (will complete the stream). `takeWhile` then checks the flag - the second element of the tuple.

Note that we use `mapConcat` instead of `map`, which translates a single stream element into 0..* elements.

```
  .completionTimeout(3.minutes)
  .recover {
    case e: TimeoutException => Timedout
    case e: Exception => Failed // in reality probably at least log the exception
  }
```

Specifying that the whole computation should take as most 3 minutes is as simple as using the `completionTimeout` combinator.

What if there’s an error? We can use the `recover ` combinator to translate exceptions to custom statuses. Or, if you would need to do some additional actions, you can use `recoverWith` to translate an exception to a complete graph (the difference is here is the same as between `map` and `flatMap`).

## Summing up ##

The code above is just a description of what should happen. To complete the stream definition and start the computation, we need to attach a `Sink` and invoke `run` on the result. The sink can be user-provided - it describes what should happen when status updates are received (hence this corresponds to the user-provided actor which would receive status updates from our original design). This can be, for example, a sink which sends updates through a [web-socket using akka-http](http://doc.akka.io/docs/akka/2.4/scala/http/routing-dsl/websocket-support.html).

Of course, you can’t always replace an actor with streams - but in many cases you can take advantage of the higher-level streams API. The code will be declarative, and hence cleaner and easier to understand; and maybe even less buggy as well. When running the code, actors will still be used, but they will be more of an implementation detail (which, in theory, could be swapped by using a different `Materializer`), than a first-class concept in your code.

If needed, in some cases, you can combine custom actors with streams: by using an [actor `Sink`/`Source`](http://doc.akka.io/docs/akka/2.4/scala/stream/stream-integrations.html#integrating-with-actors), or implementing [custom graph stages](http://blog.kunicki.org/blog/2016/07/20/implementing-a-custom-akka-streams-graph-stage/).

Actors are still a great tool for writing concurrent code, but with higher-level abstractions they become a lower-level building block.
