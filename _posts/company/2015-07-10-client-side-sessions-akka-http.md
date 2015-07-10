---
title: Client-side sessions for akka-http
description: Introducing a new project, akka-http-sessions, for building webapps with akka-http as the backend
author: Adam Warski
author_login: warski
categories:
- scala
- akka
- spray
- web
- company
layout: simple_post
---

[akka-http](http://doc.akka.io/docs/akka-stream-and-http-experimental/1.0-M4/scala/http/) is an experimental Akka module, originating from [spray.io](http://spray.io), for building *reactive* REST services with an elegant DSL. It has almost all of the required functionalities to serve as a backend for a web (single-page-)application, with one exception: session handling. The [akka-http-session project](https://github.com/softwaremill/akka-http-session) aims to fill that gap (**[star](https://github.com/softwaremill/akka-http-session)** if you like the code / find it interesting!).

`akka-http-session` provides three main features:

* **client-side sessions**, using session cookies, with signed content, optionally encrypted and expiring after the given period
* **CSRF protection** using [double-submit cookies](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet)
* **remember me** support using persistent cookies and a server-side token store

The sessions are typed, which means that you can easily store simple case classes in the client-side session in addition to values of basic types. 

Let's take a look at some code! Here we have login, logout and get-data endpoints using client-side sessions where all non-GET requests are protected against CSRF:

```scala
case class ExampleSession(username: String)

val sessionConfig = SessionConfig.default("server_secret_please_change_me")
implicit val sessionManager = new SessionManager[ExampleSession](sessionConfig)

randomTokenCsrfProtection() {
  pathPrefix("api") {
    path("do_login") {
      post {
        entity(as[String]) { body =>
          logger.info(s"Logging in $body")
          setSession(ExampleSession(body)) {
            setNewCsrfToken() { ctx => ctx.complete("ok") }
          }
        }
      }
    } ~
    path("do_logout") {
      post {
        requiredSession() { session => // session: ExampleSession
          invalidateSession() { ctx =>
            logger.info(s"Logging out $session")
            ctx.complete("ok")
          }
        }
      }
    } ~
    path("current_login") {
      get {
        requiredSession() { session => ctx =>
          logger.info("Current session: " + session)
          ctx.complete(session.username)
        }
      }
    }
  } ~
  pathPrefix("site") {
    getFromResourceDirectory("") // serve the .html and .js files
  }
}
```

You can try this out locally by running the [example](https://github.com/softwaremill/akka-http-session/blob/master/example/src/main/scala/com/softwaremill/example/Example.scala); the code in the repo also contains a simple HTML page to test logging in & out, plus fetching the login-protected data.

When dealing with sessions and cookies security is one of the main concerns, that's why the project aims to follow the current best practices, for example:

* sign the session content using a long, environment-specific secret key
* use headers as the preferred method for submitting the CSRF token ([Angular](https://docs.angularjs.org/api/ng/service/$http)-compatible)
* store remember-me token hashes, not the tokens directly
* store remember-me token selectors and token hashes separately, to prevent timing attacks

Take a look at the [readme](https://github.com/softwaremill/akka-http-session), it contains a much more comprehensive documentation on the available directives, plus a number of links explaining the possible session/cookie-handling designs and their strenghts/weaknesses.

If you like the [project](https://github.com/softwaremill/akka-http-session) - star it! Also any feedback in the form of issues / PRs is always welcome!

Adam