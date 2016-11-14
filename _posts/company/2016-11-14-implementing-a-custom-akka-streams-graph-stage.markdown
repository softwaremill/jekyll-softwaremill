---
title: Implementing a custom Akka Streams graph stage
description: Already know the basics of Akka Streams? Time to go further!
author: Jacek Kunicki
author_login: kunicki
categories:
- scala
- akka streams
- reactive
- company
layout: simple_post
---

_This article was originally posted at [Jacek's blog](http://blog.kunicki.org/blog/2016/07/20/implementing-a-custom-akka-streams-graph-stage/)._

## Background

[Akka Streams](http://doc.akka.io/docs/akka/2.4.8/scala/stream/index.html) offers a number of predefined building blocks for your graphs (i.e. processing pipelines). Should you need a non-standard solution, there's an API to help you write the custom part of the graph. In this post I'm going to walk you through implementing your own graph stage.

## Recap: Akka Streams concepts

Since the stream processing terminology heavily depends on the library/toolkit you are using, here is a quick reminder of what things are called in the Akka Streams world: the producer is called a `Source`, the consumer - a `Sink` and the processing stages are `Flow`s. Each of those is a specialized graph stage whose type is determined by the number of inputs and outputs - a `Source` has no inputs and a single output, a `Sink` has a single input and no outputs, a `Flow` has a single input and a single output.

In terms of the types, each part of the graph is a `GraphStage` with a given `Shape` - with the most basic shapes being: `SourceShape`, `FlowShape` and `SinkShape`. There are also other more complex `Shape`s available, used for modelling such concepts as broadcasting or merging elements of the stream, but those are out of the scope of this post.

## The use case

Let's say that having a stream of elements of type `E` you want to observe their arbitrary property of type `P`, accumulate the elements as long as the property remains unchanged and only emit an `immutable.Seq[E]` of accumulated elements when the property changes. In a real-life example the elements can be e.g. lines in a CSV file which you would like to group by a given field.

## Anatomy of a custom graph stage

A custom graph stage is nothing more than an implementation of:

```scala
abstract class GraphStage[S <: Shape]
```

In our example the stage is going to have a single input and a single output, which makes it a `Flow` whose shape is:

```scala
FlowShape[E, immutable.Seq[E]]
```

The definition of the stage thus becomes:

```scala
final class AccumulateWhileUnchanged[E] 
  extends GraphStage[FlowShape[E, immutable.Seq[E]]] {
  // ...
}
```

Now you just need to implement two methods

- `def shape: FlowShape` - to provide a concrete shape
- `def createLogic(attributes: Attributes): GraphStageLogic` - to provide your custom logic of the stage

Let's now dig into the details of those two methods.

## Implementing a custom graph stage

### Providing a custom `FlowShape`

A `FlowShape` simply consists of an `Inlet` and an `Outlet`, i.e. the _ports_ of the stage. To define a port, you need to provide its name and data type. After defining the ports, the stage implementation becomes:

```scala
final class AccumulateWhileUnchanged[E] 
  extends GraphStage[FlowShape[E, immutable.Seq[E]]] {

  val in = Inlet[E]("AccumulateWhileUnchanged.in")
  val out = Outlet[immutable.Seq[E]]("AccumulateWhileUnchanged.out")

  override def shape = FlowShape(in, out)
}
```

### Providing a custom `GraphStageLogic`

Since the `GraphStage`s are meant to be reusable, it is crucial to keep them immutable, i.e. not to put any mutable state inside them. On the other hand, however, the stage we are implementing here is definitely stateful - its state consists of the accumulated elements. Here is where the `GraphStageLogic` comes to the rescue - since a new instance of it is created for every materialization of the flow, it is the one and only place to keep the mutable state in.

Within the `GraphStageLogic`, apart from keeping the mutable state, you may also define handlers for the `onPush()` and `onPull()` events. The `onPush()` event occurs when a new element from the upstream is available and can be acquired using `grab()`. The `onPull()`, on the other hand, occurs when the downstream is ready to accept a new element which can be sent with `push()`.

So here is what a draft implementation of the `GraphStageLogic` with the handlers is going to look like:

```scala
override def createLogic(attributes: Attributes) = new GraphStageLogic(shape) {

  setHandlers(in, out, new InHandler with OutHandler {

    override def onPush(): Unit = {
      // ...
    }

    override def onPull(): Unit = {
      // ...
    }
  })
}
```

To implement the actual accumulating logic, you need to:

- know how to extract the observed property of the incoming elements,
- keep track of the incoming elements in some kind of a buffer.

#### Extracting the observed property

The easiest way to know which property to observe is to have the user provide a function which extracts this property - so you need to adjust the stage definition a bit:

```scala
final class AccumulateWhileUnchanged[E, P](propertyExtractor: E => P)
  extends GraphStage[FlowShape[E, immutable.Seq[E]]] {
```

#### Keeping track of the incoming elements

The internal state of your stage logic will consist of:

- an `Option[P]` to keep the current value of the observed property (empty until the first element arrives),
- a `Vector[E]` to accumulate the elements (cleared when the observed property changes).

When the next input element arrives (in `onPush()`), you want to extract its property and check if it differs from the current value. If there is no current value yet or the values are equal, you add the element to the buffer and `pull()` the input, otherwise you `push()` the buffer contents downstream and clear the buffer. When the downstream requests a new sequence of elements with `onPull()`, you just need to `pull()` the input in order to indicate, that the stage is ready to accept a new incoming element.

An additional case that you need to handle is when the upstream has completed (i.e. no more input elements are going to arrive or there was an error in the upstream) - then you need to push the _last_ elements from the buffer (unless it is empty) and complete the stage afterwards. Moreover, to be nice to memory and the GC, you may wish to clear the buffer after the stage is complete.

The full implementation of the above concepts is going to be something like:

```scala
final class AccumulateWhileUnchanged[E, P](propertyExtractor: E => P)
  extends GraphStage[FlowShape[E, immutable.Seq[E]]] {

  val in = Inlet[E]("AccumulateWhileUnchanged.in")
  val out = Outlet[immutable.Seq[E]]("AccumulateWhileUnchanged.out")

  override def shape = FlowShape.of(in, out)

  override def createLogic(attributes: Attributes) = new GraphStageLogic(shape) {

    private var currentState: Option[P] = None
    private val buffer = Vector.newBuilder[E]

    setHandlers(in, out, new InHandler with OutHandler {

      override def onPush(): Unit = {
        val nextElement = grab(in)
        val nextState = propertyExtractor(nextElement)

        if (currentState.isEmpty || currentState.contains(nextState)) {
          buffer += nextElement
          pull(in)
        } else {
          val result = buffer.result()
          buffer.clear()
          buffer += nextElement
          push(out, result)
        }

        currentState = Some(nextState)
      }

      override def onPull(): Unit = {
        pull(in)
      }

      override def onUpstreamFinish(): Unit = {
        val result = buffer.result()
        if (result.nonEmpty) {
          emit(out, result)
        }
        completeStage()
      }
    })

    override def postStop(): Unit = {
      buffer.clear()
    }
  }
}
```

If you are wondering why `emit()` is used instead of `push()` in `onUsptreamFinish()` (line 40), the answer is - because it is not possible to push a port which has not been pulled. Once the upstream is finished, the buffer may still contain the final group of accumulated elements - but chances are that the output port has not been pulled after the previous group was pushed. You want, however, to send the final group anyway - that is where `emit()` comes to the rescue - when it detects that the output port is not available (i.e. cannot be pushed), it replaces the `OutHandler` with a temporary one and only then does it execute the actual `push()`.

Now you are ready to use the custom stage in your application with `.via(new AccumulateWhileUnchanged(...))`. For example, having a simple domain like:

```scala
case class Element(id: Int, value: Int)

object SampleElements {

  val E11 = Element(1, 1)
  val E21 = Element(2, 1)
  val E31 = Element(3, 1)
  val E42 = Element(4, 2)
  val E52 = Element(5, 2)
  val E63 = Element(6, 3)

  val Ones = immutable.Seq(E11, E21, E31)
  val Twos = immutable.Seq(E42, E52)
  val Threes = immutable.Seq(E63)

  val All = Ones ++ Twos ++ Threes
}
```

when you run:

```scala
Source(SampleElements.All)
  .via(new AccumulateWhileUnchanged(_.value))
  .runWith(Sink.foreach(println))
```

the output will be:

```
Vector(Element(1,1), Element(2,1), Element(3,1))
Vector(Element(4,2), Element(5,2))
Vector(Element(6,3))
```

## Testing

There is a number of useful utilities to help you test your custom graph stages. With the help of those and using the `SampleElements` helper defined above, a sample test case for the above stage looks like:

```scala
"AccumulateWhileUnchanged" should {

  "emit accumulated elements when the given property changes" in {
    val (_, sink) = Source(SampleElements.All)
      .via(AccumulateWhileUnchanged(_.value))
      .toMat(TestSink.probe)(Keep.both)
      .run()

    sink.request(42)
    sink.expectNext(SampleElements.Ones, SampleElements.Twos, SampleElements.Threes)
    sink.expectComplete()
  }
}
```

The `TestSink.probe` (line 6) creates an instance of `akka.stream.testkit.TestSubscriber.Probe`, which offers methods such as `expectNext()` or `expectComplete()` (lines 10-11) to verify whether the stage behaves correctly.

## Summary

After diligently going through this post, you should understand how the `GraphStage` API is designed and how to use it to implement your own graph stage. 

For even more details, please refer to the [Custom stream processing](http://doc.akka.io/docs/akka/2.4.8/scala/stream/stream-customize.html) section of the Akka Streams documentation.

If you find the `AccumulateWhileUnchanged` stage useful, there is no need to rewrite it from scratch, since it is a part of [akka-stream-contrib](https://github.com/akka/akka-stream-contrib) - a project which groups various add-ons to Akka Streams core.
 