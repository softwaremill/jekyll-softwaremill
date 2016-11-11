---
title: Beautiful folds in Scala
description: Haskell has beautiful folds. How about Scala?
author: Adam Warski
author_login: warski
categories:
- scala
- haskell
- functional programming
- big data
- lens
- company
layout: simple_post
---

I've recently watched a talk by [Gabriel Gonzalez](https://twitter.com/GabrielG439) on "Beautiful Folds" ([slides](https://github.com/Gabriel439/slides/blob/master/munihac/foldmap.md), [video](https://www.youtube.com/watch?v=6a5Ti0r8Q2s)), given at [MuniHac 2016](http://munihac.de). As this is a Haskell conference, the talk (unsurprisingly) used Haskell as the base language. Being only a theoretical Haskell coder, and a much more practical Scala one, I started to wonder if the folds would be equally beautiful in Scala. Hence, here's my take.

We'll be using a lot of monoids, so the next section will briefly introduce them. Feel free to skip to the next section if you are already faimilar with the concept. We'll be also using some other constructs common in Functional Programming, and if possible at all in a brief way, I'll try to introduce them so hopefully the article will be understandable for FP-beginners as well (if not, please ask questions in the comments!).

Finally, if you'd like a "use it now" version, skip to the last section :)

# Monoids

A monoid is a data type (such as `Int`, `String`, or your own `Foo`), let's call it `A`, together with two operations (methods):

* `empty: A`
* `combine(x: A, y: A): A`

There are two restrictions on how these operations should behave:

* `combine(x, combine(y, z)) == combine(combine(x, y), z)`: `combine` is associative
* `combine(x, empty) == combine(empty, x) == x`: `empty` is the neutral element of `combine`

Monoids are all around us. For example, `Int`s with `0` as the empty element and `+` as the operation are the simplest example. Or, `Int`s with `1` as the empty element and `*` as the operation. Or, `String`s with `""` as the empty element and `+` (string concatenation). We'll see much more examples of monoids as we progress.

We'll be using the [Cats](https://github.com/typelevel/cats) implementation of [`Monoid`](https://github.com/typelevel/cats/blob/master/kernel/src/main/scala/cats/kernel/Monoid.scala). Unfortunately, unlike in Haskell, there's no "standard" or "most popular" implementation of monoids, so you'll encounter a couple of competing ones. Luckily, the idea is the same everywhere, and they can be trivially translated to each other.

# Fold definition

Folding is all about combining a sequence of input elements into a single output element. You've probably seen `foldLeft` or `foldRight` used in standard Scala libraries a couple of times. The basic operation which we'll be implementing is `fold[I, O]: Seq[I] => O`. `I` is the type of the input parameter, and `O` is the type of the output. But, with an additional twist.

We'll define a data structure, `Fold` which will *describe* how the folding should be done. Then, we'll define a `fold` method, which will be a specific `driver`, using the description to actually fold the input data into an output element. Why the separation? We can have many drivers (as we will see later), but the description of *how* stays the same.

First, let's look at the definition of `Fold` in Haskell:

```haskell
data Fold i o = forall m . Monoid m => Fold (i -> m) (m -> o)
```

The `Fold` type is parametrized by the input and output types, but we also have a hidden data type `m`, for which a `Monoid` must be defined. We also have two functions, one translating a single input into our monoid value, and another translating the monoid value into the output value. We'll follow the naming convention from Gabriel's presentation and call the first one `tally :: i -> m` and the second one `summarize :: m -> o`.

How can this be translated into Scala? A trait, of course:

```scala
trait Fold[I, O] {
  type M
  def m: Monoid[M]

  def tally: I => M
  def summarize: M => O
}
```

This is a bit longer than the Haskell, but let's not get discouraged just yet; Scala just requires that we explicitly name the components, unlike in Haskell. Let's take a closer look at that trait. First of all, we have two "user-visible" generic type parameters: `I` and `O`, which are the input/output types. Secondly, there's the hidden `M` data type, specified using an abstract type member (`type M`). 

