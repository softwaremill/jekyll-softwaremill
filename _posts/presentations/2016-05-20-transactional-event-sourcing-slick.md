---
layout: simple_presentation
title: Transactional event sourcing using Slick (audit log for free!)
conference: Scala Days
abstract_fragment: Event sourcing using Slick and transactions
keywords: scala, slick, event sourcing, rdbms, transactions
speaker: Adam Warski
speaker_login: adam_warski
categories:
- presentations
---

Event sourcing is a great alternative to traditional “CRUD”-type architectures. The central concept is a persistent stream of *events*, which drives all changes to the read model and running any kind of business logic. There’s a lot of technical and business benefits to such an approach, such as being able to re-create the state of the system at any point in time, or keeping a detailed *audit log* of all actions.

Typically, implementations of event sourcing are presented using a NoSQL data storage, which is great for many use cases (e.g. using Akka Persistence + Cassandra). However, nothing stops us from using a relational database and SQL! In many applications (especially “enterprise”), this brings many benefits, such as powerful and familiar query capabilities and higher guarantees around data consistency.

In this mainly **live-coding talk** we’ll see one way of implementing transactional event sourcing using the `slick-eventsourcing` micro-framework, introducing the core concepts: *command handlers*, *read model updates* and *event listeners*, and how to use them to build an event-sourced application. We’ll see how Slick’s `DBAction` and Scala flexibility makes it possible to provide an **elegant DSL** to build the system from simple functions with minimum dependencies.

<h4>Slides</h4>

[View here](http://www.slideshare.net/adamw1pl/slick-eventsourcing)
