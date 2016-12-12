---
title: Reader & Constructor-based Dependency Injection - friend or foe?
description: Can you use both the Reader Monad and Constructor-based Dependency Injection, or do you have to choose only one?
author: Adam Warski
author_login: warski
categories:
- scala
- scalaz
- monad
- functional programming
- macwire
- dependency injection
- company
layout: simple_post
---

Constructors and the Reader Monad are often viewed as alternate approaches to managing dependencies in code; the Reader Monad is sometimes said to be a replacement for Dependency Injection (DI) frameworks. At least, that has been my impression so far. 

I've been trying to understand how the Reader is an alternative for "traditional" DI for some time now (see e.g. [this SO question](http://stackoverflow.com/questions/29174500/reader-monad-for-dependency-injection-multiple-dependencies-nested-calls)), but without a definite feeling that I got it. 

Maybe these are not really alternatives, but complements? I now think that it’s perfectly fine to use both in an application, but for different purposes. Let’s examine them more closely.

Just a side note; when talking about dependency injection, I mean its simple, constructor-based form, as described e.g. in the [DI in Scala](http://di-in-scala.github.io) guide. I share the point of view of many Scala programmers that in most applications DI frameworks such as [Spring](https://spring.io) or [Guice](https://github.com/google/guice) are not needed and are definitely an overkill, complicating the application setup and constraining the developer in exchange for some short-term gains. To sum up - no frameworks, just plain Scala code with `new` (well, optionally with [MacWire](https://github.com/adamw/macwire) ;) ).

## What the caller knows

The fundamental difference in the two approaches to DI is what the caller knows about the dependencies of the method it is calling. In constructor-based DI, this knowledge is hidden, e.g.:

````scala
object Example1 {
  import scalaz._
  import Scalaz._
  import scalaz.concurrent.Future
  import scala.concurrent.ExecutionContext.Implicits.global

  case class User(email: String)

  class EmailServer {
    def send(to: String, body: String): Future[Unit] = ???
  }

  class UserNotifier(emailServer: EmailServer) {
    def notify(user: User, about: String): Future[Unit] = {
      emailServer.send(user.email, about)
    }
  }
  
  class CustomerRelations(userNotifier: UserNotifier) {
    def allUsers: Future[List[User]] = ???

    def retainUsers(): Future[Unit] = {
      allUsers.flatMap { us =>
        us.map(u => userNotifier.notify(u, "Visit our site!"))
          .sequence
          .map(_ => ())
      }
    }
  }
}
````

Inside `CustomerRelations`, when using the `UserNotifier` instance, we have no idea that it uses an `EmailServer` as a dependency. The dependency is hidden from the caller. (By the way, in this example, `CustomerRelations` depends on a specific class - `UserNotifier` - but quite commonly, this will only be a trait, so even navigating to the definition won’t reveal what the dependencies are)

We can argue that the dependencies of the `UserNotifier` class are its implementation detail, and the caller shouldn’t be concerned with them. Using constructor-based DI helps us achieve that. That’s one form of abstraction.

When using the Reader Monad, the example takes a different form. The `UserNotifier` can now become an object and the dependencies are encoded in the `notify` method's return type:

````scala
object UserNotifier {
  def notify(user: User, about: String): Reader[EmailServer, Future[Unit]] = 
    Reader { emailServer =>
      emailServer.send(user.email, about)
    }
}
````

Any caller of `UserNotifier.notify` now knows about the dependency, and has to either satisfy that requirement by providing an instance of an `EmailServer` or, more commonly, pass the requirement upwards.

Here’s how the `CustomerRelations` object could look like when using the reader monad (the implementation of `retainUsers` is provided just for completeness, and is not really relevant, only the method signatures are):

````scala
class CustomerRelations {
  def allUsers: Future[List[User]] = ???

  def retainUsers(): Reader[EmailServer, Future[Unit]] = {
    allUsers
      .map {
        _.map(u => UserNotifier.notify(u, "Visit our site!"))
          .sequenceU
          .map(_.sequence.map(_ => ()))
      }
      .toReaderFunctor
      .map(_.join)
  }
}

implicit class RichFunctorReader[F[_]: Functor, A, B](fr: F[Reader[A, B]]) {
  def toReaderFunctor: Reader[A, F[B]] = Reader { a => fr.map(_.run(a)) }
}
````

One can say that an implementation detail of the `UserNotifier` now leaks through the return types of `notify` and `retainUsers`, however we also gain an important feature: just by looking at the signature, we know what kind of side-effects a given method can have. Thus, the Reader Monad can be viewed as a basic way to **track effects** in our code, by explicitly stating that certain dependencies can be used down in the call chain.

## Combining the two

We’ve seen an example of using constructor-based DI and using the reader monad - that’s hardly new, there’s a lot of such examples floating around. But - which style to choose? Do we want to abstract the dependencies or do we want to track effects? That’s yet another tradeoff that we have to face.

I think that there are cases when you want the abstraction, and there are cases when you want the effect tracking. Taking our example further, we can have a couple of implementations of `EmailSender`:

````scala
trait EmailSender {
  def send(to: String, body: String): Future[Unit]
}

class SmtpEmailSender(host: String, port: String) extends EmailSender { ... }
class SESEmailSender(creds: AWSCredentials) extends EmailSender { ... }
class SendGridEmailSender(sendGrid: SendGrid) extends EmailSender { ... }
````

When tracking method effects using signatures (with the help of the reader monad), there’s probably no point in distinguishing a method which can have an effect "email sent using SMPT" from an effect "email sent using AWS SES". What *is* important is that an e-mail can be sent at all, as a side effect. Hence, for creating a specific `EmailSender`, we want to hide the implementation details and use constructor-based dependency injection.

(As a more general example, it doesn’t probably make sense to thread configuration through the method return types with the reader monad. It would just create more noise and wouldn’t help much in understanding what a method does.)

However, it can be quite beneficial to know that a method has side-effects in the form of sending mails (or, talking to an external API, or reading files, or ...), that is, using *some* `EmailSender` at all. Here the reader monad approach can be very useful.

## Summing up

To sum up, both constructor-based dependency injection and the reader monad are yet two more tools in our toolbox. They can be successfully used together.

Constructor-based DI is great when you want to hide the dependencies from your method's callers, for example configuration. It can also be used to create the dependencies needed for running the reader monad!

Reader monad-based DI is useful for tracking effects and making the dependencies explicit to a method’s callers. I’d use it when it is informative to the reader of the code to know what dependencies can be used down in the call chain.

## Appendix: simple version of `CustomerRelations`

If we use a `Kleisli[Future, EmailServer, ?]` instead of `Reader`, the example is simplified a bit:

````scala 
object Example3 {
  import scalaz._
  import Scalaz._
  import scalaz.concurrent.Future
  import scala.concurrent.ExecutionContext.Implicits.global

  case class User(email: String)

  class EmailServer {
    def send(to: String, body: String): Future[Unit] = ???
  }

  object UserNotifier {
    def notify(user: User, about: String): Kleisli[Future, EmailServer, Unit] = 
      Kleisli { emailServer =>
        emailServer.send(user.email, about)
      }
  }

  class CustomerRelations {
    def allUsers: Future[List[User]] = ???

    def retainUsers(): Kleisli[Future, EmailServer, Unit] = {
      for {
        users <- allUsers.liftKleisli
        _ <- users.map(u => UserNotifier.notify(u, "Visit our site!"))
          .sequenceU
          .map(_ => ())
      } yield ()
    }
  }
}
````
