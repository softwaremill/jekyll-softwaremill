---
title: Scaling Ruby to Scala? Yap.TV Case Study
description: Yap.TV decided to re-engineer their backend systems with the help of software development from SoftwareMill.
author: Adam Warski
author_login: warski
categories:
- company
layout: simple_post
---

SoftwareMill and [Yap.TV](https://softwaremill.com/portfolio/#yap-tv) began cooperation in September 2011. At the time, the Yap.TV server was entirely Ruby-based. While this worked in the beginning, as the user base grew, high load on the servers, especially during prime time TV, caused significant issues with server performance and scalability.

Not only was this degrading the end-user experience, but as new features were waiting in the backlog to be developed, key engineering resource time was becoming dominated by scaling servers and operations. 

Apart from serving traditional web traffic, Yap.TV also required an increasing number of background imports, taking together data from various sources. To handle the ever growing amounts of data to be processed, a performant (but at the same time - easy to program and safe) concurrent programming model was crucial. 

#The solution

Yap.TV decided to re-engineer their backend systems with the help of software development from SoftwareMill. We formed a joint backend team to tackle the problems. The platform of choice was the Typesafe Reactive Platform: Scala as a base language, Akka for concurrent programming and Spray.io to build the REST services.

To be able to deliver quickly, we gradually replaced portions of Yap’s REST API, starting from some simple endpoints to get deployment right, and then proceeding to the ones with the highest congestion. We promptly found that Spray.io, in combination with the Scala language, enabled us to rapidly develop new web service endpoints. Type-safety saved us from a lot of debugging and the ability to create composable abstractions kept our code concise and easy to maintain.

To implement the data processing pipeline, we used the Akka concurrent programming framework. Handling multiple, asynchronous data streams and processing them in real-time became not only possible, but also feasible to implement in a reasonable timeframe and a clear, understandable way. The Actor programming model itself, and the fact that instead of thinking about threads and synchronization, one has to think about actor behaviours and interactions, which happen asynchronously, makes programming of such systems much easier.

<div style="width:100%; text-align:center">
<img src="/img/uploads/2014/06/casestudyyap.png"/>
</div>

Importing data from third-party services (which in case of Yap.TV, among others, include Twitter, Facebook, EPG and iTunes data) is an inherently error-prone process, hence detecting problems early and recovering from them is crucial. Here again Akka was a good fit, due to the supervisor hierarchies and the let-it-crash philosophy.

Thanks to the versatility of the Scala platform, we were able to use and easily integrate with Java-based systems, such as ElasticSearch for implementing TV show search and Mahout for an initial version of our recommendation system (which we ultimately replaced with a custom-written pure-Scala solution).

At each point of the development process, we kept the quality standards high. All of the code is peer-reviewed, not only to find bugs and design problems as early as possible, but also to disseminate the knowledge about the code, hence reducing code ownership. All of our code is also unit- and (where this makes sense) integration- tested. 

The Scala ecosystem encourages a simpler deployment process, without the need to maintain application servers or such, which are commonplace when using e.g. Java. All of our services are packaged as fat-jars, and run as first-class daemons. Our automated Chef-based deployment infrastructure takes care of distributing new code to the servers on which it should be run. Thanks to that we can deploy multiple times per day, and the users will only notice the improved feature set, no downtime! 

#Remote project delivery

But technology isn’t everything. Equally, if not more important is the way teams collaborate to deliver software. As Yap.TV is based in San Francisco, California, and SoftwareMill in Warsaw, Poland, we formed a truly distributed team (SoftwareMill is additionally a fully distributed company, our employees come from many parts of the country), working remotely across two different time zones.

We tried to keep the formalism of our cooperation as low as possible. When it seemed beneficial, we used tools such as TinyPM, JIRA or Confluence. We had no strict requirement documents, instead we tried to communicate as frequently as possible to deliver what will be the highest value for Yap.TV, and hence the highest value for Yap.TV users. That way we could adapt quickly based on the continuously gathered feedback.

Moreover, at SoftwareMill we have [a number of proven methods for effective asynchronous and synchronous communication in a distributed setup](https://softwaremill.com/skype-games-on-effective-distributed-teams/). In the end the fact that we work remotely was barely noticeable. 

#The result

SoftwareMill’s participation with Yap.TV in developing a high-performance, resilient and scalable backend, with the help of the Typesafe Reactive Platform (Scala, Akka, Spray.io) resulted in a solid server platform for Yap.TV, ready to accommodate not only increases in traffic, but also brand new problem domains.
