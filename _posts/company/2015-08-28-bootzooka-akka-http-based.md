---
title: Bootzooka is now based on Akka HTTP
description: Update on our Scala+Akka HTTP+Angular SPA scaffolding project, Bootzooka
author: Adam Warski
author_login: warski
categories:
- scala
- akka
- bootzooka
- akkahttp
- company
layout: simple_post
---

Times change, and so does [Bootzooka](http://softwaremill.github.io/bootzooka/), our simple application scaffolding project: the backend is now based on [Akka HTTP](http://doc.akka.io/docs/akka-stream-and-http-experimental/1.0/scala/http/introduction.html). 

Akka HTTP (formerly known as [Spray.io](http://spray.io)) is a HTTP client & server  implementation on top of Akka & Akka Stream, with a very flexible and elegant routing DSL for defining endpoints. It's not a web framework, it's not an application server; instead, you get a **library**, on top of which you can implement various services.

So isn't it a lot of work to create a web application using Akka HTTP? Turns out it's quite simple. The biggest missing piece is session handling, which we released some time ago as a separate library, [Akka HTTP Session](https://github.com/softwaremill/akka-http-session). Apart from that, Akka HTTP has all that is needed for a Single Page Application: serving static files from a (resource) directory and defining HTTP/REST-endpoints.

I'm sure you'd like to see some code! For example, here's a route handling changing a user's password, taken from [`UserRoutes.scala`](https://github.com/softwaremill/bootzooka/blob/master/backend/src/main/scala/com/softwaremill/bootzooka/user/UsersRoutes.scala):

````scala
case class ChangePasswordInput(currentPassword: String, newPassword: String)

path("changepassword") {
  post {
    userFromSession { user =>
      entity(as[ChangePasswordInput]) { input =>
        onSuccess(userService.changePassword(user.id, input)) {
          case Left(msg) => complete(StatusCodes.Forbidden, msg)
          case Right(_) => completeOk
        }
      }
    }
  }
}
````

All of the above are just **function calls** (`post`, `path`, etc.)! There's no reflection/annotation magic, or anything like that. The above route is also fully testable, in isolation, without the need to start up a server.

How can you run Bootzooka? You don't need any kind of container, embedded or not! All that you have to do is bind to a socket and pass in the routes which should handle incoming requests to an `ActorSystem` extension provided by Akka HTTP. Take a look yourself, from [`Main.scala`](https://github.com/softwaremill/bootzooka/blob/master/backend/src/main/scala/com/softwaremill/bootzooka/Main.scala):

````scala
Http().bindAndHandle(
  routes, 
  config.serverHost, 
  config.serverPort)
````

If you'd like to quickly start developing an application using Scala, Akka HTTP and Angular, [Bootzooka](http://softwaremill.github.io/bootzooka/) is for you! Apart from what's described above, its has a lot of the "boring" features done, such as user registration, logging in/out, notifications, as well as an integrated SBT+Grunt build system, backend & frontend tests, fat-jar deployments (local and to Heroku). 

In other words, all that you need when starting a new project to start coding business value, instead of infrastructure.

You can take a look at a [live demo](http://bootzooka.softwaremill.com/) of the running application. **Star the project** on [GitHub](https://github.com/softwaremill/bootzooka) if you like it, and of course, if you would have any suggestions or contribution ideas, let us know!
