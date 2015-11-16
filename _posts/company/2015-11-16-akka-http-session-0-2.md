---
title: akka-http-session 0.2.0 - mobile (and web), JWT, optional cookies
description: Using akka-http-session you can add support for client-side sessions to your web or mobile application
author: Adam Warski
author_login: warski
categories:
- scala
- akka
- spray
- security
- jwt
- company
layout: simple_post
---

[akka-http-session](https://github.com/softwaremill/akka-http-session) provides directives for secure client-side session management in web and mobile applications, using cookies or custom headers + local storage, with optional [Json Web Tokens](http://jwt.io/) format support. The library builds on top of [akka-http](http://doc.akka.io/docs/akka-stream-and-http-experimental/2.0-M1/scala/http/), an experimental Akka module for creating *reactive* REST services with an elegant DSL.  

Just as a refresher, the major features of `akka-http-session` are:

* type-safe, signed, client-side sessions
* sessions can be encrypted
* sessions contain an expiry date
* refresh token support (e.g. to implement "remember me")
* CSRF tokens support

Version 0.2.0 brings in a couple new features and changes:

* web & mobile-friendly
* cookie or custom header transport
* support for [JWT](http://jwt.io/)
* new group id (`com.softwaremill.akka-http-session`) and artifact ids (`core` and the optional `jwt`)
* more IDE and developer-friendly directives (parameters are not hidden in "magnets")
* removing the dedicated `PersistSession` directives, instead you should use `refreshable` for session continuity

When developing a web application, you can use the cookie-based session transport, or the header-based transport and store session data e.g. in browser's local storage. For mobile applications, the second approach is much more common; the tokens are then stored using device-specific storage mechanisms.

By default session data, expiry and signature are encoded in a simple, custom string-based format, but by adding the `jwt` module you can encode them as standard json-based tokens, with arbitrary payload data, proper headers and signatures. For an introduction to JWT, see e.g. [here](https://scotch.io/tutorials/the-anatomy-of-a-json-web-token).

How does session management look in practice? Quite simple! You just need to use the `setSession`, `requiredSession` directives, for example:

````scala
val sessionConfig = SessionConfig.default("1234 ... 7890")
implicit val sessionManager = new SessionManager[Long](sessionConfig)

path("login") {
  post {
    entity(as[String]) { body =>
      setSession(oneOff, usingCookies, 812832L) { ctx =>
        ctx.complete("ok")
      }
    }
  }
} ~
path("secret") {
  get {
    requiredSession(oneOff, usingCookies) { session => 
      // session: Long, or whatever the T parameter is
      complete { "treasure" }
    }
  }
} ~
path("logout") {
  get {
    invalidateSession(oneOff, usingCookies) {
      complete { "logged out" }
    }
  }
}
````

Here the session content is just a `Long`, but it's very easy to store a case class or other type of data. Everything in a type-safe, secure way.

For a more complete example, you can check out the sources of a runnable 
[example](https://github.com/softwaremill/akka-http-session/blob/master/example/src/main/scala/com/softwaremill/example/Example.scala),
or head over to [Bootzooka](https://github.com/softwaremill/bootzooka), which is a complete application scaffolding and uses `akka-http` for http routing.

If you have any questions, don't hesitate to ask on our [gitter channel](https://gitter.im/softwaremill/akka-http-session?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge), and if you like the project, please [star it on GitHub](https://github.com/softwaremill/akka-http-session)!

Thanks! 