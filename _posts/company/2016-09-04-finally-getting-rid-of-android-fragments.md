---
title: Finally getting rid of Android Fragments
description: Why we should use Conductor to build Android apps
author: Sebastian Drygalski
author_login: no-image
categories:
- android
- mobile
- fragments
- conductor
- backend
layout: simple_post
---

## Reception of Android Fragments ##
There is a lot written about problems with Fragments on Android, their bugs, weird behaviors, boilerplate needed to make them work and overly complicated lifecycle. They are hard to debug and generally unfriendly to developers. [Square](https://squareup.com/) — a company behind many successful open source libraries — took this problem to heart. Two years ago they made a detailed critique of fragments; you can read it here: Advocating Against Android Fragments. They took it even further, and created Mortar&Flow, a replacement for Android Fragments. It was a major change compared to Fragments — everything was based on Views, eliminating most of the problems Fragments had.
Fast forward to the present day, we know that Mortar&Flow didn’t take off, as many of us hoped for. It was too complicated and, because of the lack of simple examples, it was way harder to incorporate in apps for many developers. Especially, the boilerplate was sometimes bigger than in Fragments. But in the end it was really great, it showed the community that we are able to try improving on the Fragments paradigm.

## Emerging solutions ##
We would see more attempts of getting rid of Fragments. Specifically, recently we got [Scoop](https://github.com/lyft/scoop), [Pancakes](https://github.com/mattlogan/Pancakes) and [Conductor](https://github.com/bluelinelabs/Conductor). I will try to show you, why — in my opinion — Conductor is the best tool for the job, and has the best chance to finally rid us of Fragments in the Android world.

## Solution - Conductor ##
As stated on their [github](https://github.com/bluelinelabs/Conductor), Conductor is a `small, yet full-featured framework that allows building View-based Android applications`. The main idea is to completely get rid of Fragments and even Activities, and base the entire navigation, backstack handling, transitions and state management on Conductor. Conductor does not introduce anything new, internally it depends on well tested and reliable `Views`. As we will see, this main assumption works very well and fixes many problems.

If you want to know why Fragments are bad, read Square’s article about them:[Advocating against android fragments](https://corner.squareup.com/2014/10/advocating-against-android-fragments.html)

The first goal of Conductor is simplicity. Here is the entire lifecycle of a Controller, the basic building block of layouts built with Conductor: ![A lifecycle diagram](https://github.com/bluelinelabs/Conductor/blob/develop/docs/Controller%20Lifecycle.jpg?raw=true)
Conductor will handle navigation and the backstack for you, to the point where you can finally build apps that consist only of a single Activity (no more undocumented behaviours with Activity flags!). It also supports new, fancy transitions with shared elements.
Remember, it’s build on top of `View`, so there is no reason to expect any lack of compatibility in the future. This means that state persistence and all kinds of callbacks are supported too.
The newest version (2.0 at the time of writing this) also supports unlimited nesting of controllers, something that Fragments still have problems with. Additionally, Conductor doesn’t force any kind of architecture on the developer, you can still use whatever paradigm you like: fragments, activities or other libraries.

## Details ##
What was important for me, especially in terms of debugging is that transactions are executed immediately. No more unknown state e.g. during configuration change like in Fragments, where transactions are async.
Controllers are lightweight and, what is crucial, they don’t keep references to their views when they are on the backstack. For example, Pancake will keep all views in memory, and in complex apps with a lot of nested navigation this could be a real problem.
Controllers will retain state during configuration changes and, what is nice, even when they are on the backstack, their lifecycle doesn’t change.

## Community ##
The library is well received in the community, some notable developers help with constructive feedback. Some may appreciate that Mosby (a library for developing Model-View-Presenter apps) fully supports integration with Conductor (both authors cooperate on Github).
It’s not certain if it will become a standard, or even something that should be known, but for me personally it is a life saver. In complex apps, fragments were always a pain for me, and Conductor (especially since version 2.0) was really enjoyable and fun to use.

## Try for yourself ##
I really encourage you to clone [Conductor](https://github.com/bluelinelabs/Conductor), play with the demo, and check for yourself how easy and simple the code is.

