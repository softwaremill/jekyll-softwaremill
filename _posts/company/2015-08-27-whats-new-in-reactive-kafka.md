---
title: What's new in Reactive Kafka?
description: Check out new features introduced in Reactive Kafka 0.8.0
author: Krzysztof Ciesieslki
author_login: ciesielski
categories:
- scala
- company
layout: simple_post
---
Recently we released [Reactive Kafka 0.8.0](https://github.com/softwaremill/reactive-kafka). This version introduces an enchriched API as well as manual commit support, better error handling and Java wrappers. Let's take a closer look at these new features:

### New API
The most breaking change is that all messages consumed from Kafka publishers are now represented as rich objects of type `kafka.message.MessageAndMetadata`. This class comes from Kafka API. It lets us extract information like message offset or partition. One of the most important changes allowed by this update is introducing manual commit.  
**Important**: Please note new groupId/artifactId that we use from this release:

```scala
libraryDependencies += "com.softwaremill.reactivekafka" %% "reactive-kafka-core" % "0.8.0"
```

### Manual commit and at-least-once-delivery
In order to achieve at-least-once-delivery we must be able to commit messages *after* we confirm that we processed them internally. Offsets can be committed to Zookeeper or Kafka itself. The first mechanism will soon become deprecated, so putting commits directly in Kafka is a better choice if you're not constrained. We can declare such configuration like this:  

```scala
val consumerProperties = ConsumerProperties(
  brokerList = "...",
  zooKeeperHost = "...",
  topic = "...",
  groupId = "...",
  decoder = new StringDecoder())
.commitInterval(5 seconds) // flush interval
.kafkaOffsetsStorage()
```
If, however, you still need to work with Zookeeper, you should to add an extra library to your dependencies:

````scala
libraryDependencies += "com.softwaremill.reactivekafka" %% "zookeeper-committer" % "0.8.0"
````
You can now obtain a special additional `Sink` where you can stream back messages that you consider 'processed'.    

```scala
  val consumerWithOffsetSink = kafka.consumeWithOffsetSink(consumerProperties)
  Source(consumerWithOffsetSink.publisher)
    .map(processMessage(_)) // your message processing
    .to(consumerWithOffsetSink.offsetCommitSink) // stream back for commit
    .run()
```
Note that messages that you stream back to this Sink will not be committed immediatelly, but flushed periodically, according to the `.commitInterval()` setting used for `ConsumerProperties`.

### Error handling and producer/consumer shutdown
Akka streams are still evolving so better error handling semantics are still about to come (perhaps in 1.1). Currently you can handle errors in following ways:
#### Problems with reading from Kafka
When your consumer fails to read, it will continuously try to re-connect and read from the client. Any connection errors will be logged by the Apache Zookeeper client. To stop a Consumer and clean up resources, we can send a `ActorPublisherMessage.Publish` message to the `KafkaActorPublisher` actor.
#### Problems with writing to Kafka
If there's an `onError()` message signaled from the upstream, the stream cannot be used anymore. The subscriber will close all related Kafka resources and die, which you can capture using Akka's DeathWatch.  
If the problem is caused by a producer throwing exception when writing to Kafka, the exception will be propagated in a typical Akka way, up the supervision hierarchy. If we don't supervise our `KafkaActorSubscriber`, it will simply restart and keep trying to write. If we want to handle exceptions in a custom way, we need to create the subscriber as a child of another actor in order to supervise it. A `KafkaActorSubscriber` can be gracefully closed by sending it an `ActorSubscriberMessage.OnComplete`.

### Java wrappers
The last important feature (released already in 0.7.2) are wrappers that allow us to use Reactive Kafka with Java. Many thanks to [James Morgan](https://github.com/jamesmorgan) and [Mark Harrison](Mark Harrison) for this contribution! We can now run streams in following way:

```java
ReactiveKafka kafka = new ReactiveKafka();
ActorSystem system = ActorSystem.create("ReactiveKafka");
ActorMaterializer materializer = ActorMaterializer.create(system);

ConsumerProperties<Byte[], String> cp =
   new PropertiesBuilder.Consumer(
     brokerList, 
     zooKeeperHost, 
     "topic", 
     "groupId", 
     new StringDecoder(null))
   .build();

Publisher<KeyValueKafkaMessage<Byte[], String>> publisher = kafka.consume(cp, system);

ProducerProperties<String> pp = new PropertiesBuilder.Producer(
                                  brokerList, 
                                  zooKeeperHost, 
                                  "topic", 
                                  new StringEncoder(null))
                                .build();

Subscriber<String> subscriber = kafka.publish(pp, system);

Source
  .from(publisher)
  .map(KeyValueKafkaMessage::msg)
  .to(Sink.create(subscriber))
  .run(materializer);
```

#### Future plans
What can be added in the nearest future? We are specifically looking forward to work on following improvements:  
- Performance tuning for the Kafka manual committer. Currently each committer instance opens its own channel to Kafka. Perhaps channels can be pooled to increase scalability.  
- Better error handling. Akka-streams 1.1 will hopefully bring new ways to recover, but there are still some possibilities to improve our current API and allow better control over failures.  
- Whatever the community needs! New features, ideas and fixes come from open source contributors, so [join us on Gitter](https://gitter.im/softwaremill/reactive-kafka) and share your remarks :)
