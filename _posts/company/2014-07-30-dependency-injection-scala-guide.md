---
title: Guide to Dependency Injection in Scala
description: Your Scala dependency injection handbook.
author: Adam Warski
author_login: warski
categories:
- company
layout: simple_post
---

Dependency Injection is now almost a standard technique when developing business applications. There's a lot of frameworks and approaches to DI. Which one to choose when using Scala? The answer may be surprising: thanks to Scala's unique type system and the expressiveness of the language, very often it's not necessary to use a DI container at all!

Instead, you can use plain Scala. This has multiple benefits: keeps your code type-safe, very flexible (you aren't constrainted by any framework) and is much less magical, hence easier to understand.

Curious how is that possible? I recently wrote a short [Scala Dependency Injection guide](http://di-in-scala.github.io/) which describes how to implement various concepts known from DI frameworks in Java and other languages, using Scala.

When Scala language constructs aren't enough, [MacWire](https://github.com/adamw/macwire) is there to help. With a handy macro, it simplifies new class instantiation code, freeing you from one tedious task. MacWire also has some utilities to implement interceptors, scopes and to integrate your code with web frameworks.

The [Scala Dependency Injection guide](http://di-in-scala.github.io/) is open-source, so if you have any ideas for improvements, or think something is missing, simply fork & send me a pull request.