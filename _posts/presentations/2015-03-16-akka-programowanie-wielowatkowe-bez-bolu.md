---
layout: simple_presentation
title: Akka - parallel programming without the pain
conference: Szczecin Java User Group
abstract_fragment: Run parallel tasks using Akka actors on local machine, create and communicate with actors on remote machine, use routers to send tasks to actors most effectively, test them and many more.
keywords: akka, scala, concurrent, parallel
speaker: Paweł Stawicki
speaker_login: stawicki
categories:
- presentations
---

10 years ago, concurrent programming was not as popular as it is today. On machines with one core, there was no possibility to run two commands in parallel anyway. Things have changed and now, when we can have 4 cores in a phone, it is more and more important to design our programs to run many tasks in parallel.

Concurrent programming with locks and shared memory is difficult, cumbersome and error prone. Akka creators wanted to make it easier and more comprehensible. Actors can execute tasks in parallel, are fast and lightweight, and don't share any state with any other part of application.

In this presentation, I want to show how to create parallel programs with Akka by example. There are a few slides, much code. I'll show how to run parallel tasks using actors on local machine, how to create and communicate with actors on remote machine, how to use routers to send tasks to actors most effectively, how to test them and many more.

[Slides](http://amorfis.github.com/akka-pres/)

[Code](http://github.com/amorfis/akka-pres-src/)
