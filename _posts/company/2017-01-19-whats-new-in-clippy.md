---
title: What's new in Clippy?
description: Enrich your compiler errors with colored highlighting.
author: Krzysztof Ciesielski
author_login: ciesielski
keywords: scala, sbt, clippy, compiler
categories:
- scala
- company
layout: simple_post
---
[Clippy](https://scala-clippy.org/) is a Scala compiler plugin which enriches compilation errors with additional advices. Last few months brought some new cool features. The most important are:

##Colored diffs in type mismatch errors  

Type-driven development gets more and more popular and sophisticated. Libraries like Shapeless and techniques like free monads become widespread, making type mismatch errors more and more frequent. Sometimes it takes a moment to spot differences between actual and expected type, especially for long signatures. Try for yourself and spot where's the difference in following example:  

<div style="width: 100%; text-align: center"> <img src="/img/clippy-highlighting-01.png" /> </div>

Clippy 0.4.1 offers a new feature - diff highlighting for better UX of your errors:  

<div style="width: 100%; text-align: center"> <img src="/img/clippy-highlighting-02.png" /> </div>

This option is disabled by default, so that CI logs and other outputs which don't support ANSI colors won't get affected when you update to the newest version. To turn highlighting on, add `"-P:clippy:colors=true"` to your scalac options. See [the docs](https://github.com/softwaremill/scala-clippy#enabling-colored-type-mismatch-diffs) for more details.  

##Local advices  

Sometimes you may want to have project-specific advices. New developers joining a project may risk struggling with some vague compiler errors related to particular internal types. Clippy now allows defining a custom set of advices and keep it your `.clippy.json` file in project directory. [Read more](https://github.com/softwaremill/scala-clippy#project-specific-advice) here.  

##Future plans  

We are looking into possibilities of leveraging more ANSI colors in the output. Current experiments concern code syntax highlighting, there may be also further enhancements to the presentantion of long type signatures. Contributions are very welcome, both code updates or [new advice submissions](https://scala-clippy.org/), so don't hesitate to join the project!
