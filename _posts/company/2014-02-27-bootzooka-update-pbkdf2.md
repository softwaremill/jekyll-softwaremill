---
title: Bootzooka update - PBKDF2 for user passwords, smaller footprint
description: Update on the recent developments in Bootzooka - using PBKDF2 for user passwords, general slimming to make the project smaller and better
author: Adam Warski
author_login: warski
categories:
- company
layout: simple_post
---

[Bootzooka](https://github.com/softwaremill/bootzooka) is our template web project, featuring Scala and Scalatra for the backend, an AngularJS single-page-app for the frontend, and a joint SBT+Grunt build process.

Even a template project evolves all the time. Recently I've been speaking at [Jfokus](http://www.jfokus.se), and one of the most interesting presentations I attended was on security by [Jim Manico](https://twitter.com/manicode). He made some very good points on how you should store user passwords. 

We've been using salted SHA-256 passwords previously, but it's not a huge problem to crack them for modern GPU clusters. Hence now Bootzooka by default uses [PBKDF2](http://en.wikipedia.org/wiki/PBKDF2) hashing with 10000 iterations. The benefit of PBKDF2 is that it is computationally expensive to generate the hash, so cracking the passwords gets substantially harder.

If you are interested in the subject, take a look at the [OWASP password cheat sheet](https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet).

In other news, we also updated a lot of Bootzooka's dependencies. We also removed some dependencies and smaller features which aren't absolutely necessary in a template project, reducing the final .war size from 77MB to 45MB.

Adam