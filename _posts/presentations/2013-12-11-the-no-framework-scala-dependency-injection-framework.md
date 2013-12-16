---
layout: simple_presentation
title: The no-framework Scala Dependency Injection framework
conference: BuildStuff 13, Lithuania
abstract_fragment:  In the talk we'll walk through some of the features of DI containers and see if we can replace them with pure Scala code. We'll start with "manual" DI, followed with using MacWire to generate the wiring code for us.
keywords: scala, macros, DI, macwire, dependency injection
speaker: Adam Warski
speaker_login: adam_warski
categories:
- presentations
---

Using a DI framework/container may seem obvious. But when was the last time you considered *why* do you really need one?
After all, "dependency injection" is just a fancy name for passing arguments to a constructor. In the talk we'll walk
through some of the features of DI containers and see if we can replace them with pure Scala code.

We'll start with "manual" DI, followed with using MacWire to generate the wiring code for us. Then we'll proceed to a no-framework scopes
implementation (e. g. request or session), which are very useful in web applications. We will also discuss possibilities
of adding interceptors using macros.

And finally, we'll see how to use traits to create and compose modules (similar
to the module concept known from Guice), which can be viewed as a simplified cake pattern. As MacWire heavily uses macros,
as a bonus, I'll explain how Scala Macros work and when they can be useful.


<h4>Slides</h4>
<iframe src="https://www.slideshare.net/slideshow/embed_code/29103817" width="427" height="356" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC;border-width:1px 1px 0;margin-bottom:5px" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="https://www.slideshare.net/adamw1pl/the-noframework-scala-dependency-injection-framework" title="The no-framework Scala Dependency Injection Framework" target="_blank">The no-framework Scala Dependency Injection Framework</a> </strong></div>