Why are `I` and `O` generic type parameters, while `M` is an abstract type member? Once we have a `Fold` defined, the user of that fold is only concerned with what kinds of inputs (`I`) can be translated to what kinds of outputs (`O`). The monoid type (`M`) is an implementation detail and hence doesn't have to be part of the generic type parameters. Given a `Fold[String, Int]` we have no idea what's the data type of the monoid used - and that's good, there's no reason we should. However, we still need to have a name of the monoid data type, to refer to it in the `tally` and `summarize` method signatures. And that's where the type member `M` comes into play.

We'll also define a helper method to create `Fold` instances, which will in some cases infer the `M` type and allow for more compact `Fold`  definition:

```scala
object Fold {
  def apply[I, O, _M](_m: Monoid[_M])(
    _tally: I => _M, _summarize: _M => O): Fold[I, O] = new Fold[I, O] {
    override type M = _M
    override def m = _m
    override def tally = _tally
    override def summarize = _summarize
  }
}
```

# Driver & first example

Let's now implement the default driver, which will fold a sequence of `I`s into a single `O`. Here's the Haskell version:

```haskell
fold :: Fold i o -> [i] -> o
fold (Fold tally summarize) is = summarize (reduce (map tally is))
  where
    reduce = Data.Foldable.foldl' (<>) mempty
``` 

