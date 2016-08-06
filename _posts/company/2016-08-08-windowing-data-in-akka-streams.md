---
title: Windowing data in Akka Streams
description: How to implement time-based data windowing in Akka Streams?
author: Adam Warski
author_login: warski
categories:
- scala
- akka
- spark
- flink
- kafka
- reactive
- bigdata
layout: simple_post
---

[Akka Streams](http://doc.akka.io/docs/akka/2.4/scala/stream/index.html) provide a lot of combinators to manipulate data streams out-of-the-box, but one missing piece of functionality that I needed recently is the ability to window data based on time. In stream processing systems this is quite a well known operation, we can find it e.g. in [Flink](https://ci.apache.org/projects/flink/flink-docs-master/apis/streaming/windows.html), [Kafka streams](http://docs.confluent.io/3.0.0/streams/concepts.html#windowing) or [Spark](http://spark.apache.org/docs/latest/streaming-programming-guide.html#window-operations); however in Akka Streams we have to use some lower-level operations to get the desired effect.

# Windowing introduction

But first, what do we exactly mean by windowing data? This operation can be done in a number of different ways. First of all, we can group data into **session-based** or **time-based** windows. Session windows can vary in length, and are grouped based on e.g. a session id derived from each data element. Time-based windows group data basing on time - but then again, what time? Here we can choose either **event-time** - a timestamp derived from each data element, or **processing-time** - the wall-clock time at the moment the event is processed.

After deciding on using event- or processing-time for events, we then have to decide how to divide the continuous time into discrete chunks. Here usually there are two options. The first is **tumbling windows**, parametrised by length. Time is divided into non-overlapping parts and each data element belongs to a single window. E.g. if the length is 30 minutes, the windows would be `[12:00, 12:30)`, `[12:30, 13:00)`, etc. The second option are **sliding windows**, parametrised by length and step. These windows overlap, and each data element can belong to multiple windows. For example if the length is 30 minutes, and step 5 minutes, the windows would be `[12:00, 12:30)`, `[12:05, 12:35)`, etc.

If we decide to go with event-time, there’s one more problem laying ahead of us. Events usually don’t arrive in order (e.g. if the data comes from a mobile or IoT device, there might be connectivity breaks or the clocks on each device might differ). We have to deal with that somehow, in a way that keeps memory usage under control: we can only keep a limited number of windows "open", that is accepting data. At some point old windows have to be "closed" (and discarded, thus freeing memory), and that is usually done through a **watermarking** mechanism. A watermark specifies that there will be no events older than a given time; or that if there will be, they will be dropped. For example, we can say that at any time the watermark is the timestamp of the newest event minus 10 minutes. Or maybe we have well-behaved data and they always arrive in order? Then our live is a bit easier.

Finally, knowing all of the above parameters, we need to aggregate the data in each window and get the results out. Here we also have two options. We might either want to get a **continuous stream of updates** to the aggregate value, that is after a new data element is added to a window, and the aggregate value updated, it can be emitted downstream. Or, we might want to get only the **final aggregate**, emitted once the window is being closed.

# Sliding, time-based windowing of data in Akka Streams

As you can see there’s a lot of different use-case-specific parameters and approaches to windowing data, and that’s probably one of the reasons windowing isn’t available out-of-the-box in Akka Streams: such a "ready" solution would probably cover only some of the use cases. However, using existing combinators, such as `statefulMapConcat`, `groupBy` and `takeWhile` and a little code we can quite easily implement our own, of course fitting the given use case like a glove.

Let’s pick a specific set of parameters to provide an example:

- time-based sliding windows of length 10 seconds and step 1 second
- event-time derived from the data
- watermark defined to be the timestamp of the newest event minus 5 seconds
- emit only the final aggregate value

Hopefully you’ll see that covering other windowing use-cases (e.g. using tumbling windows or processing time) should be quite straightforward modifications of the below code.

In our example we’ll be emitting a data element (event) each second; each event holds a timestamp, which will be randomly delayed by up to 7 seconds from the current system time. The events will be then grouped into windows and counted, and the results printed to `stdout`. As we will be dropping some events (the watermark only allows a 5 second delay), we should expect windows with slightly varying number of elements, 8-12 on average.

The full code is available as [a gist](https://gist.github.com/adamw/3803e2361daae5bdc0ba097a60f2d554), let’s walk through it step-by-step.

<img src="/img/akkawindowing.png" />

First, we’ll define a case class for events and generate a single event each second ([gist fragment](https://gist.github.com/adamw/3803e2361daae5bdc0ba097a60f2d554#file-windowing-scala-L22-L28)):

```
case class MyEvent(timestamp: Long)

val myEventStream = Source
  .tick(0.seconds, 1.second, "")
  .map { _ =>
    val now = System.currentTimeMillis()
    val delay = random.nextInt(8)
    MyEvent(now - delay * 1000L)
  }
```

We now have a stream of `MyEvent` instances, each holding a potentially delayed timestamp. Next, we have to group the data by time windows. We define a window to be an interval with a starting and ending timestamps (represented as a Scala tuple). There's also a utility method to get a set of windows for a given timestamp ([gist fragment](https://gist.github.com/adamw/3803e2361daae5bdc0ba097a60f2d554#file-windowing-scala-L53-L66)):

```
type Window = (Long, Long)

object Window {
  val WindowLength    = 10.seconds.toMillis
  val WindowStep      =  1.second .toMillis
  val WindowsPerEvent = (WindowLength / WindowStep).toInt

  def windowsFor(ts: Long): Set[Window] = {
    val firstWindowStart = ts - ts % WindowStep - WindowLength + WindowStep
    (for (i <- 0 until WindowsPerEvent) yield
      (firstWindowStart + i * WindowStep,
        firstWindowStart + i * WindowStep + WindowLength)
      ).toSet
  }
}
```

To do the actual grouping, for each data element we will generate a list of "window commands" ([gist fragment](https://gist.github.com/adamw/3803e2361daae5bdc0ba097a60f2d554#file-windowing-scala-L68-L74)):

```
sealed trait WindowCommand {
  def w: Window
}

case class OpenWindow(w: Window) extends WindowCommand
case class CloseWindow(w: Window) extends WindowCommand
case class AddToWindow(ev: MyEvent, w: Window) extends WindowCommand
```

Each command is associated with a window (time interval). The `OpenWindow` command allows to enrich the aggregate value computed for the window with some meta-data (here it’s just the bounds of the window). The `CloseWindow` command signals that there will be no more data for the window and that the aggregate value can be emitted. Finally, `AddToWindow` specifies an event to be added to the aggregate value for a specific window. Generating commands for an event is done using a helper class ([gist fragment](https://gist.github.com/adamw/3803e2361daae5bdc0ba097a60f2d554#file-windowing-scala-L76-L108)):

```
class CommandGenerator {
  private val MaxDelay = 5.seconds.toMillis
  private var watermark = 0L
  private val openWindows = mutable.Set[Window]()

  def forEvent(ev: MyEvent): List[WindowCommand] = {
    watermark = math.max(watermark, ev.timestamp - MaxDelay)
    if (ev.timestamp < watermark) {
      println(s"Dropping event with timestamp: ${tsToString(ev.timestamp)}")
      Nil
    } else {
      val eventWindows = Window.windowsFor(ev.timestamp)

      val closeCommands = openWindows.flatMap { ow =>
        if (!eventWindows.contains(ow) && ow._2 < watermark) {
          openWindows.remove(ow)
          Some(CloseWindow(ow))
        } else None
      }

      val openCommands = eventWindows.flatMap { w =>
        if (!openWindows.contains(w)) {
          openWindows.add(w)
          Some(OpenWindow(w))
        } else None
      }

      val addCommands = eventWindows.map(w => AddToWindow(ev, w))

      openCommands.toList ++ closeCommands.toList ++ addCommands.toList
    }
  }
}
```

Yes, you are right, there’s mutable state there! But you can think about it as the internal state of an actor, then hopefully it won’t look so bad. We need to keep track of the currently open windows (which is just a set of timestamp intervals), and the watermark.

When generating commands, we first update the watermark & check if the event isn’t too old. Then we check if some of the currently open windows don’t need closing, as they are too old - that allows us to keep the memory usage bounded; symmetrically, we also have to check if there are new windows to be opened. Finally, for each window assigned to an event, we create an `AddToWindow` command.

The logic of the `CommandGenerator` is also the main point where you can customise how windowing of data is done: how to define watermarks, how to extract timestamps from events, whether to use sliding or tumbling windows etc.

How do we use the generator? Here the `statefulMapConcat` combinator is very useful ([gist fragment](https://gist.github.com/adamw/3803e2361daae5bdc0ba097a60f2d554#file-windowing-scala-L29-L32)):

```
val commandStream = myEventStream.statefulMapConcat { () =>
  val generator = new CommandGenerator()
  ev => generator.forEvent(ev)
}
```

The no-argument function provided to `statefulMapConcat` will be called each time the stream will be materialized. This allows us to enclose over mutable state safely - it won’t be shared by multiple threads. The result of the no-arg function should be a mapping function, translating each event to a list of elements to emit downstream - here we will generate commands from events. If you think that’s similar to a `flatMap` on a normal collection - it is.

Now that we have the commands, we can fork our stream to process each window in its own stream ([gist fragment](https://gist.github.com/adamw/3803e2361daae5bdc0ba097a60f2d554#file-windowing-scala-L33-L41)):

```
val windowStreams = commandStream
  .groupBy(64, command => command.w)
  .takeWhile(!_.isInstanceOf[CloseWindow])
  .fold(AggregateEventData((0L, 0L), 0)) {
    case (agg, OpenWindow(window)) => agg.copy(w = window)
    // always filtered out by takeWhile
    case (agg, CloseWindow(_))     => agg
    case (agg, AddToWindow(ev, _)) => agg.copy(eventCount = agg.eventCount+1)
  }
  .async
```

First we group the command stream by the window to which the command belongs. The result of `.groupBy` is a `SubFlow`, which is a family of streams, where one stream is materialised for each key (herethe key is the window for the command). Subsequent combinators will be applied to *each* of the sub-streams. The key is defined by the function which is the second argument to `groupBy`. The first is the upper bound on the number of sub-streams that will be open at any time.

In the sub-stream, first we define when it should finish: once we encounter a `CloseWindow` command. `takeWhile` will complete the sub-stream once it encounters a command which doesn't match the predicate.

Then, we define how to aggregate the per-window data into a final value. Here we just count the number of events in each stream into a `case class AggregateEventData(w: Window, eventCount: Int)`. The aggregation is done with a `fold` combinator. We should never get a `CloseWindow` command, but we still need to cover it not to get a compiler warning. When we receive an `OpenWindow` command (which should be the first command for each window), we update the meta-data for the aggregate (in our case, the window bounds). Finally, upon receiving an `AddToWindow` command, we increment the counter in the aggregate.

When will `fold` emit the final value? When the upstream is complete - that is, when `takeWhile` encounters a `CloseWindow` (or when the whole stream completes) - so that’s exactly what we want.

Finally, after `fold`, there’s an `.async` combinator. This puts an asynchronous boundary around *each* sub-flow (as it’s the last combinator, it covers the entire sub-flow, all the way up to `groupBy`). That way, each substream will be processed concurrently. This is entirely optional, if sub-stream processing is fast, you might want to drop the `.async` and process everything in the same thread.

One last things to do: we need to merge the sub-streams into one stream of aggregate values ([gist fragment](https://gist.github.com/adamw/3803e2361daae5bdc0ba097a60f2d554#file-windowing-scala-L42-L45)):

```
val aggregatesStream = windowStreams
  .mergeSubstreams
  .runForeach { agg =>
    println(agg.toString)
  }
```

And we’re done!

Comparing to Spark/Flink/Kafka Streams, windowing data in Akka Streams isn’t definitely a one-liner, but it’s also not that hard to implement it using the existing combinators, as I hope I have convinced you. Moreover, we get *a lot* of flexibility in all aspects of the windowing operation: how to divide data in windows, how to deal with late data, how to aggregate and so on.

Thanks to [@ktoso](https://github.com/ktoso) and [@johanandren](https://github.com/johanandren) for their help on Gitter!
