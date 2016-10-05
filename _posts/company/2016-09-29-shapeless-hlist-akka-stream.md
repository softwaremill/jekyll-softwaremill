---
title: "Using shapeless' HLists for extra type safety (in Akka Streams)"
description: HLists, huh? What are they good for? Apparently for something! 
author: Mikołaj Koziarkiewicz
author_login: mikolaj_koziarkiewicz
categories:
- functional
- akka
- scala
- company
layout: simple_post
---

# Introduction

[Shapeless](https://github.com/milessabin/shapeless/) is probably the most known "intermediate-level" Scala library. 
Or, rather, the most notorious one. Scala devs usually encounter it when 
 growing impatient with creating various data type conversion boilerplate - 
 from tuples to case classes, from tuples to different tuples etc.
    
And that's where the aforementioned notoriety comes in - the library makes
extensive use of Scala's type system, and that's plainly visible 
[throughout the documentation](https://github.com/milessabin/shapeless/wiki/Feature-overview:-shapeless-2.0.0). 
This can be pretty intimidating for the uninitiated, and put them off taking 
advantage of shapeless.

Which is a shame, since the library is well-designed, and requires basically 
no understanding of type-level "magic" to use effectively.

In fact, if you have not used shapeless until now, I urge you to take a look 
now at the alluded-to [tuple operations](https://github.com/milessabin/shapeless/wiki/Feature-overview:-shapeless-2.0.0#hlist-style-operations-on-standard-scala-tuples)
  and [case-class conversions](https://github.com/milessabin/shapeless/wiki/Feature-overview:-shapeless-2.0.0#generic-representation-of-sealed-families-of-case-classes),
as those are almost guaranteed to be useful to a Scala dev at some point.
**Only once you do**, come back to this article.

# HLists

The workhorse of shapeless is the `HList` type, or _Heterogeneous List_.

As the name suggests, it's a list data type that stores heterogeneous elements,
 i.e. ones of different types.

The trick here, however, is that a `HList` also preserves the type of *each* element
within *its own* type signature. Here's a quick demonstration:
 
```scala
val normalList = 1 :: "SomeString" :: true :: Nil
normalList: List[Any] = List(1, SomeString, true)

import shapeless._ 
val hList = 1 :: "SomeString" :: true :: HNil 
hList: Int :: String :: Boolean :: HNil = 1 :: SomeString :: true :: HNil
````

Two things happening here that are worth mention:

1. The `HList`s are created similarly to "normal" Lists:
    - the process is started by consing to `HNil`, just like with `List`'s `Nil`,
    - elements are added via a cons `::` operator.
1. The types are indeed preserved ( `Int :: String :: Boolean :: HNil` vs `List[Any]` in our example).

<br/>
It is readily apparent that `HList`s are a powerful construct. In fact, they 
are usually _too powerful_ for usual purposes - it does not make sense to 
 introduce them as, say, a general replacement for collection types, precisely 
 due to the type strictness they introduce.
 
Because of that, you usually see them as part of the various abstractions 
shapeless uses. However, `HList` aren't solely an academic curiosity - 
they can be harnessed by the library's end users in some specific cases.

# Trying to preserving type information

Let's start with a practical problem first. We want to create an Akka Streams graph
 that takes from a source, and "parses" the data in several different ways, in parallel.
 
So, the initial program looks like this (for a stream of `String`s):
 
```scala
object types {
  type Data = String
  type ProcessingFlow = Flow[Data, Data, _]
}

object Main extends App {

  implicit val system = ActorSystem()
  implicit val m = ActorMaterializer()

  val metaFlow: ProcessingFlow = ??? //placeholder for our flow

  val resultList = Source.apply(List("1", "2", "3", "4")).via(metaFlow)
                    .runWith(Sink.seq)

  println(Await.result(resultList, Duration.Inf))

  system.terminate()

}

```
 
   
An additional complication exists - we are using preexisting components in the definitions. 
Those components form complementary pairs, one for "parsing" the data item, the other
 for "processing" it.
 
Let's define a specification type for that, and some example implementations:

```scala
trait ParserStageDef[T] {
  def parser: Data => T
  def processor: T => Data
}

val decorator: ParserStageDef[String] = new ParserStageDef[String] {
  def parser = identity
  def processor = i => "|"+i+"|"
}

val incrementer: ParserStageDef[Int] = new ParserStageDef[Int] {
  def parser = _.toInt
  def processor = i => (i + 1).toString
}
```

OK, let's now implement our `metaFlow`. Graphically, it would like this:

![](/img/uploads/2016/09/shapeless_flow.png)

which leads us to the following code representation attempt:
 
```scala
val specs = List(decorator,incrementer)
val specSize = specs.length

val metaFlow = GraphDSL.create() { implicit builder =>
  import GraphDSL.Implicits._

  val broadcast = builder.add(Broadcast[Data](specsSize))
  val merge = builder.add(Merge[Data](specsSize))

  //glue for the ParserStageDefs
  specs.map(s => Flow[Data].map(s.parser).map(s.processor))
                    .foreach(broadcast ~> _ ~> merge)

  FlowShape(broadcast.in, merge.out)
}
```

However, when we try to compile it, we would get:

```
[error]  type mismatch;
[error]  found   : (some other)scala.scala._1 => types.Data
            (which expands to)  (some other)scala.scala._1 => String
[error]  required: scala.scala._1 => ?
```

What's going on?

# A limitation

The problem lies in the fact that the type information in our `specs` list is not preserved.
Or rather, not preserved the way we want to - the type of the `List` elements is `ParserStageDef[_ >: Int with String]`,
so the lowest common supertype for our `decorator` and `incrementer`.
 
The above implies that, when mapping between the `parser` and `processor` elements, **the compiler has no way to provide 
the actual type `T` that's used within the given spec**.

Of course, you might immediately try to create a generic method, replacing `specs.map ... ` with something like:

```scala
def toFlowSimple[T](f: ParserStageDef[T]) = 
        Flow[Data].map(f.parser).map(f.processor)

specs.map(toFlowSimple).foreach(broadcast ~> _ ~> merge)
```

but **this will fail** as well, albeit with a more specific message that tells us the same thing:

```
[error] polymorphic expression cannot be instantiated to expected type;
[error]  found   : [T]ParserStageDef[T] => 
                        akka.stream.scaladsl.Flow[String,types.Data,akka.NotUsed]
[error]     (which expands to)  [T]ParserStageDef[T] => 
                        akka.stream.scaladsl.Flow[String,String,akka.NotUsed]
[error]  required: ParserStageDef[_ >: Int with String] => ?
```

# A solution

Here's where `HList`s come to the rescue. Because they preserve the complete type information for each element,
it's possible to define our flow very similarly to our last attempt.

First, let's replace our list with an `HList`:

```scala
import shapeless.ops.hlist._
import shapeless._
//...

val specs = decorator :: incrementer :: HNil
val specsSize = specs.length.toInt
```

Now, for the mapping from `ParserStageDefs` into `Flows`, we need to take a different approach, as the `map` for `HList` 
requires something called `Poly` - a [polymorphic function value](https://github.com/milessabin/shapeless/wiki/Feature-overview:-shapeless-2.0.0#polymorphic-function-values).

Here's how one would look like in our case:

```scala
import shapeless.PolyDefns.~>
object toFlow extends (ParserStageDef ~> ProcessingFlow) {
  override def apply[T](f: ParserStageDef[T]) = 
                Flow[Data].map(f.parser).map(f.processor)
}
```

For it to work, we'll also have change `ProcessingFlow` to `type ProcessingFlow[_] = Flow[Data, Data, _]`, since the polymorphic 
function above expects a higher-kinded type. 

Now, our central statement turns out to be:

```scala
//we convert to a List[ProcessingFlow[_]] for simplicity
specs.map(toFlow).toList.foreach(broadcast ~> _ ~> merge)
```

and we're all set!

Here's the full code:

```scala
import akka.actor.ActorSystem
import akka.stream.{ActorMaterializer, FlowShape}
import akka.stream.scaladsl.{Broadcast, Flow, GraphDSL, Merge, Sink, Source}
import shapeless._

import scala.concurrent.Await
import scala.concurrent.duration.Duration
import types.{Data, ProcessingFlow}


object types {
  type Data = String
  type ProcessingFlow[_] = Flow[Data, Data, _]
}

object ListPlay extends App {
  val decorator: ParserStageDef[String] = new ParserStageDef[String] {
    def parser = identity
    def processor = i => "|"+i+"|"
  }

  val incrementer: ParserStageDef[Int] = new ParserStageDef[Int] {
    def parser = _.toInt
    def processor = i => (i + 1).toString
  }

  val specs = decorator :: incrementer :: HNil
  val specsSize = specs.length.toInt

  val metaFlow = GraphDSL.create() { implicit builder =>
    import GraphDSL.Implicits._

    val broadcast = builder.add(Broadcast[Data](specsSize))
    val merge = builder.add(Merge[Data](specsSize))

    specs.map(toFlow).toList.foreach(broadcast ~> _ ~> merge)

    FlowShape(broadcast.in, merge.out)
  }

  implicit val system = ActorSystem()
  implicit val m = ActorMaterializer()

  val resultList = Source.apply(List("1", "2", "3", "4")).via(metaFlow)
                      .runWith(Sink.seq)
                      
  println(Await.result(resultList, Duration.Inf))

  system.terminate()
}


import shapeless.PolyDefns.~>
object toFlow extends (ParserStageDef ~> ProcessingFlow) {
  override def apply[T](f: ParserStageDef[T]) = 
                Flow[Data].map(f.parser).map(f.processor)
}

trait ParserStageDef[T] {
  def parser: Data => T
  def processor: T => Data
}
```

Which outputs, as expected:

```scala
Vector(|1|, 2, |2|, 3, |3|, 4, |4|, 5)
```

# One more step

## Motivation

Inlining the creation is nice for starters, but our `metaFlow` definition grew a bit long,
so it would be conformant to good practice to encapsulate it in a separate method.
  
Let's start with a naive approach, by simply defining it as parametrized on an `HList`, and 
see where it goes from there:

```scala
val metaFlow = buildGraph(specs)

//...

def buildGraph[T <: HList](specs: T) = {
  val specsSize = specs.runtimeLength

  GraphDSL.create() { implicit builder =>
    import GraphDSL.Implicits._

    val broadcast = builder.add(Broadcast[Data](specsSize))
    val merge = builder.add(Merge[Data](specsSize))

    specs.map(toFlow).toList.foreach(broadcast ~> _ ~> merge)

    FlowShape(broadcast.in, merge.out)
  }
}
```

And, as suspected, we get an error:

```
[error]     could not find implicit value for parameter mapper: 
                            shapeless.ops.hlist.Mapper[toFlow.type,T]
[error]     specs.map(toFlow).toList.foreach(broadcast ~> _ ~> merge)
```

What's going on?
 
## The esoteric ops

In general, shapeless `HList`s are pretty much bare-bone data types. All auxiliary functionality 
is contained in various implicits in the `shapeless.ops.hlist` object.

Previously, we had everything inline, allowing for the implicit to correctly resolve - the type "shape" of the 
 `HList` was fully compile-time-known during the `map` step. Now that type information is not present, so we need to be more explicit.
 
Let's do as the compiler says and change the signature to:

```scala
def buildGraph[T <: HList](specs: T)(implicit m: Mapper[toFlow.type, T])
```

but that still leaves us with:

```
[error]     could not find implicit value for parameter toTraversableAux: 
                shapeless.ops.hlist.ToTraversable.Aux[m.Out,List,Lub]
[error]     specs.map(toFlow).toList.foreach(broadcast ~> _ ~> merge)
[error]                       ^
```

Obviously, we need to define an implicit for another helper. However, we can't just blindly follow the compiler's message,
since that will result in:

```
[error]      illegal dependent method type: parameter may only be referenced 
             in a subsequent parameter section
```

referring to the `m.Out` type restriction. It looks like we're stuck, since 
[Scala allows only one implicit parameter list per definition](https://github.com/scala/scala.github.com/pull/520) . 

## Making ops mutually friendly

Fortunately, as this [Stack Overflow answer nicely explains](http://stackoverflow.com/a/19634547/724361), the operation types in shapeless
expose the "output" type parameters, allowing us to create a sensible binding.
 
Here's our final signature:

```scala
def buildGraph[T <: HList, Mapped <: HList](specs: T)
                (implicit m: Mapper.Aux[toFlow.type, T, Mapped],
                 t: ToTraversable.Aux[Mapped, List, ProcessingFlow[_]]) = {
```


What's going on here is that `map` and `toList` are using their respective op helpers 
to perform the actual work. 

To clarify the situation visually, here's a diagram demonstrating the 
data flow (method calls are in green):

![](/img/uploads/2016/09/shapeless_methods_and_data.png)

As you can see, both op helpers have `apply`ies that are called with the appropriate type signature.

## To Aux or not to Aux

Some readers might have noticed that we've switched from `Mapper` to `Mapper.Aux` at one point (while 
also using `ToTraversible.Aux` instead of `ToTraversible`).

As the name suggests, the `Aux` types are utility aliases that allow for a more concise representation 
 of the helpers. For example, the `Mapper.Aux` signature looks like this:
 
```scala
type Aux[HF, In <: HList, Out0 <: HList] = Mapper[HF, In] { type Out = Out0 }
```
 
In other words, using `Aux` simply lets us write a more compact method definition, by moving the `Out` 
type redefinition to a third, additional, type parameter.
 
OK, we've explained what's going on, now *why* is all this necessary?

## Consequences of type-wrangling 

Note that:

 - we've exposed the "output" type of `Mapper` by aliasing it into the new `Mapped` parameter,
 - we've set the last `ToTraversable.Aux`'s parameter to `ProcessingFlow[_]`.

The last one, combined with the `toFlow`'s signature is what actually restricts the "shape" of the `HList` provided
in `buildGraph`'s argument only to ones that contain `ProcessingFlow[_]` elements. In fact, now, if we do something like this:

```scala
val specs = decorator :: incrementer :: 2 :: HNil
```  

we will get a compile-time error.

## Final full code

```scala
import akka.actor.ActorSystem
import akka.stream.{ActorMaterializer, FlowShape}
import akka.stream.scaladsl.{Broadcast, Flow, GraphDSL, Merge, Sink, Source}
import shapeless.ops.hlist._
import shapeless._

import scala.concurrent.Await
import scala.concurrent.duration.Duration
import types.{Data, ProcessingFlow}


object types {
  type Data = String
  type ProcessingFlow[_] = Flow[Data, Data, _]
}

object ListPlay extends App {

  val decorator: ParserStageDef[String] = new ParserStageDef[String] {
    def parser = identity
    def processor = i => "|"+i+"|"
  }

  val incrementer: ParserStageDef[Int] = new ParserStageDef[Int] {
    def parser = _.toInt
    def processor = i => (i + 1).toString
  }

  val specs = decorator :: incrementer :: HNil

  val metaFlow = buildGraph(specs)

  implicit val system = ActorSystem()
  implicit val m = ActorMaterializer()

  val resultList = Source.apply(List("1", "2", "3", "4")).via(metaFlow)
                      .runWith(Sink.seq)

  println(Await.result(resultList, Duration.Inf))

  system.terminate()

  def buildGraph[T <: HList, Mapped <: HList](specs: T)
                  (implicit m: Mapper.Aux[toFlow.type, T, Mapped],
                   t: ToTraversable.Aux[Mapped, List, ProcessingFlow[_]]) = {
  
    val specsSize = specs.runtimeLength

    GraphDSL.create() { implicit builder =>
      import GraphDSL.Implicits._

      val broadcast = builder.add(Broadcast[Data](specsSize))
      val merge = builder.add(Merge[Data](specsSize))

      specs.map(toFlow).toList.foreach(broadcast ~> _ ~> merge)

      FlowShape(broadcast.in, merge.out)
    }
  }

}

import shapeless.PolyDefns.~>
object toFlow extends (ParserStageDef ~> ProcessingFlow) {
  override def apply[T](f: ParserStageDef[T]) = 
                Flow[Data].map(f.parser).map(f.processor)
}

trait ParserStageDef[T] {
  def parser: Data => T
  def processor: T => Data
}
```

And here are the essential SBT settings:

```scala
scalaVersion := "2.11.8"

libraryDependencies ++= Seq(
"com.chuusai" %% "shapeless" % "2.3.2",
"com.typesafe.akka" %% "akka-stream" % "2.4.10"
)
```

# Comments and conclusions

As already said in the introduction, shapeless' `HList`s aren't really the most immediately beneficial element to the library.

Nevertheless, [like others](http://stackoverflow.com/q/11825129/724361), I've wondered what are the practical uses of this ADT
(beyond the utility role outlined in the answers linked above), and I hope it was interesting to see one scenario where `HList`s
are indeed useful intrinsically, and independently.

PS. For learning more about the general aspects and functionality of shapeless, 
check out [Valentin Kasas' presentation at this year's Scalar](https://www.youtube.com/watch?v=JKaCCYZYBWo).