and the Scala one (slightly different, as the collections in Scala aren't lazy by default like in Haskell, and we want to avoid building intermediate collections):

```scala
def fold[I, O](input: Seq[I])(f: Fold[I, O]): O = {
  val reduced = input.foldLeft(f.m.empty) { 
    case (a, i) => f.m.combine(a, f.tally(i)) 
  }
  f.summarize(reduced)
}
```

Note that we are using the `foldLeft` from the standard library. The way the default driver works is quite simple. First we reduce all the inputs into a single value of the monoid data type, by taking the monoid's empty element as a starter and combining it with subsequent tallied input elements. Finally, we call `summarize` to translate the single monoid value into our result.

Given a `List(i1, i2, i3)` of input elements here's what is computed:

```scala
val reduced = combine(combine(combine(empty, tally(i1)), tally(i2)), tally(i3))
summarize(reduced)
```

It should now be quite clear where the "left" comes from in `foldLeft`!

Let's now define our first fold for summing up integers! Cats have a built-in implicit monoid for integers with `0` and `+` (and for many other common data types as well), accessible with `import cats.implicits._`, so we can in fact define a "default" `Fold` for any data type with a monoid:

```scala
def sum[M](implicit m: Monoid[M]): Fold[M, M] = Fold(m)(identity, identity)
```

`sum[Int]` will create a `Fold` which accepts `Int`s, returns a single `Int` and uses an [implicitly available monoid](https://github.com/typelevel/cats/blob/master/kernel/src/main/scala/cats/kernel/instances/int.scala#L8) for `Int`s to do the reduction. `tally` and `summarize` are trivial here, as the monoid type is the same as input/output, and we don't need any transformations to happen. Here's how we can use it:

```scala
import cats.implicits._

println(fold(1 to 10)(sum)) // uses the implicit cats int monoid
// prints: 55
```

That's quite a lot of work to sum up 10 numbers, but we are just warming up! If you are following Gabriel's [slides](https://github.com/Gabriel439/slides/blob/master/munihac/foldmap.md), you'll also see an example of summing up all numbers from 1 to 1000000000. It's waaay slower in Scala than in Haskell. Why? We didn't specialize our `Fold` type for primitives, so there's a lot of boxing and unboxing happening behind-the-scenes. You can get good performance out of the Scala version as well, but it would require some additional work. Haskell has this "by default", so that's one thing that is nicer in Haskell.

# More examples

As a more interesting example, let's see how we can define a `Fold` for computing the average of a sequence of numbers. We'll define a custom data type where we'll store the current sum of all the numbers and their count; for counting the numbers we'll always use an `Int`, but the actual numbers summed up can be arbitrary (ints, doubles, longs, …), hence the generic type `A` (here - totally unconstrained):

```scala
case class Average[A](numerator: A, denominator: Int)
```

Next, it turns out that we can define a monoid for `Average`:

```scala
implicit def averageMonoid[A: Numeric] = new Monoid[Average[A]] {
  override def empty = Average(implicitly[Numeric[A]].zero, 0)
  override def combine(l: Average[A], r: Average[A]) = Average(
    implicitly[Numeric[A]].plus(l.numerator, r.numerator),
    l.denominator+r.denominator)
}
``` 

You'll probably notice that here we constraint the "things which can be averaged" with `A: Numeric`. This is just a shorthand for requiring an implicit: `def averageMonoid[A](implicit na: Numeric[A])`. `Numeric` is a type from Scala's standard library. Instances are provided for `Int`, `Long`, `Float`, `Double`. 

The monoid itself is quite straighforward - combining is just adding up both components of the average. How to define a fold which will compute the average?

```scala
def average[A: Numeric]: Fold[A, Double] = Fold(averageMonoid)(
  Average[A](_, 1),
  a => implicitly[Numeric[A]].toDouble(a.numerator) / a.denominator)

println(fold(1 to 10)(average))
// prints: 5.5
```

Note that the input of our fold is any numeric value, while the output is always a `Double`. The `tally` method wraps each element into an `Average` instance (using `1` as the denominator - as it's a single value), and `summarize` does the final computation by doing the division.

The logic of performing the reduction - the `fold` method - didn't change, only the *description* of what should be computed (`sum` vs `average`) did. 

# More folds!

Let's define even more folds! First, we need some monoids:

```scala
object CustomMonoids {
  import Ordering.Implicits._

  val unitMonoid: Monoid[Unit] = catsKernelStdAlgebraForUnit

  case class Max[A](v: A)
  def maxMonoid[A: Ordering](minValue: A): Monoid[Max[A]] = new Monoid[Max[A]] {
    override def empty = Max(minValue)
    override def combine(x: Max[A], y: Max[A]) = if (x.v < y.v) y else x
  }
  val maxIntMonoid = maxMonoid(Int.MinValue)

  def numProductMonoid[A: Numeric] = new Monoid[A] {
    override def empty = implicitly[Numeric[A]].one
    override def combine(l: A, r: A) = implicitly[Numeric[A]].times(l, r)
  }

  def firstMonoid[T] = new Monoid[Option[T]] {
    override def empty = None
    override def combine(l: Option[T], r: Option[T]) = l.orElse(r)
  }

  def lastMonoid[T] = new Monoid[Option[T]] {
    override def empty = None
    override def combine(l: Option[T], r: Option[T]) = r.orElse(l)
  }

  def andMonoid = new Monoid[Boolean] {
    override def empty = true
    override def combine(x: Boolean, y: Boolean) = x && y
  }

  def orMonoid = new Monoid[Boolean] {
    override def empty = false
    override def combine(x: Boolean, y: Boolean) = x || y
  }

  val intMonoid: Monoid[Int] = catsKernelStdGroupForInt
}
```

I'll let you work out what they do, but the names usually spoil the exercise. All of these monoids are quite general - no mention of sequences, folds, or (in some cases) even specific data types. Now let's define some folds:

```scala
import CustomMonoids._

def first[T]: Fold[T, Option[T]] = Fold(firstMonoid[T])(i => Some(i), identity)
def last[T]: Fold[T, Option[T]] = Fold(lastMonoid[T])(i => Some(i), identity)
def all[A](p: A => Boolean): Fold[A, Boolean] = Fold(andMonoid)(i => p(i), identity)
def any[A](p: A => Boolean): Fold[A, Boolean] = Fold(orMonoid)(i => p(i), identity)
def product[A: Numeric]: Fold[A, A] = Fold(numProductMonoid)(identity, identity)
def length[A]: Fold[A, Int] = Fold(intMonoid)(_ => 1, identity)
```

And use them:

```scala
def even(i: Int) = i%2 == 0
def negative(i: Int) = i < 0

println(fold(1 to 10)(first))         // prints: Some(1)
println(fold(1 to 10)(last))          // prints: Some(10)
println(fold(1 to 10)(all(even)))     // prints: false
println(fold(1 to 10)(any(even)))     // prints: true
println(fold(1 to 10)(any(negative))) // prints: false
println(fold(1 to 10)(product))       // prints: 3628800
println(fold(1 to 10)(length))        // prints: 10
```

As you can see, we can get vastly different behaviour by using different monoids. The `tally` and `summarize` functions are quite trivial, sometimes even as trivial as it gets (`identity`). But of course, this does not have to be the case.

On the aesthetics side, comparing to the Haskell version (e.g. `fold (any even) [1..10]`), I think the Scala one is comparably nice. That's up to personal taste of course, but so far in my opinion we've retained the "beauty".

# Why the monoid?

You may wonder, this all looks nice, but should we bother with the intermediate monoid? Can't we just reduce a sequence of inputs to a single output?

Of course we could, but the monoid does actually give us a couple of nice things. Firstly, it separates the "combination logic" from the actual input & output types. *How* the elements are combined is defined entirely by the monoid - served in a nice, reusable package. Monoids, being a very general concept, are far more common that you would suspect. If you have things that can be combined, define a monoid for them - you get `fold` and many other functionalities "for free".

As Gabriel also points out in his presentation, this is a generalization of the map-reduce/scatter-gather concept. `tally` is the mapping function, while the monoid's `combine` does the reduction step. This should hint at some parallelization possibilities which we'll also see later.

The monoid also lets us decouple the combination logic from computing the final answer: which might destroy some of the information (as in the average example), or be computationally expensive.

# Cardinality estimation

One of the non-trivial examples that Gabriel shows is a very simplified version of the HyperLogLog algorithm for estimating the number of unique elements in size of a dataset, without constructing an actual `Set` of all the data elements (so this makes sense for rather large datasets).

Quoting [Wikipedia](https://en.wikipedia.org/wiki/HyperLogLog):

> The basis of the HyperLogLog algorithm is the observation that the cardinality of a multiset of uniformly distributed random numbers can be estimated by calculating the maximum number of leading zeros in the binary representation of each number in the set. If the maximum number of leading zeros observed is `n`, an estimate for the number of distinct elements in the set is `2^n`.

Hence we need a hashing function. In our example we'll be using random `Long`s as the base data type, and the hashing function will be quite simple, `identity` (as the numbers are random anyway). Unlike in Haskell, there's no `Word64` (unsigned longs) type in the JVM, so we'll be using only positive `Long`s (which gives us 63 bits at our disposal).

To define the fold, we'll be using the `Max` monoid as defined before:

```scala
import CustomMonoids._

def uniques[I](hash: I => Long): Fold[I, Int] = Fold(maxIntMonoid)(
  i => Max(java.lang.Long.numberOfLeadingZeros(hash(i))),
  m => Math.pow(2, m.v).toInt
)
```

For tests, we'll use a 100000000-element stream built out of looped 10-element random `Long`s (so there are only 10 unique elements in this rather long stream):  

```scala
val random = new Random()
val randomLongs: Stream[Long] = Stream.continually(random.nextLong())
  .filter(_ > 0).take(10)
val randomLoopedLongs: Stream[Long] = randomLongs.append(randomLoopedLongs)
  .take(10000000)

println(fold(randomLoopedLongs)(uniques(identity)))
```

This usually prints `16`, which is quite a good estimate, but for some runs I got as low as `4` or as high as `128`.

# Combining folds

I hope you already like `Fold`s, but we are just warming up! Another nice property of folds is that they can be combined. Let's take a simple example of combining two folds with same input types, but distinct output types, into a fold which will produce tuples of outputs:

```scala
def combine[I, O1, O2](f1: Fold[I, O1], f2: Fold[I, O2]): Fold[I, (O1, O2)] = 
  new Fold[I, (O1, O2)] {
    override type M = (f1.M, f2.M)
    override def m = new Monoid[M] {
      override def empty = (f1.m.empty, f2.m.empty)
      override def combine(l: (f1.M, f2.M), r: (f1.M, f2.M)) = 
        (f1.m.combine(l._1, r._1), f2.m.combine(l._2, r._2))
    }
    override def tally = i => (f1.tally(i), f2.tally(i))
    override def summarize = x => (f1.summarize(x._1), f2.summarize(x._2))
  }
```

If this definition looks very "manual" to you don't worry, we'll improve soon. Let's use this fold to compute the sum & length of the list:

```scala
println(fold(1 to 10)(combine(sum, length)))
// prints: (55, 10)
```

What's the advantage of running a combined fold as opposed to summing and computing the length separately? The input list is only *traversed once* - which in case of large datasets, can make a really big difference!

# Folds get mapped

Turns out that we can define both a `Functor` and an `Applicative` for `Fold`! 

What is a functor? It's a general description of any structure that supports the `.map` operation. Common examples are `List`, `Option`, `Future`. 

A functor for a type can be defined only if it takes a single type parameter (that's the type parameter that can change when invoking `map`). Our `Fold` takes two - how do we handle that? We define a functor for any `Fold` with the first parameter fixed. Our functor definition becomes polymorphic, so that we can fix the input type `I`:

```scala
implicit def foldFunctor[I] = new Functor[({type F[X]=Fold[I, X]})#F] {
  override def map[T, U](f: Fold[I, T])(fn: T => U) = 
    Fold(f.m)(f.tally, f.summarize.andThen(fn))
} 
``` 

What's that ugly `({type F[X]=Fold[I, X]})#F`? It's a way to create a single-parameter variant of `Fold` with the first type parameter fixed to `I` (which is "known" inside the body of the `foldFunctor` method). You can simplify that by using the [type-project compiler plugin](https://github.com/non/kind-projector) to `Fold[I, ?]`, which is much more human-friendly, and who knows, maybe will make its way one day to Scala itself.

How can we use it? A simplistic example is changing the output of the `sum` fold:

```scala
import cats.syntax.functor._
// sum[Int]: Fold[Int, Int]
sum[Int].map(s => "Sum is $s"): Fold[Int, String] 
// .map takes an implicit Functor instance
```

# Folds get applied

Functors are just the beginning, we can do much more interesting things with `Applicative`s. What is an applicative? An applicative for a type `F[A]` is a functor, plus defines:

* a `pure[A](x: A): F[A]` metod, which takes a value of type `A` and wraps it with our type `F`
* a `map2[A, B, Z](fa: F[A], fb: F[B])(f: (A, B) => Z): F[Z]` method, which is kind of a two-argument version of functor's `map` (note that here we are unwrapping two values and combining them, while functor's map only unwraps a single value
* `pure` and `map2` must obey a set of "sanity" laws

Equivalently, instead of `map2` we can define `ap[A, B](ff: F[A => B])(fa: F[A]): F[B]`, which applies a wrapped function to a wrapped argument.

That definition just scratches the surface. If you are curious, there's a lot of great tutorials out there providing more details and intuitions. Just google for "Scala Applicative". It's hard to pick one to link from here.

Here's the applicative definition for `Fold`:

```scala
implicit def foldApplicative[I] = new Applicative[({type F[X]=Fold[I, X]})#F] {
  override def pure[A](x: A) = Fold(catsKernelStdAlgebraForUnit)(_ => (), _ => x)
  override def ap[A, B](ff: Fold[I, (A) => B])(fa: Fold[I, A]): Fold[I, B] = 
    Fold(ff.m product fa.m)(
      i => (ff.tally(i), fa.tally(i)),
      { case (mf, ma) => ff.summarize(mf)(fa.summarize(ma)) }
    )
}
``` 

That's all very nice, but what can we do with it? For a start, here's the definition of `combine` which we just wrote by hand (combines two folds by producing tuples of outputs):

```scala
def combine[I, O1, O2](f1: Fold[I, O1], f2: Fold[I, O2]): Fold[I, (O1, O2)] = 
  foldApplicative.map2(f1, f2)((_, _))

println(fold(1 to 10)(combine(sum, length)))
// still prints: (55, 10)
```

We can also use the fancy applicative syntax; the `|@|` operator combines a number of applicatives, and then a function needs to provided to combine the results:

```scala
import cats.syntax.cartesian._

println(fold(1 to 10)((sum[Int] |@| length |@| product).map((_, _, _))))
// prints: (55,10,3628800)
```

Remember our average example from the beginning? This can now be reformulated as:

```scala
// A needs to be numeric to convert to Double, and a Monoid to sum it up
def average[A: Numeric: Monoid]: Fold[A, Double] = (sum[A] |@| length[A]).map {
  case (s, l) => implicitly[Numeric[A]].toDouble(s) / l
}

println(fold(1 to 10)(average))
// the average of 1, 2, …, 10 is still 5.5!
``` 

Let's compare that to the Haskell version:

```scala
average :: Fractional n => Fold n n
average = (/) <$> sum <*> length
```

While the Scala version isn't bad, I must admin that the Haskell version is nicer (don't get scared by the `<$>` and `<*>` - that's just Haskell's version of `map` and `ap2`, they are quite common, and you get used to them relatively quickly, even when only reading about Haskell, not doing any actual coding). Haskell's type classes around numeric types are more consistent, which allows this more compact version. 

However, note that the Haskell version requires the type `n` to be fractional - which rules out `Int` in our case. We could also write a `Fractional`-only version of `average`, with the code coming a bit closer to the Haskell version:

```scala
import Fractional.Implicits._

// this version of length has result of type A, not Int, but requires a numeric A
def length2[A: Numeric: Monoid]: Fold[A, A] = Fold(implicitly[Monoid[A]])(
  _ => implicitly[Numeric[A]].one, identity)
def average2[A: Fractional: Monoid]: Fold[A, A] = (sum[A] |@| length2[A]).map(_ / _)

println(fold(1.0 to 10.0 by 1.0)(average2[Double]))
```

We'll skip defining `Numeric` instances for `Fold` as in the [Haskell examples](https://github.com/Gabriel439/slides/blob/master/munihac/foldmap.md#num), as the `Numeric`s in Scala are geared specifically towards number types like `Int` etc. For example, you need to be able to convert your type to a `Double` for any `Numeric` that you define. Moreover, the set of operators and methods available for `Numeric` instances in Scala is much smaller than in Haskell. So we won't be able to nicely re-create e.g. `fold (sin average ^ 2 + cos average  ^ 2) [1..10]` (this computation can be of course defined in Scala, just won't look THAT nice).

# Other fold drivers

As hinted in the beginning, `fold` is just one of the possible drivers. Let's develop another one, which will fold nested sequences in parallel. We'll use Scala's built-in parallel collections, but I hope you'll be able to see that this can be also done using any other framework:

```scala
def foldNested[I, O](input: Seq[Seq[I]])(f: Fold[I, O]): O = {
  val nestedReduced = input
    .par
    .map(ii => f.m.combineAll(ii.iterator.map(f.tally)))

  val reduced = nestedReduced.foldLeft(f.m.empty)(f.m.combine(_, _))

  f.summarize(reduced)
}

println(foldNested(List.fill(4)(1L to 100000L))(average))
// prints: 50000.5
```

First we convert the input collection into a parallel version: `input.par`, then reduce each sub-sequence into a single value using the monoid. This gives us a (parallel) sequence of monoid values, each corresponding to one reduced collection. This is all valid as the monoid operation is associative. Finally, we reduce the nested values into a single value and `summarize` it.

We can also parallelize the computation in different ways, even for non-nested sequences. For example, we can divide the input sequence into chunks, reduce these chunks in parallel and then combine them. As the monoid operation is associative, this operation is legal. 

Or, if we have a stream of input values, we can group these into chunks and summarize the chunks, getting a stream of chunk summaries. This can be very useful for approximating stream values, or approximating values in a given [time window](https://softwaremill.com/windowing-in-big-data-streams-spark-flink-kafka-akka/). 

There's a lot of possibilities! The description of how to fold values, represented as a `Fold` is simple enough to allow for many different applications, depending on the use-case at hand.

# Future folds

`Future`s are very common in Scala, so what to do if we have a sequence of `Future`s which we'd like to fold? No problem, we just need an appropriate driver!

```scala
import Fold._
import scala.concurrent.ExecutionContext.Implicits.global

def foldFutures[I, O](input: Seq[Future[I]])(f: Fold[I, O]): Future[O] = {
  def doReduce(in: Seq[Future[I]], acc: f.M): Future[f.M] = in match {
    case Seq(h, t@_*) => h.flatMap(hh => doReduce(t, f.m.combine(acc, f.tally(hh))))
    case _ => Future.successful(acc)
  }

  val reduced = doReduce(input, f.m.empty)
  reduced.map(f.summarize)
}

import scala.concurrent.duration._

val input: List[Future[Int]] = List(1, 2, 3).map(Future.successful)
println(Await.result(foldFutures(input)(sum), 1.minute))
// prints: 6
```

Similarly we could `fold` values contained in any `Monad` (anything that has a `flatMap`).

# Focus with lenses

We can also integrate folds with a lens library. Here, we'll use [Monocle](https://github.com/julien-truffaut/Monocle). A lens lets you project a complex data type into one of its simpler parts, but also modify it. For example, given a simple case class hierarchy:

```scala
case class Person(name: String, address: Address)
case class Address(street: String, country: String)

val streetLens = Lens { p: Person => p.address.street } { 
  newStreet: String => p: Person =>
    p.copy(address = p.address.copy(street = newStreet))
  }

val aPerson = Person("Adam", Address("Functional Dr.", "Poland"))
println(streetLens.get(aPerson)) // prints: Functional Dr.
println(streetLens.set("OO Ln.")(aPerson)) 
  // prints: Person(Adam,Address(OO Ln.,Poland))
```

Lenses are very useful when working with nested case class hierarchies (shameless plug - check out also [quicklens](https://github.com/adamw/quicklens)) and can be composed.

We can write a combinator which uses a given `Lens` and wraps a `Fold` for the lens target, to obtain a `Fold` for the more complex object:

```scala
def focus[I1, I2, O](lens: Lens[I2, I1], f: Fold[I1, O]): Fold[I2, O] = Fold(f.m)(
  i => lens.getOption(i).map(f.tally).getOrElse(f.m.empty),
  f.summarize
)
```

As a simple example (following Gabriel's presentation), we can write a lens `_1` which focuses on the first element of a tuple and use that to fold over a list of pairs:

```scala
def _1[A, B]: Lens[(A, B), A] = Lens[(A, B), A](_._1)(e => p => p.copy(_1 = e))

println(fold(List((1, "x"), (2, "y"), (3, "z")))(focus(_1[Int, String], sum[Int])))
// prints: 6
```

We need to help out the Scala type checker a bit and provide some of the type arguments. Hence this doesn't look as nice as the Haskell version: `fold (focus _1 sum) [ (1, "x"), (2, "y"), (3, "z") ]`, but isn't very far off as well.

# Focus with prisms

Another type of "optics" that can be useful here are prisms. Prisms let you select one or more subtypes of a type. For example, for an `Either[A, B]` type, which can either (you can see where the name comes from ;) ) be a `Left[A, B](a: A)` or `Right[A, B](b: B)`, we can have a "left" prism, which selects only left values, or a "right" prism, which selects only right values. Similarly, we can have a prism selecting any single (or multiple) types for any inheritance hierarchy, or if you prefer the FP terminology, for any ADT (Algebraic Data Type).

As the prism selects a value, it can either succeed or fail; a `Prism[T, U]`, given an instance of the source type `T`, returns an `Option[U]`, where `None` corresponds to selection failure, and `Some(u: U)` - to success (selection matched). For example, we can define the left/right prisms as follows to extract the left/right value:

```scala
def _Left[A, B]: Prism[Either[A, B], A] = Prism[Either[A, B], A](
  _.fold(Some(_), _ => None))(Left(_))
def _Right[A, B]: Prism[Either[A, B], B] = Prism[Either[A, B], B](
  _.fold(_ => None, Some(_)))(Right(_))

println(_Left.getOption(Left("x"))) // prints Some("x")
println(_Left.getOption(Right(10))) // prints None
```

We can focus any `Fold` using a prism in a similar way as we did with lenses. The difference is that a prism, when applied, *optionally* returns a value, while a lens always returns a value. However, here the monoid helps us out once again: when a prism fails to select a value from the input element, we can just use the monoid's empty value instead.

In fact, both `Prism` and `Lens` can be seen as an `Optional` (which is a concept defined by Monocle):

```scala
def focus[I1, I2, O](opt: Optional[I2, I1], f: Fold[I1, O]): Fold[I2, O] = Fold(f.m)(
  i => opt.getOption(i).map(f.tally).getOrElse(f.m.empty),
  f.summarize
)
def focus[I1, I2, O](lens: Lens[I2, I1], f: Fold[I1, O]): Fold[I2, O] = 
  focus(lens.asOptional, f)
def focus[I1, I2, O](prism: Prism[I2, I1], f: Fold[I1, O]): Fold[I2, O] = 
  focus(prism.asOptional, f)
```

And here's a fold focused with a prism in action:

```scala
println(fold(
  List[Either[Int, String]](Left(1), Right("x"), Left(10), Left(5), Right("y")))(
  focus(_Left[Int, String], sum[Int])))
// prints: 16
```

Note that again, we have to help out the Scala compiler with the types a bit.

Lenses & prisms compose! For example, given an input list of optional tuples (`List[Option[(Int, String)]]`), we can quite easily sum the first tuple elements when they are defined:

```scala
def _Some[A]: Prism[Option[A], A] = Prism[Option[A], A](identity)(Some(_))

val items = List(Some((1, "x")), None, Some((10, "y")))
println(fold(items)(focus(_Some.composeLens(_1[Int, String]), sum[Int])))
// prints: 11
```

Compare this to the Haskell version:

```haskell
items = [Nothing, Just (1, "Foo"), Just (2, "Bar"), Nothing, Just (5, "Baz")]
fold (focus (_Just . _1) product) items
```

The Scala version falls a bit short comparing to Haskell due to the additional types that need to be spelled out (though it's also very possible that there's an alternative definition of `fold` which would allow better type inference - if you have an improvement suggestion, please leave a comment!), so Haskell wins here on the beauty side, but Scala isn't bad as well.

# Summing up

I hope you got interested in folds and how they can help you analyze your data! How can you use them today? If you follow Gabriel's talk, he actually mentions a lot of what he describes is inspired by Scala. How come?

Turns out, the above & much more is already implemented in [Algebird](https://github.com/twitter/algebird), an abstract algebra library for Scala. The main difference is that in Algebird, our `Fold` is called an [`Aggregator`](https://github.com/twitter/algebird/blob/develop/algebird-core/src/main/scala/com/twitter/algebird/Aggregator.scala). There are some great tutorials on how to use the `Aggregator`, the constructs  should look quite familiar after reading this article: see [Scalding's Aggregator wiki](https://github.com/twitter/scalding/wiki/Aggregation-using-Algebird-Aggregators), [a REPL session example](https://gist.github.com/johnynek/814fc1e77aad1d295bb7), or one of the many presentations available online.

Algebird is used at Twitter in conjunction with [Scalding](https://github.com/twitter/scalding) and [Storm](http://storm.apache.org/) for big data analysis, and if anybody has Big Data - it's Twitter, so Algebird is definitely worth looking into.

I'll leave it as an exercise for the reader to figure out if the folds in Scala are actually beautiful :).
