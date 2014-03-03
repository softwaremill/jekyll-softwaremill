---
title: Bootzooka update - fat-jar deployments
description: Update on the recent developments in Bootzooka - fat-jar deployments
author: Adam Warski
author_login: warski
categories:
layout: simple_post
---

[Bootzooka](https://github.com/softwaremill/bootzooka) is our template web project, featuring Scala and Scalatra for the backend, an AngularJS single-page-app for the frontend, and a joint SBT+Grunt build process.

You can now create a single, runnable jar thanks to the [SBT assembly plugin](https://github.com/sbt/sbt-assembly). The fat-jar includes all of Bootzooka's code, as well as the Javascript, stylesheet and html files processed by the frontend Grunt build.

Running a bootzooka-based application is now as simple as:

<code>java -jar bootzooka.jar</code>

You can then access the webapp through http://localhost:8080. Note that if you'd like to create a deployable war file, that's still available. Refer to the [README](https://github.com/softwaremill/bootzooka) for details.

Adam