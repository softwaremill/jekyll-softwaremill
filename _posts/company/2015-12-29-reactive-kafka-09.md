---
title: Reactive Streams for Kafka 0.9 with Akka Streams 2.0
description: How to audit data in your application? Can event sourcing be done with a relational database? Introducing slick-eventsourcing micro-framework.
author: Krzysiek Ciesielski
author_login: ciesielski
categories:
- scala
- reactive
- kafka
- company
layout: simple_post
---
Our open source reactive-streams based wrapper for Apache Kafka has been recently [updated](https://github.com/softwaremill/reactive-kafka/releases/tag/v0.9.0) to support **Kafka 0.9.0.0 and Akka Streams 2.0**. Let's see what are the most important API updates and internal changes.

## Akka Streams 2.0
The new streaming API is now available after two short periods of `M1` and `M2`, so our library has also been adjusted. So far the adjustments only deal with API compatibility - from user's perspective these changes are transparent. You should be able to use Reactive Kafka in the same way as previously, by working with the `Publisher` and `Subscriber` interfaces, or by accessing underlying actors with the same messages as in 0.8. With next steps we work on replacing underlying `ActorPublisher` with `GraphStage`.

## Explicit Key/Value types
So far the API has been capable of sending/receiving messages of some type `T`, given provided proper (de)serializer. In fact, Apache Kafka allows to send messages as key-value pairs. Until now, key values have been partially "hidden" from the user, represented by arrays of bytes. Starting with new version, the streams are explicitly parameterized by two types - `[K, V]`. Their respective (de)serializers have to be specified accordingly:

```scala
val consumerProperties = ConsumerProperties(
  bootstrapServers = "localhost:9092",
  "topic",
  "groupId",
  keyDeserializer = new StringDeserializer(),
  valueDeserializer = new StringDeserializer(),
)
```
You can skip the `keyDeserializer` which will create a `ConsumerProperties[Array[Byte], V]`.  
Messages received from Kafka are now of type `org.apache.kafka.clients.consumer.ConsumerRecord[K, V]`, while the producer requires you to provide a `com.softwaremill.react.kafka.ProducerMessage[K, V]`. If you want to skip the key part, you can create a message like this:  
`val message = ProducerMessage(someValue)`. This constructor will create a `ProducerMessage[Array[Byte], V]` with empty an key underneath.

## Error handling revisited
The new consumer and producer APIs have pretty straightforward error handling scheme. Retries and reconnections attempts are managed automatically and if there's an exception then it's unrecoverable. Because of this, Reactive Kafka now closes all resources and stops the producer/consumer actor on failure. User's responsibility is to set up a `DeathWatch` and eventually reload the stream or take other actions. No more dealing with supervision strategies or leaking Kafka connections because of unstopped actors.

## Manual commit - deleting code never tasted so good
Perhaps one of the coolest features of new Kafka consumer is its `commit()` function which now takes care of all the hassle that had to be implemented on our side in Reactive Kafka 0.8.x. This upgrade resulted in quite a significant deletion of code responsible for finding cluster coordinator, retrying connections, etc. It's now all up to the official Kafka client. Also, support for keeping offsets in Zookeeper has been dropped.

## New Consumer / Producer
With 0.9.0.0 Kafka offers new acess APIs available as external Java libraries. These APIs have been used to replace old `KafkaStream`-based consumer and producer. The most important change from the perspective of our internals is that Kafka no longer does any buffering of consumed messages. Previously the client returned item-by-item which nicely fits to the concept of streams, but in fact the messages have been read in batches, hidden from the caller. Now our internals call `client.poll()` which returns these batches directly, so that Reactive Kafka can control its own actor-level buffering.

## 0.8 is still supported
If you're not planning to switch soon, don't worry. We are keeping a separate branch for 0.8 which will be updated with bugfixes and performance improvements. Check out our latest [0.8.4 release](https://github.com/softwaremill/reactive-kafka/tree/0.8) for initial Akka Streams 2.0 support.

## The new, shiny Activator
Our [Typesafe Activator template](https://www.typesafe.com/activator/template/reactive-kafka-scala) has also been updated and now it demonstrates how to use the new API with better examples.

## What's next?
Our main goals for future releases are:  
- Polish the public API of 0.9 based on community responses  
- Rewrite internals to work with Akka's `GraphStage` API instead of `ActorPublisher` and `ActorSubscriber`  
- Prepare and run some benchmarks to measure and improve performance  
We hope that the overall adoption of Kafka 0.9.x will progress swiftly. If you try it with the Reactive Streams library and have some feedback - don't hasitate to join us on [Gitter!](https://gitter.im/softwaremill/reactive-kafka). 