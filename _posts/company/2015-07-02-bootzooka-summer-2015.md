---
title: Bootzooka, Summer 2015
description: What's new in our Scala+Angular SPA scaffolding project, Bootzooka
author: Adam Warski
author_login: warski
categories:
- scala
- javascript
- bootzooka
layout: simple_post
---

[Bootzooka](http://softwaremill.github.io/bootzooka/) is our simple application scaffolding project, allowing to quickly start development of a Scala+Angular Single-Page-Application. It has a lot of the “boring” features done, such as user registration, logging in/out, notifications, as well as an integrated SBT+Grunt build system, backend & frontend tests, fat-jar and .war deployments. 

In other words, all that you need when starting a new project to start coding business value, instead of infrastructure.

<img src="/img/bootzooka_summer_2015.png" />

As such, Bootzooka is constantly evolving to keep up with recent developments. The technologies we choose to include are what we consider modern, but reasonably proven in production. So you won’t find a lot of the latest & hottest frameworks/libraries, but you also won’t find things from the stone age. And all of the components are easy to replace, if you’d like to experiment with a new approach, library or framework.

In the latest series of updates, we made a number of improvements. The code is simpler and shorter than before (the less code, the better), plus it’s more consistent when it comes to naming. We also refactored the frontend side substantially, we now make heavy use of Javascript promises.

When it comes to starting a new project, the first thing you want to do is rename all of the occurrences of “bootzooka” to “[insert your project name here]”. That’s why we added a handy SBT task which allows you to do that with a simple `sbt renameProject` command.

We also made it easy to deploy the fat-jar to Heroku. You only need to create an account, install the command-line toolbelt, and with a couple of command-line instructions have the app running in the cloud. For more details, take a look at [the documentation](http://softwaremill.github.io/bootzooka/heroku.html).

You can take a look at a [live demo](http://bootzooka.softwaremill.com/) of the running application. **Star the project** on [GitHub](https://github.com/softwaremill/bootzooka) if you like it, and of course, if you would have any suggestions or contribution ideas, let us know!