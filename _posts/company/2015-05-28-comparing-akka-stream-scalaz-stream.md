---
title: Comparing akka-stream and scalaz-stream with code examples
description: Comparing akka-stream and scalaz-stream with code examples
author: Adam Warski
author_login: warski
categories:
- akka
- scalaz
- scala
- streaming
- company
layout: simple_post
include_toc: true
---

# Introduction

Stream data processing is an increasingly popular topic; it is also at the core of the "reactive" movement, which makes it even more trendy! Streaming libraries provide abstractions which let us solve a large number of "every-day" problems in an **elegant** way using stream processing combinators with a **declarative** API, hiding most of the ugly "imperative" details.

Stream processing comes in a couple of flavors. If you have really large data sets and need to process the data on multiple nodes in a distributed fashion, you should probably take a look at systems such as [Apache Spark](https://spark.apache.org). For **single-node computations** that's definitely an overkill and other tools are needed (and very often, single-node is all you need!). There are two interesting stream processing libraries in the Scala ecosystem which fill that niche: [akka-stream](http://akka.io/docs/) and [scalaz-stream](https://github.com/scalaz/scalaz-stream).

Note that single-node doesn't mean that the data has to fit into memory; it can be much larger than that. The main point of stream data processing is that you can work through the data **incrementally**, transforming or aggregating it as it comes.

We'll try to compare akka-stream and scalaz-stream in two parts: first looking at their design, then comparing features, API and performance by implementing same data streaming examples using either library. For the impatient, you can find the [code on Github](https://github.com/softwaremill/streams-tests). There's a number of introductory blogs and talks (plus the project documentation), so I don't aim to cover the details of the libraries in depth, just enough to get a sense of what are the similarities and differences.

Both libraries are under active development (especially akka-stream, which is the younger of the two) and the APIs are still in flux, but that doesn't stop people from using them in production (let's face it, we all used a library version 0.0.3-beta1-M3 at least once ;) ), so let's see what they offer currently.

Tested versions: akka-stream **2.0** and scalaz-stream **0.8**.

# What is ...?

How do the creators introduce their libraries? Different wording, but similar use-cases:

> "**Akka Streams** is a library to process and transfer a sequence of elements using bounded buffer space"

> "**scalaz-stream** is a streaming I/O library. The design goals are compositionality, expressiveness, resource safety, and speed."

# Design characteristics

Both scalaz-stream and akka-stream share a common design goal: to provide compositionality. We should be able to re-use different parts of the processing pipeline, connect them together in various combinations and different topologies.

This is achieved using the same concept: first, we create a blueprint specifying how the stream should be transformed. This blueprint can be composed of pre-defined or custom components. No data is processed until a complete blueprint is "executed"; moreover, a blueprint should be executable multiple times. The blueprints are immutable and hence thread-safe.

The terminology for "executing" is a bit different in both cases. In akka-stream, we define a **graph** and **materialize** it later. In scalaz-stream, we define a **process** and **run** it.

Both libraries are type-safe and enforce at compile-time that "inputs" can only be connected to "outputs" of the correct type. Scalaz-stream additionally checks that any splits and merges are connected correctly; in Akka, completeness and correctness of flow graphs connections is checked at run-time.

## akka-stream's components

In akka-stream, the three basic components which are used when defining a processing pipeline are:

* `Source`, has one output and no inputs
* `Flow`, has one input and one output (transformation component)
* `Sink`, has one input and no outputs

All inputs/outputs of these components are typed; a complete linear pipeline has a source, a number of flow components, and a single sink.

These components can be also combined into more complex shapes using `Graph`s, with any number of inputs and outputs. In graphs, we can use split and merge elements to attach multiple sources, multiple sinks, or to process elements in parallel. We can also build bigger graphs from smaller ones (as long as they are partial - have some input/outputs). In fact, in akka-stream everything is a partial flow graph, but that isn't really emphasised.

To define graphs, a nice DSL is available, which makes use of a mutable graph builder object. Once completed however, graphs are immutable.

## scalaz-stream's components 

The basic type in scalaz-stream is `Process[F[_], T]`, where:
 
* `T` is the type of the elements that are **emitted by** the stream (output)
* `F` describes the effects that may occur during execution of the stream

