---
title: Approaches to data auditing and introducing Slick-Eventsourcing
description: How to audit data in your application? Can event sourcing be done with a relational database? Introducing slick-eventsourcing micro-framework.
author: Adam Warski
author_login: warski
categories:
- scala
- slick
- event sourcnig
- audit
- company
layout: simple_post
---

I’ve been working on various ways to audit data for quite some time now, probably because when working in IT (*Information* Technology), it’s just so painful to see all that historical data go to waste. You never know when it might be useful, but often it’s too late! Moreover, a good technical approach to auditing actually has **real business value**, which among a lot of the fancy libraries/frameworks that we use today is a nice change.

The first approach to auditing is to automatically capture changes done to the "current" data in the database, and store a log, deltas or older versions in history tables. In my case, this approach materialised in the form of [Hibernate Envers](http://hibernate.org/orm/envers/), where if you annotate JPA entities with `@Audited`, a mirror table is created and automatically populated with historical data.

The second approach is to make the audit log the **primary source of truth** in the system. This is known as *event sourcing*: based on external (e.g. end-user) input, events are created and persisted. Each event describes what kind of change *happened in the system*. Basing on that, a read model is created (for serving user queries, and also validating input data), plus any kind of business logic can be run (e.g. communicating with external systems). There’s a lot of advantages to such an approach, which are described in a number of articles on the web, let me just mention the fact that it’s possible to rebuild the state of the system at any point in time; you get a very detailed audit log of who did exactly what and when; plus a lot of flexibility in reacting to changes in the system, on a more technical level.

This latter approach now also materialised, in the form of a micro-framework (I think the readme is longer than the actual code) [slick-eventsourcing 0.1](https://github.com/softwaremill/slick-eventsourcing). As the name suggests, it builds on top of [Slick](http://slick.typesafe.com), and implements an approach to event sourcing where storing events and resulting modifications to the read model are done in a single transaction, which makes it easier to maintain data consistency. I described this approach in more detail in [an earlier blog post](https://softwaremill.com/entry-level-event-sourcing/).

That’s of course only one of many ways to implement event sourcing, and heavily depends on the use-case (as always). For example, you could use a dedicated event storage, such as [EventStore](https://geteventstore.com), or a concurrency framework such as [Akka persistence](http://doc.akka.io/docs/akka/snapshot/scala/persistence.html) or [Eventuate](https://github.com/RBMHTechnology/eventuate). However, I think that for many applications, especially the "enterprise" ones, there’s no real need to use a clustered NoSQL system, and a traditional SQL database actually brings a lot of value. We are using `slick-eventsourcing` in a couple of our projects and so far it works quite well.

Using `slick-eventsourcing` you still get the familiar SQL tables with the "current" data (that’s the *read model*), which you can query as in a "traditional" CRUD application. The main difference is that any changes are driven through events, not done directly to the read model. There’s an extensive [README](https://github.com/softwaremill/slick-eventsourcing) which describes the main components, as well as a [gitter channel](https://gitter.im/softwaremill/slick-eventsourcing?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) if you’d need help.