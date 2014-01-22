---
title: Conway's Law and SoftwareMill?
description: How does Conway's Law apply to SoftwareMill and the software and products that w ecreate?
keywords: softwaremill, buildstuff, hintjens, conway, communication
author: Adam Warski
author_login: warski
categories:
layout: simple_post
---

Some time ago I was reading a summary of the [BuildStuff 2013](http://buildstuff.lt/) conference by [Pieter Hintjens](http://hintjens.com/blog:73). It’s an interesting read as a whole, but here I’d like to draw your attention to the fragment about Conway’s Law.

[Conway’s Law](http://en.wikipedia.org/wiki/Conway's_law) says that the systems we create as a company reflect the communication patterns of the company.

Pieter expands the idea, to describe how large-scale distributed systems are created by teams of people:

> "One program reflects how one person thinks. A large-scale application reflects how many people think together.
> (...) <br />
> Let me propose, (...), that to build a successful large-scale distributed software system, you must build a successful large-scale distributed organization."

What could that mean in case of SoftwareMill, which [isn’t exactly a typical software house](https://softwaremill.com/20-ceos-in-one-company/), as we all work remotely, have a flat organisational structure and open books/decision making process?

One thing to note here is that we aren’t (yet) a large-scale organisation, which doesn’t mean we don’t create large-scale systems.

How do communication patterns in our company look like? As we are all remote, almost all communication goes either through **Skype** (text) or **TeamSpeak** (voice). Skype is asynchronous: you leave a message and eventually get a reply, or not. TeamSpeak is synchronous, but most often it’s used in pairs, where two people work on coding a feature (remote pair programming) or try to solve a problem.

We try to eliminate or size down any larger meetings as much as possible. And when there are **meetings** (sometimes people *do* need to talk ;) ), we try to make them non-blocking - people are free to come, join and leave as they wish. Any important things end up being  on our **wiki** anyway, and interested people can catch up.

We have here some patterns known from our daily programming lives:

&#8608; asynchronous messaging (Skype) <br />
&#8608; two-way synchronous information exchange (TeamSpeak) <br />
&#8608; trying to achieve consensus in a fault-tolerant way: a node joining/leaving doesn’t crash the process (meetings) <br />
&#8608; publishing to a messaging topic, broadcasting to subscribers (wiki)

Do we see these patterns in the software that we create?

Indeed, for example in the **[SMS gateway/reporting projects](https://softwaremill.com/portfolio/)** that we have worked on, the architecture is based on multiple small services communicating using asynchronous messaging. This gives us fault-tolerance and scalability. 

Going further, we believe in **small teams** working on small projects. For a bigger project, we would prefer to have two smaller teams working on smaller parts and establishing a communication protocol between their systems, rather than one big team working on the whole thing. Would this be a hint that we prefer microservices-like architectures? 

Or in **[CodeBrag](http://www.codebrag.com/)**, the review and communication process is asynchronous; discussions on commits are broadcast to interested parties. 

Hence Conway’s Law doesn’t only affect the software we create, but also our products. Can you see Conway’s Law in action in your organisation as well?
