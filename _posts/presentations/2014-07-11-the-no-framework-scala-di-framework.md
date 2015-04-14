---
layout: simple_presentation
title: The no-framework Scala Dependency Injection Framework
conference: Scala Days
abstract_fragment: Using a DI framework/container may seem obvious. But when was the last time you considered *why* do you really need one? After all, "dependency injection" is just a fancy name for passing arguments to a constructor.
keywords: scala, di, spring, guice, macros, macwire, dependency injection
speaker: Adam Warski
speaker_login: adam_warski
categories:
- presentations
---

Using a DI framework/container may seem obvious. But when was the last time you considered *why* do you really need one? After all, "dependency injection" is just a fancy name for passing arguments to a constructor.

In the talk we'll walk through some of the features of DI containers and see if we can replace them with pure Scala code. We'll start with "manual" DI, followed with using MacWire to generate the wiring code for us. Then we'll proceed to a no-framework scopes implementation (e.g. request, session), which are very useful in web applications. Interceptors can be implemented in pure Scala and used declaratively as well!

Finally, we'll see how to use traits to create and compose modules (similar to the module concept known from Guice): the "Thin Cake Pattern".

As MacWire heavily uses macros, as a bonus, I'll explain how Scala Macros work and when they can be useful.

Expect a lot of live-coding and demos!

<h4>Video</h4>

<div data-parleys-presentation="the-framework-scala-dependency-injection-framework" style="width:100%;height:300px"><script type = "text/javascript" src="//parleys.com/js/parleys-share.js"></script><a href="https://www.parleys.com/play/the-framework-scala-dependency-injection-framework">Watch on Parleys.com</a></div>