Scalaz-stream encourages and puts a huge emphasis on defining the streams using functional programming and in a "functional" way (as can be expected because of the scalaz- prefix; however, you have to know only a few [Scalaz](https://github.com/scalaz/scalaz) constructs to use scalaz-stream). This is also reflected in type safety: any side-effects should be scoped and made explicit by wrapping them e.g. in `Task`s. 

(Side-note: `Task` is Scalaz's better variant of Scala's `Future`. Why better? Let's just say you don't need to have an `ExecutionContext` to make a simple `.map(_ + 1)`.)

Note that there's no explicit notion of "input"; where elements come from in the first place is described by the type of effects (`T`).  There's a couple of type aliases which define different kinds of stream components:

* `Process0[T]` is a `Process[Nothing, T]`, a **pure** stream of values, evaluating such a stream shouldn't have any side effects
* `Process1[I, O]`, which is a **pure** transformation component, transforming values of type `I` into values of type `O`. It is also a `Process` by using a specially defined `F`. Understanding how this works is a bit tricky, and covered in detail in the [Functional Programming in Scala](http://www.manning.com/bjarnason/) book
* `Sink[O]` is a stream of effectful functions: `O => F[Unit]`

Very often `F` is `Task`, which is very general and can mean anything from reading a file through communicating over the network to running code on a different thread. However, to transform the stream, split/merge streams etc, we can usually use **pure** components.

# Execution model

The "blueprint" in scalaz-stream is a description of a state machine, which can have 4 states: `Emit`, `Halt`, `Append` and `Await`. We don't construct the state transitions directly though, but by using stream combinators from the declarative API. This state machine is then run (interpreted) by a **driver**. The driver knows how to evaluate the side-effects. In theory it is possible to write different stream interpreters and different drivers, but in practice you end up using the built-in driver which evaluates a `Process[Task, T]`, hence using `Task`s for encapsulating side-effects. In fact, in order to evaluate a pure process (e.g. a `Process0`), you first need to convert it to an effectul process using `.toSource`.

There are three options to "compile" the stream blueprint into a `Task`, which can be later run synchronously or asynchronously: `run`, `runLast` and `runLog`. The first discards the output values, running the stream only for its side-effects. The second returns the last value produced by the stream, and `runLog` returns all values (which can be dangerous, if the stream is very large).

In akka-stream, the "blueprint" is a fully connected flow graph. When executed the graph is first fused (when possible, multiple processing nodes are combined into one for performance), and each such combined node is materialised into an actor, which runs the actual processing logic. Apart from running appropriate logic, each transformation component can materialise into a value. E.g. a `Source` can materialise into a future which is completed when the source is done producing elements. A `Sink` can be materialised into a future indicating that the stream is finished, or into a fold over the stream elements (hence we can get the last or all elements produced by the stream).

# Push vs pull

scalaz-stream is entirely **pull-based**. Elements are evaluated one by one. When the driver wants to obtain the next stream element, it runs the state machine until an `Emit` state or end of stream is reached. This may of course involve processing multiple input elements, multiple lines of the input file etc., but no elements are processed or buffered "upfront".

akka-stream, on the other hand, uses **dynamic push / pull**. What does that mean? While elements in the stream flow in one direction, akka-stream (or more generally, reactive streams) maintain a second channel in the opposite direction along which **demand** flows. Demand is the number of elements that can be accepted by an upstream component. The initial demand comes from the `Sink` and travels upstream through the various `Flow` elements until it reaches the `Source`. Only when receiving demand, the source produces elements, which then travel downstream. When they reach the sink, an equivalent demand is send back upstream, and so on.

This model is more complex, but thanks to the buffering and hence possible batch-processing of elements at each stage, may have better performance. Also note that we can have a fully pull-based system by generating a demand of `1` in the sink and re-generating it only when the sink processes the received element.

# Backpressure

Because scalaz-stream is pull-based, backpressure comes "for free". No additional mechanisms are needed, as elements are only produced when requested.

In akka-stream, backpressure is implemented by constraining demand. If a downstream element cannot process elements fast enough, it will stop issuing demand, and this will propagate (not necessarily immediately) upstream.

# CODE! Features & API

Let's compare the performance, features and API of both libraries by looking at a number of code samples, implementing the same processing logic. In general scalaz-stream has a richer API, however there are situations in which akka-stream has combinators which are absent from scalaz-stream.

All examples are [available on Github](https://github.com/softwaremill/streams-tests).

# In-memory numeric stream

Let's start with a simple example of transforming an in-memory numeric stream in a couple of linear steps:

* map each element to two elements
* filter
* group in chunks of a given size
* map to compute group average
* return last result

In both cases the code is quite concise and straightforward:

```scala
// akka
def run(input: immutable.Iterable[Int]): Option[Double] = {
  implicit val system = ActorSystem()
  implicit val mat = ActorMaterializer()

  val r = Source.fromIterator(input)
    .mapConcat(n => List(n, n+1))
    .filter(_ % 17 != 0)
    .grouped(10)
    .map(group => group.sum / group.size.toDouble)
    .runWith(Sink.fold[Option[Double], Double](None)((_, el) => Some(el)))

  Await.result(r, 1.hour)
} 

// scalaz
def run(input: immutable.Iterable[Int]): Option[Double] = {
  processFromIterator(input.iterator)
    .flatMap(n => Process(n, n+1))
    .filter(_ % 17 != 0)
    .chunk(10)
    .map(group => group.sum / group.size.toDouble)
    .toSource.runLast.run
}

private def processFromIterator[T](iterator: Iterator[T]): Process0[T] = {
  def go(): Process0[T] = {
    if (iterator.hasNext) {
      Process.emit(iterator.next()) ++ go()
    } else Process.halt
  }
  go()
}
```

(for the full source, see [GroupedAverage.scala](https://github.com/softwaremill/streams-tests/blob/master/src/main/scala/com/softwaremill/streams/GroupedAverage.scala))

Apart from the fact that scalaz-stream doesn't have a built-in way to create a `Process` from an `Iterator`, the code is quite similar. `map` and `filter` should be familiar to any Scala programmer, and `chunk` or `grouped` are self-explanatory.

An important difference is that in the akka version, multiple threads are potentially involved, as each transformation stage is materialized into an actor and the actors run concurrently. In scalaz, concurrency is explicit, and unless we explicitly define at which point computations should be done in the background, they are run on the same thread.

The example would be also trivial to write using the normal collections API of course, but the important thing is that the stream processing would look the same and work equally well however large the input is, without reading all data into memory.

This is also a good entry point for a simple performance comparison! Let's see how these implementations compare in a totally unscientific benchmark running on inputs of size from 100 000 to 10 000 000 elements:

<table>
  <thead>
    <tr>
      <th>Implementation</th>
      <th>Number of elements</th>
      <th>Average time</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>akka</td>
      <td>100 000</td>
      <td>0.06s</td>
    </tr>
    <tr>
      <td>scalaz</td>
      <td>100 000</td>
      <td>0.87s</td>
    </tr>
    <tr>
      <td>akka</td>
      <td>1 000 000</td>
      <td>0.51s</td>
    </tr>
    <tr>
      <td>scalaz</td>
      <td>1 000 000</td>
      <td>8.65s</td>
    </tr>
    <tr>
      <td>akka</td>
      <td>10 000 000</td>
      <td><strong>4.99s</strong></td>
    </tr>
    <tr>
      <td>scalaz</td>
      <td>10 000 000</td>
      <td><strong>85.55s</strong></td>
    </tr>
  </tbody>
</table>

akka-stream is doing much more threading, however scalaz-stream has a high overhead because it creates a lot of short-lived intermediate objects. In the end, the akka version ends up being **17x** faster.

# Streaming & transforming a file

Another canonical example is reading data from file, transforming it and writing the results to another file. There are again a couple of transformation stages, looking quite familiar to anybody who used the collection API.

```scala
// akka
override def run(from: File, to: File) = {
  implicit val system = ActorSystem()
  implicit val mat = ActorMaterializer()
 
  val r: Future[Long] = FileIO.fromFile(from)
    .via(Framing.delimiter(ByteString("\n"), 1048576))
    .filter(!_.contains("#!@"))
    .map(_.replace("*", "0"))
    .intersperse("\n")
    .map(ByteString(_))
    .toMat(FileIO.toFile(to))(Keep.right)
    .run()

  Await.result(r, 1.hour)
} 

// scalaz
override def run(from: File, to: File) = {
  io.linesR(from.getAbsolutePath)
    .filter(!_.contains("#!@"))
    .map(_.replace("*", "0"))
    .intersperse("\n")
    .pipe(text.utf8Encode)
    .to(io.fileChunkW(to.getAbsolutePath))
    .run.run

  to.length()
}
```

Again, let's run a performance comparison of the two implementations, transferring files of sizes 10, 100 and 500MB. The tests are executed multiple times in random order on the same machine with a SSD:

<table>
  <thead>
    <tr>
      <th>Implementation</th>
      <th>File size</th>
      <th>Average time</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>akka</td>
      <td>10</td>
      <td>0.33s</td>
    </tr>
    <tr>
      <td>scalaz</td>
      <td>10</td>
      <td>0.78s</td>
    </tr>
    <tr>
      <td>akka</td>
      <td>100</td>
      <td>3.16</td>
    </tr>
    <tr>
      <td>scalaz</td>
      <td>100</td>
      <td>7.57</td>
    </tr>
    <tr>
      <td>akka</td>
      <td>500</td>
      <td><strong>14.41s</strong></td>
    </tr>
    <tr>
      <td>scalaz</td>
      <td>500</td>
      <td><strong>37.69s</strong></td>
    </tr>
  </tbody>
</table>

akka-stream is still faster, however the difference is much smaller then before, about **2.5x**. In this test probably the I/O is the most significant, with the stream processing having a smaller impact on the end results.

# Merging sorted streams

While linear transformations are easy to get right, let's see how combining multiple streams is handled. Let's say we have two streams of sorted values, and we want to merge them into a single sorted stream. Here the code differs quite significantly. First, let's look at the scalaz-stream version:

```scala
def merge[T: Ordering](l1: List[T], l2: List[T]): List[T] = {
  val p1 = Process(l1: _*)
  val p2 = Process(l2: _*)

  def next(l: T, r: T): Tee[T, T, T] = if (implicitly[Ordering[T]].lt(l, r))
    Process.emit(l) ++ nextL(r)
  else
    Process.emit(r) ++ nextR(l)
 
  def nextR(l: T): Tee[T, T, T] = 
    tee.receiveROr[T, T, T](emit(l) ++ tee.passL)(next(l, _))
  def nextL(r: T): Tee[T, T, T] = 
    tee.receiveLOr[T, T, T](emit(r) ++ tee.passR)(next(_, r))
  def sortedMergeStart: Tee[T, T, T] = 
    tee.receiveLOr[T, T, T](tee.passR)(nextR)

  p1.tee(p2)(sortedMergeStart).toSource.runLog.run.toList
}
```

The main mechanism used here is a `tee`, which is used to combine two streams in a **deterministic** way. The `tee` takes three parameters: two streams (`p1` and `p2`, which emit elements of the input lists), and a description on how to merge the streams (`sortedMergeStart`). Depending on what values we have seen and from which side they come, we model the computation as a state machine.

The initial state is `sortedMergeStart`, when we have seen no values. We then request a value from the left (or, if there are none, emit the right stream). Once we have a value from the left, we move to the `nextL` state and request a value from the right (`nextR`). Having both we can compare them and emit the smaller, proceeding to the appropriate state (we still have one value left and need to get either the next left or right one).

It can be a bit tricky to switch to this kind of thinking at first, especially after spending a lot of time writing things in a more imperative way, but once it sinks it, I think that this declarative approach is very elegant and clear. And type safe!

How does the akka-stream version look like?

```scala
def merge[T: Ordering](l1: List[T], l2: List[T]): List[T] = {
  val out = Sink.fold[List[T], T](Nil) { case (l, e) => l.+:(e)}

  val g = GraphDSL.create(out) { implicit builder => sink =>
    val merge = builder.add(new SortedMerge[T])

    Source(l1) ~> merge.in0
    Source(l2) ~> merge.in1
                  merge.out ~> sink.in

    ClosedShape
  }

  implicit val system = ActorSystem()
  implicit val mat = ActorFlowMaterializer()
  try Await.result(RunnableGraph.fromGraph(g).run(), 1.hour).reverse finally system.terminate()
}

// + SortedMerge code!
```

First we define a fold-Sink which always contains the last element seen, hence will materialize to a `Future[Int]`. Then we use the (mutable) graph builder & DSL to define how data should flow in the system. To do that, we create a specialized `merge` component (more on that later), which has two inputs and one output. We connect the two inputs to the input list, and the output to the sink that we have define earlier. It's a closed graph since all inputs & outputs are connected; it is also possible to define a partial graph with a given shape. Once defined, the graph `g` is immutable and can be materialized multiple times.

The most important part is of course the `SortedMerge` component which can be implemented using the provided `GraphStage` DSL for defining arbitrary splits/merges. See [MergeSortedStreams.scala](https://github.com/softwaremill/streams-tests/blob/master/src/main/scala/com/softwaremill/streams/MergeSortedStreams.scala) for the full source. The main part looks quite similar to the scalaz version, you can see again a state machine, either reading from the left or from the right. Again, it can be a bit tricky to switch to such mode of thinking, but the main logic looks nice and clean, with some bolierplate to define the stage's inputs & outputs.

The akka-stream version is more error-prone than scalaz-stream, because of the mutable calls in the `GraphStage`, however these are mostly hidden using a function-based API.

# Parallel processing

A quite common use-case is to process some data items in parallel. Let's say we have a stream of numbers and we want to split them into two streams of odd/even numbers, transform in parallel (we'll emulate an expensive computation using `Thread.sleep`) and merge the result. The split is deterministic (depending on `% 2 == 0` result), the merge is nondeterministic (we combine the results from the two streams in whatever order they complete).

First, let's look at the akka-stream version. The full source is in [ParallelProcessing.scala](https://github.com/softwaremill/streams-tests/blob/master/src/main/scala/com/softwaremill/streams/ParallelProcessing.scala):

```scala
override def run(in: List[Int]) = {
  val out = Sink.fold[List[Int], Int](Nil) { case (l, e) => l.+:(e)}

  val g = GraphDSL.create(out) { implicit builder => sink =>
    val start = Source(in)
    val split = builder.add(new SplitRoute[Int](
      el => if (el % 2 == 0) Left(el) else Right(el)))
    val merge = builder.add(Merge[Int](2))

    val f = Flow[Int].map { el => Thread.sleep(1000L); el * 2 }

    start ~> split.in
             split.out0 ~> f ~> merge
             split.out1 ~> f ~> merge
                                merge ~> sink

    ClosedShape
  }

  implicit val system = ActorSystem()
  implicit val mat = ActorFlowMaterializer()
  try Await.result(RunnableGraph.fromGraph(g).run(), 1.hour).reverse finally system.terminate()
}
```

Note that using the graph DSL we can create nice ASCII-art representing our graph! Unfortunately IntelliJ doesn't keep it during code reformatting ;)

Looking at the code it is quite easy to see what's happening. This time we define a sink which collects all elements received in a list. Then we define a graph where we connect the input stream to the input of the split, and we use the same transformation blueprint (`f`) to connect it to both outputs of the sink. Note that while we use the same blueprint, it will be materialised *twice* into two different actors.

Finally, we use the built-in merge component to combine the streams again.

Similarly to the previous sorted merge example, we need a specialised split component to split the stream elements depending if they are odd or even:

```scala
class SplitStage[T](splitFn: T => Either[T, T]) extends GraphStage[FanOutShape2[T, T, T]] {

  val in   = Inlet[T]("SplitStage.in")
  val out0 = Outlet[T]("SplitStage.out0")
  val out1 = Outlet[T]("SplitStage.out1")

  override def shape = new FanOutShape2[T, T, T](in, out0, out1)

  override def createLogic(inheritedAttributes: Attributes) = new GraphStageLogic(shape) {

    setHandler(in, ignoreTerminateInput)
    setHandler(out0, eagerTerminateOutput)
    setHandler(out1, eagerTerminateOutput)

    def doRead(): Unit = {
      read(in)(
        el => splitFn(el).fold(doEmit(out0, _), doEmit(out1, _)),
        () => completeStage()
      )
    }

    def doEmit(out: Outlet[T], el: T): Unit = emit(out, el, doRead _)

    override def preStart() = doRead()
  }
}
```

The code is simpler than the `SortedMerge` case. The "core logic" of emitting the element to one output or the other is a single line; the rest are decorations needed to "make things work".

How does the scalaz-stream version compare?

```scala
def run(in: List[Int]): List[Int] = {
  val start = Process(in: _*)

  val queueLimit = 1
  val left = async.boundedQueue[Int](queueLimit)
  val right = async.boundedQueue[Int](queueLimit)

  val enqueue: Process[Task, Unit] = start.zip(left.enqueue.zip(right.enqueue))
    .map { case (el, (lEnqueue, rEnqueue)) =>
    if (el % 2 == 0) lEnqueue(el) else rEnqueue(el)
  }.eval.onComplete(Process.eval_(left.close) ++ Process.eval_(right.close))

  val processElement = (el: Int) => Task { Thread.sleep(1000L); el * 2 }
  val lDequeue = left.dequeue.evalMap(processElement)
  val rDequeue = right.dequeue.evalMap(processElement)
  val dequeue = lDequeue merge rDequeue

  enqueue
    .wye(dequeue)(wye.either)
    .collect { case \/-(el) => el }
    .runLog.run.toList
}
```

Looking at it it's not immediately clear what happens (unlike the flow graph). Why do we need those queues? There are two possibilities: (1) I don't know scalaz-stream good enough; (2) it's a consequence of pull-only + "explicit concurrency" approach. We want to run two streams in parallel, and when the driver evaluates the input it needs a way to direct the elements to either of the concurrent streams.

Hence we create two queues, one which will hold odd elements, one which will hold even elements. The queue have a very small bound (1), but it could be larger if we'd like to buffer elements. From the scalaz-stream queues we can obtain two processes: an `queue.enqueue` sink (that is a stream of functions `Int => Task[Unit]`) which puts elements on the queue, and a `queue.dequeue` stream of elements on the queue.

First we zip the `start` input stream with both `queue.enqueue` streams, and depending on `% 2 == 0` result, evaluate either one or the other task. The `.eval` stream combinators turns a `Process[Task, Task[O]]` into a `Process[Task, O]`: it turns a stream of effectful values into a stream of values, evaluating these effects during process execution. This type-checks as the process is specified to have `Task` effects during execution. That way we obtain the `enqueue` process of unit values, corresponding to successfull enqueues.

Secondly, we map the `queue.dequeue` processes using our `processElement` blueprint. Again, we use the same blueprint, which will be executed twice. We then merge the left and right processes and obtain the `dequeue` process using the `merge` combinator: under the hood, it uses `wye`, a non-deterministic way to combine two processes (as opposed to the deterministic `tee`). A wye pulls items from both streams in parallel and emits whichever value is produced first.

As we want to run the `enqueue` & `dequeue` processes at the same time (they "cooperate" by enqueueing and dequeueing elements), we merge them again using a `wye` which returns a disjunction (either `()` corresponding to enqueue or a value corresponding to a transformed element) and collect only the number elements. This can now be run and executed.

# Slow consumers

Finally, let's see how we can solve the slow-consumer problem. Let's say we have a fast producer, which emits an element every 100ms, and a slow consumer which can consume one element each second. We don't want to hold up the producer, but the elements can be combined into summaries which can be then passed to the consumer. The sources are in [SlowConsumer.scala](https://github.com/softwaremill/streams-tests/blob/master/src/main/scala/com/softwaremill/streams/SlowConsumer.scala).

First, let's look at the akka-stream version:

```scala
object AkkSlowConsumer extends App {
  implicit val system = ActorSystem()
  implicit val mat = ActorFlowMaterializer()
  try {
    val future = Source.tick(0.millis, 100.millis, 1)
      .conflate(identity)(_ + _)
      .runForeach { el =>
        Thread.sleep(1000L)
        println(el)
      }

    Await.result(future, 1.hour)
  } finally system.terminate()
}
```

Because akka is a push-pull hybrid, things are quite easy, especially that there's a built-in `conflate` combinator which does exactly what we want. Another one with similar functionality is `groupedWithin`.

If you had to guess what will be the output of that app, what would it be? I would probably say that values of about 10 (+/- 1 depending on exact scheduling) would be printed, as the producer is 10x faster than the consumer and we add up the elements while waiting for the consumer. However, the actual output is an alternating 19 and 1, or 20 and 1. Why?

The answer is buffering. The sink will request a couple of elements in advance, hence in the beginning you will see a couple of `1` printed (4x in my case - it seems that's the initial demand). However that will cause some elements to build up in the conflate stage (`10 - initial demand`), so you should see a `6`. Subsequently, it seems that the demand is adjusted, resulting sometimes in two elements being requested from `conflate` at a time (producing `19` and `1`), and sometimes none.

And now the scalaz-stream version:

```scala
object ScalazSlowConsumer extends App {
  implicit val scheduler = Strategy.DefaultTimeoutScheduler

  val queue = async.boundedQueue[Int](10000)
  val enqueueProcess = time.awakeEvery(100.millis)
    .map(_ => 1)
    .to(queue.enqueue)
  val dequeueProcess = queue.dequeueAvailable
    .map(_.sum)
    .flatMap(el => Process.eval_(Task {
      Thread.sleep(1000L)
      println(el)
    }))

  (enqueueProcess merge dequeueProcess).run.run
}
```

There's no built-in conflate-like combinator. As scalaz-stream is a strictly pull-based system, with an explicit approach to concurrency, we need to again create an intermediate queue which will buffer the results. The `dequeueAvailable` returns a stream which, when executed, takes all elements from the queue that are currently available, which we then have to combine.

As in the previous examples we create two streams, one which enqueues elements and one which dequeues them, merge them together, and run the stream processing discarding the result, only for the side-effect.

Because scalaz-stream doesn't do any buffering, the results are as you could expect, initially `1` and then `10`s.

# Ecosystem

Stream combinators are great, but in the end you have to somehow get the data from the user and send back responses. That's why the ecosystem around the stream processing libraries is equally important as the libraries themselves.

In scalaz-stream, we have for example [http4s](http://http4s.org), which is a "minimal, idiomatic Scala interface for HTTP". The akka-stream counterpart is [akka-http](http://akka.io/docs/), the successor of Spray with built-in reactive streams integration. 

To talk to a database, the recently announced [Slick 3](http://slick.typesafe.com) offers reactive streams integration, not only when reading data, but also for establishing the "right number" of connections. I don't think anybody will miss sizing the connection pool! The scalaz-stream equivalent is [doobie](https://github.com/tpolecat/doobie), a purely functional JDBC layer for Scala.

I think things are only starting to get interesting, and we'll see much more of these libraries pop up in the near future!

# Summing up

I don't think there's a clear winner. Both libraries are great, provide an elegant, declarative, composable way to define stream processing. scalaz-stream puts more emphasis on making side-effects and concurrency explicit, defining the stream "functionally", while akka-stream aims to be a solid, performant foundation for building libraries and applications.

**akka-stream** seems a bit "heavier", as it uses more threading (everything is wrapped in an actor), does quite a lot of internal buffering, so exactly when and how many elements are going to be produced may not be immediately clear. The API is in general declarative, but sometimes you need to use mutable state and imperative constructs. It's also the faster of the two, and as it implements the [reactive streams](http://www.reactive-streams.org) standard it brings a promise of easy integration into other apps using streaming data processing. Plus, it has a Java API, which can definitely have a huge impact on adoption.

Modelling complex flow graphs is also more intuitive (for me) in akka-stream than scalaz-stream thanks to the graph DSL. More genreally, I think understanding how data flows can be easier for a newcomer in akka-stream. But then, writing custom splits/merges requires some boilerplate.

**scalaz-stream** is definitely harder to grasp at first (at least for me, I'm far from understanding the internals), but it gives you very precise control over threads and a clear one-at-a-time execution model. It feels lightweight and self-contained, and definitely modelling complex splits & merges in a declarative, functional way gives a "I did it" satisfaction ;). You'll have to use mutable state very rarely, if at all.

It's great to have choice, depending on the projects at hand and personal tastes & programming style! I hope the above examples will be helpful. If I missed some detail on how either akka-stream or scalaz-stream work, or if the code can be improved, let me know!

# Updates

* 10/09/2015: Updating to akka-stream 1.0 
* 8/10/2015: Updating to scalaz-stream 0.8
* 16/11/2015: Updating to akka-stream 2.0-M1
* 1/12/2015: Updating to akka-stream 2.0-M2
* 22/12/2015: Updating to akka-stream 2.0