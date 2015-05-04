---
title: Evaluating persistent, replicated message queues
layout: long_article
---

# Intro

Message queues are useful in a number of situations; any time we want to execute a task asynchronously, we put the task on a queue and some executor (could be another thread/process/machine) eventually runs the task. Depending on the use case, the queues can give various guarantees on message persistence and delivery. For some use-cases, it is enough to have an in-memory, volatile message queue. For others, we want to be sure that once the message send completes, it is persistently enqueued and will be eventually delivered, despite node or system crashes.

In the following tests we will be looking at queueing systems at the 'safe' side of this spectrum which try to make sure that messages are not lost by:

* persisting messages to disk
* replicating messages across the network

## Version history

<table>
  <tbody>
    <tr>
      <td>4 May 2015</td>
      <td>updated with new versions, added ActiveMQ; new site</td>
    </tr>
    <tr>
      <td>1 Jul 2014</td>
      <td>original at <a href="http://www.warski.org/blog/2014/07/evaluating-persistent-replicated-message-queues/">Adam Warski’s blog</a></td>
    </tr>
  </tbody>
</table>

## Tested queues

There is a number of open-source messaging projects available, but only a handful support both persistence and replication. We’ll evaluate the performance and characteristics of 6 message queues:

* [Amazon SQS](http://aws.amazon.com/sqs/)
* [Mongo DB](http://www.mongodb.com/)
* [RabbitMq](http://www.rabbitmq.com/)
* [HornetQ](http://hornetq.jboss.org/)
* [Kafka](https://kafka.apache.org/)
* [ActiveMQ](http://activemq.apache.org)

![Logos](/img/mqperf/mqperf_logos.jpg)

While SQS isn’t an open-source messaging system, it matches the requirements and it can be interesting to compare self-hosted solutions with an as-a-service one.

MongoDB isn’t a queue of course, but a document-based NoSQL database, however using some of its mechanisms it is very easy to implement a message queue on top of it.

As we have only evaluated queues with JVM clients, [EventStore](https://geteventstore.com) isn’t included in the comparison, but we hope to change that in the future.

If you know of any other messaging systems, which provide durable, replicated queues, let us know!

{%include mqperf/110-characteristics.md %}
{%include mqperf/120-methodology.md %}
{%include mqperf/130-mongo.md %}
{%include mqperf/140-sqs.md %}
{%include mqperf/150-rabbit.md %}
{%include mqperf/160-hornetq.md %}
{%include mqperf/170-activemq.md %}
{%include mqperf/180-kafka.md %}
{%include mqperf/190-summary.md %}
{%include mqperf/200-comments.md %}
