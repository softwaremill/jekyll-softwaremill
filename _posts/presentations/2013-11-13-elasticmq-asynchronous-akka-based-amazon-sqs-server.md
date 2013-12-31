---
layout: simple_presentation
title: ElasticMQ - a fully asynchronous, Akka-based Amazon SQS server
conference: Devoxx 2013, Belgium
abstract_fragment: In the talk I will show how easy it is to run an embedded or stand-alone ElasticMQ server and test SQS client code, both from JVM-based and non-JVM languages.
keywords: scala, akka, amazon sqs, spray
speaker: Adam Warski
speaker_login: adam_warski
categories:
- presentations
---

Amazon SQS is great if you need a simple message queueing system. Though when using SQS, it would be good
to test how our code integrates with it (for example if it correctly handles the visibility timeout or
queue creation parameters). Thus ElasticMQ was created: to provide an embeddable, in-memory SQS implementation.

In the talk I will show how easy it is to run an embedded or stand-alone ElasticMQ server and test SQS client code,
both from JVM-based and non-JVM languages.

The second part will be more technical; I will briefly explain how actors are used to handle queues, how to implement
long polling using futures, and how to write sequential-like code which in fact runs asynchronously using Akka Dataflow.
I will also demo some of the features of Spray, an Akka-based HTTP/REST toolkit, which make it easy to quickly create APIs.

The project is fully open-source. You are encouraged to fork at: [https://github.com/adamw/elasticmq](https://github.com/adamw/elasticmq).

<h4>Slides</h4>
<iframe src="https://www.slideshare.net/slideshow/embed_code/28292398?rel=0" width="427" height="356" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC;border-width:1px 1px 0;margin-bottom:5px" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="https://www.slideshare.net/adamw1pl/elasticmq-a-fully-asynchronous-akkabased-sqs-server" title="ElasticMQ: a fully asynchronous, Akka-based SQS server" target="_blank">ElasticMQ: a fully asynchronous, Akka-based SQS server</a> </strong> </div>

<h4>Video</h4>
<iframe type="text/html" width="420" height="290" mozallowfullscreen="true" webkitallowfullscreen="true" src="https://parleys.com/share.html#play/52a5a081e4b0e619540cc47a" frameborder="0">&lt;br /&gt;</iframe>
