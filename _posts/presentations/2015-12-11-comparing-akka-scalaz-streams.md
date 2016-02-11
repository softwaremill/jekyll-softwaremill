---
layout: simple_presentation
title: Streams - reactive? functional? Or akka- and scalaz- streams side-by-side
conference: Scala eXchange
abstract_fragment: Comparing Akka & Scalaz streams
keywords: scala, akka, scalaz, streams
speaker: Adam Warski
speaker_login: adam_warski
categories:
- presentations
---

During this 'live-coding' presentation, we will implement a couple of stream data processing examples using both the Akka-Stream and Scalaz-stream libraries, introducing their core concepts and highlighting key differences.

Stream data processing is becoming increasingly popular, providing elegant abstractions to solve a large number of everyday problems. Plus it’s at the core of the "reactive" movement! The akka-stream and scalaz-stream libraries are the two popular libraries for single-node stream processing in the Scala ecosystem.

Both libraries share a common design goal, to provide compositionality, but they take different routes to satisfy that requirement. [Akka-stream](http://doc.akka.io/docs/akka-stream-and-http-experimental/1.0-M2/scala.html) puts an emphasis on implementing the reactive streams standard and is actor-based, while [scalaz-stream](https://github.com/scalaz/scalaz-stream) aims at isolating effects and providing a possibly pure FP library. This talk compares and contrasts these systems.

<h4>Video: 45 minutes</h4>

<a href="https://skillsmatter.com/skillscasts/6877-streams-reactive-functional-or-akka-and-scalaz-streams-side-by-side">View here</a>