---
layout: simple_presentation
title: Evaluating persistent, replicated message queues
conference: Voxxed Days
abstract_fragment: How do HornetQ, RabbitMQ, Kafka, SQS and MongoDB compare performance-wise? What kind of features do they offer if you want to do persistent, replicated messaging?
keywords: messaging, message queue, mq, replicated, hornetq, rabbitmq, kafka, sqs, mongodb, performance, clustering
speaker: Adam Warski
speaker_login: adam_warski
categories:
- presentations
---

Messaging systems have always been an important architectural component of many systems. With the rising popularity of microservices and reactive programming, the MQ workload increases significantly, setting new requirements as to their performance and resilience.

We will take a look at a specific subset of messaging systems: ones which offer both persistence and replication. In other words, ones that will make sure that messages are not lost, even in case of hardware failure.

The evaluation will include RabbitMQ, HornetQ and Kafka, as well as a MongoDB-based queue and the as-a-service offering from Amazon, SQS. Apart from a look at their messaging protocols and semantics, we will see what is their performance, scaling characteristics and how they compare to each other.

With such information, it should be much easier to make an informed choice when looking for a messaging system for your next project!

<h4>Slides</h4>

<iframe src="//www.slideshare.net/slideshow/embed_code/44350187" width="425" height="355" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/adamw1pl/eval-repl-mq" title="Evaluating persistent, replicated message queues" target="_blank">Evaluating persistent, replicated message queues</a> </strong> from <strong><a href="//www.slideshare.net/adamw1pl" target="_blank">Adam Warski</a></strong> </div>