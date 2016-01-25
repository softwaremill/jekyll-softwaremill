---
title: Scala Clippy, helping you understand what the compiler errors actually mean
description: Introducing our new project, Scala Clippy, which gives advice to some common compiler errors
author: Adam Warski
author_login: warski
categories:
- scala
- clippy
- compiler
- company
layout: simple_post
---

When listening to [Jessica Kerr's keynote](https://skillsmatter.com/skillscasts/6483-keynote-scaling-intelligence-moving-ideas-forward) during [Scala eXchange](https://skillsmatter.com/conferences/6862-scala-exchange-2015), specifically the part where she mentioned unhelpful and cryptic Scala compiler errors, we got an idea: what if we could provide human-friendly explanations for some of the more common error messages? [Elm](http://elm-lang.org/) goes in a similar direction, with special-cased error messages for common mistakes, e.g. using the wrong operator for string concatenation.

We are not the first to invent a helpful computerised assistant of course, hence we followed the good traditions of a popular office suite and the [Scala Clippy](https://www.scala-clippy.org) project was born.

[Scala Clippy](https://www.scala-clippy.org) is a compiler plugin which, when there’s a compiler error, checks it against the errors it knows about. If there’s a match, an additional error message (the advice) is printed to the user. For example, in addition to the following error:

```
[error] TheNextFacebook.scala:16: type mismatch;
[error]  found   : akka.http.scaladsl.server.StandardRoute
[error]  required: akka.stream.scaladsl.Flow[akka.http.scaladsl.model.HttpRequest,akka.http.scaladsl.model.HttpResponse,Any]
[error]   Http().bindAndHandle(r, "localhost", 8080)
```

which may leave you wondering what did you do to the compiler and why is it mean, you get the following message:

```
[error]  Clippy advises: did you forget to define an implicit akka.stream.ActorMaterializer?
[error]  It allows routes to be converted into a flow.
[error]  You can read more at http://doc.akka.io/docs/akka-stream-and-http-experimental/2.0/scala/http/routing-dsl/index.html

```

You can use Scala Clippy today by adding the following setting to your SBT build:

```
addCompilerPlugin("com.softwaremill.clippy" % "plugin" % "0.1" 
  cross CrossVersion.full)
```

Upon first compilation, the plugin will download the current advice list from [https://scala-clippy.org](https://scala-clippy.org). Subsequent updates will be downloaded in the background.

**But!** There’s always a but … where do we get the advice from in the first place? Well, the answer’s quite obvious here. The great Scala community! If you go to [scala-clippy.org](https://scala-clippy.org), under the “Contribute” tab you can paste in your own errors, which, when successfully parsed, can be added to the database with your advice for everyone’s benefit (after being reviewed and accepted, though this part is still in the works)!

We have added a few seed advices, but that’s more of a starting example. We count on You to make Scala Clippy really helpful!

What do you think about the project? Does it make any sense? Please leave us feedback either here or through the website. The success of failure of Scala Clippy largely depends on the community input. Both code contributions to the plugin & website (all open-source) and to the error database are more than welcome!
