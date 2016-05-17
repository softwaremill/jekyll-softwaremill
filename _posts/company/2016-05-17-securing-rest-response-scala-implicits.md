---
title: Securing REST response serialization with Scala implicits
description: How to enable automatic serialization only for specified types
author: Adam Warski
author_login: warski
categories:
- scala
- company
- json
- security
- bootzooka
layout: simple_post
---

Quite often when developing web apps and REST/HTTP APIs using Scala, it’s very convenient to automatically serialize any `case class` as a response to the client. However, it’s then equally easy to send too much data to the client, and this can be a security risk. For example: after logging in a user, if instead of sending partial user data (only what the frontend needs), we send the whole user object with the (hopefully!) hashed password, salt, security questions etc.

How can we prevent such situations? We need to somehow limit what can be serialized as a response. Here we could use Scala’s implicits to control this particular capability. Let’s define a marker trait:

```
trait CanBeSerialized[T]
```

An instance of this trait has quite obvious meaning: given an instance of `CanBeSerialized[T]`, we know that any instances of type `T` can be serialized and sent as a response to the client. Now, we need to somehow limit our serialization logic only to the types for which a `CanBeSerialized` instance exists. We do this by requiring an implicit parameter in the serialization method:

```
object SerializeToJson {
   def serialize[T](t: T)(implicit cbs: CanBeSerialized[T]): String = {
      // serialize
   }
}
```

If we now try to call `serialize` on a type for which the implicit doesn't exist (or is not in scope), we’ll get a nice compiler error (saying that an implicit value for e.g. `CanBeSerialized[User]` cannot be found, which is even quite self-explanatory). Note that the actual value of `cbs` doesn’t matter and is never used. It’s enough that the implicit exists at all.

How do we provide the implicit values? Scala looks for implicits in many places, but the two most useful here are the lexical scope, and the companion object of the type. For example we could have:

```
case class UserWebView(username: String, …)
object UserWebView {
   // only the existence of an instance matters, not the actual value
   implicit val cbs = new CanBeSerialized[UserWebView] {}
}
```

As the compiler automatically checks the companion objects when looking for implicits, this will work any time we pass in a `UserWebView` instance to the `serialize` method; no additional imports etc required! And because the value is implicit, our code is not cluttered with explicit can-be-serialized parameters.

We now have tight control of which case classes can be serialized and sent back to the client.

This approach is implemented in [Bootzooka](http://softwaremill.github.io/bootzooka/) and integrated into an [akka-http](http://akka.io/docs/) directive. Take a look at `JsonSupport`, where the [`CanBeSerialized`](https://github.com/softwaremill/bootzooka/blob/master/backend/src/main/scala/com/softwaremill/bootzooka/utils/http/RoutesSupport.scala#L49-L60) trait is defined, and then used in the [serialization (`marshall`) method](https://github.com/softwaremill/bootzooka/blob/master/backend/src/main/scala/com/softwaremill/bootzooka/utils/http/RoutesSupport.scala#L43-L47). In [`UserRoutes`](https://github.com/softwaremill/bootzooka/blob/master/backend/src/main/scala/com/softwaremill/bootzooka/user/UsersRoutes.scala#L19) you can see a specific can-be-serialized instance defined for the types used in responses of these routes. Because the values are implicit, they do not clutter the code where the routes are defined.

By the way: this is a very simple example of using [typeclasses](http://debasishg.blogspot.com/2010/06/scala-implicits-type-classes-here-i.html) [in](http://danielwestheide.com/blog/2013/02/06/the-neophytes-guide-to-scala-part-12-type-classes.html) [Scala](http://eed3si9n.com/learning-scalaz/a+Yes-No+typeclass.html).
