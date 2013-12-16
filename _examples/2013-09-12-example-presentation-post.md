---
layout: simple_presentation
title: Scala macros - what are they, how do they work & who uses them
conference: JavaZone 2013, Norway
abstract_fragment: Macros are a brand new feature of Scala 2.10. In the presentation I would like to explain why were they added to the language, show step by step how to write your own simple macro and show some libraries using them
keywords: scala, macros, slick, scalamock
speaker: Adam Warski
speaker_login: adam_warski
categories:
- presentations
---

Macros are a brand new feature of Scala 2.10. In the presentation I would like to explain why were they added to the language,
show step by step how to write your own simple macro and show some libraries, which already use macros to implement functionalities,
which were not possible before.

[Macros](http://scalamacros.org) are one of the new features in Scala 2.10. So far they are marked as experimental,
but I think nobody has doubts that they will stay there for good. Introducing macros was quite controversial, as Scala isn't
a "lean" language already, but I think it was worth it.

Macro is simply a Scala program, executed at compile-time, which manipulates the AST of our program. While we probably will mostly
write macros when creating a library of a framework, rather than in day-to-day work (hopefully!), for sure it is good to know
what are the mechanisms behind them.

In the presentation, I would firstly like to show step-by-step how to write a simple macro and how does it work. In the second part
I will present libraries, which already use macros (but without implementation details), such as [ScalaMock](http://scalamock.org/),
[Expecty](https://github.com/pniederw/expecty), [Slick](http://slick.typesafe.com/) or or my own, [MacWire](https://github.com/adamw/macwire).

<h4>Slides</h4>
<iframe src="https://www.slideshare.net/slideshow/embed_code/26131216" width="427" height="356" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC;border-width:1px 1px 0;margin-bottom:5px" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="https://www.slideshare.net/adamw1pl/scala-macros" title="Scala Macros" target="_blank">Scala Macros</a> </strong></div>

<h4>Video</h4>
<iframe src="//player.vimeo.com/video/74553075" width="429" height="241" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> <p><a href="http://vimeo.com/74553075">Scala macros: what are they, how do they work & who uses them</a></p>
