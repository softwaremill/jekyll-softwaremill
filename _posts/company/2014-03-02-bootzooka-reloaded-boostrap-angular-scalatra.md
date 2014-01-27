---
title: Bootzooka Reloaded - Boostrap your AngularJS & Scalatra apps!
description: Bootzooka is a small scaffolding project we use in SoftwareMill to quicky set up new project matching Bootzooka's tech stack. And we share it on GitHub so you'll save time and effort.
keywords: bootzooka, boostrap, scaffolding, angularjs, scalatra
author: Michal Ostruszka
author_login: ostruszka
categories:
- company
layout: simple_post
---

Do you remember our tiny bootstrapper project called [Bootzooka](http://github.com/softwaremill/bootzooka)? I've got great news for you - Bootzooka has just got a major update! Read on to find out what's new and what's been changed.

### What's Bootzooka about?
Let's start with a few words of introduction. Bootzooka is a kind of scaffolding project we've created and use at [SoftwareMill](http://softwaremill.com) whenever we start a new project that matches Bootzooka's technology stack. We have several succesful projects built upon Bootzooka at Softwaremill and know about several more existing outside of our company. 

### The Parts
Bootzooka consists of higly opinionated tools we use as the default choice for our new projects. The backend is written in Scala exposing JSON API via Scalatra and MongoDB takes care of the storage. The browser part is a modern Single Page Application built on AngularJS and Twitter Bootstrap by default. 

Bootzooka itself has very few "production" features; we believe that its greatest strength lies in the complete tooling and automation around the project stack. You don't have to spent time configuring the build tools, dependencies, the project structure and so on. Bootzooka brings it for free! Just load your Scala-based modern web application into Bootzooka and see it fly!

### The New & The Changed
In its previous incarnation Bootzooka used to be a typical, monolithic (in terms of development) web application. The support and tooling for working with JavaScript code and entire frontend part was provided via (not always perfect) SBT plugins.

Today, with a bigger shift towards JavaScript-heavy client applications and the server being only a source of data in JSON format we recognize that the frontend part evolves into a separate, first class citizen project. It requires its own, dedicated build tools as any other application. That's why we've decided to go for it in Bootzooka and introduced [Grunt.js](http://gruntjs.com) as a build tool for frontend application. What's the difference? Well, as a starter point in Bootzooka you get features like:

* concatenation of production assets to minimize the HTTP requests
* live reload support - whenever you change a file it automatically refreshes your browser which means no more F5 key abuse during development
* running tests on a headless WebKit browser (PhantomJS)
* autotest feature - whenever you change a file, the tests are run so you can be sure you are good to do the next step
* code quality check with JSHint - again, JSHint is fired on a file change and checks your code quality

Grunt has a huge number of plugins so if you ever need anything specific in your project there is high chance that Grunt has a plugin for that.

Although we've significantly changed the project's layout as described above, nothing has changed in the final build and deployment. You still get a WAR archive as a result of the `package` command in SBT. 
This archive bundles together the server side and frontend parts so you can drop it into your servlet container - as usual, nothing changed here.

We've also thinned Bootzooka a bit. What does it mean? Well, we want Bootzooka to be kind of starter kit for the new projects; you can take it and start building your stuff on it without any need to remove code or features. Right now Bootzooka is simplified down to the following features:

* User registration and login/logout
* Password recovery
* Simple profile management

Not so much, huh? It may sound so, but in fact you get a complete backend layer for that (ranging from talking to the DB to exposing the JSON API) together with a complete frontend solution (AngularJS application structure with a basic security and server communication). 
It means that you can start building your application on it right away as there is a high chance that your project needs authentication and user management. Other features are up to you and Bootzooka doesn't stand in your way ot building them right.

### Upgrades
As for the versions of building blocks, the following are now in Bootzooka:

* Scala - 2.10
* Angular 1.2.6
* MongoDB - 2.4
* SBT - 0.12.1
* Grunt.js - 0.4.2

### Wrap up
There were several changes in Bootzooka that we believe will make the bootstrapping of new, modern web application projects even easier.

If you feel your new project may benefit from Bootzooka, clone it and build your stuff upon it. We'd be happy if you let us know about that, but that's not obligatory. In case you have any questions regarding the new Bootzooka, do not hesitate to ping us. We are always glad to help.






