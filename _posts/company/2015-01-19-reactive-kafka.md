---
title: Reactive Streams for Apache Kafka
description: SoftwareMill presents a simple library for accessing Apache Kafka as Reactive Streams.
author: Krzysztof Ciesielski
author_login: ciesielski
categories:
- scala
- reactive
- company
layout: simple_post
---

A lot happened around the reactive movement last year but it’s still gaining its momentum. The same applies for the world of distributed systems which is also growing really fast. Let’s see what we can build on the intersection of these two subjects.  
First: reactive streams - a fresh approach to process composable streams of data. Some already well-known patterns like queues can be now revisited with the reactive approach. Be sure to check [Adam’s blog](http://www.warski.org/blog/2014/06/reactive-queue-with-akka-reactive-streams/) on how to build a custom reactive queue with Akka Streams.  
Then there’s [Apache Kafka](https://kafka.apache.org/documentation.html#gettingStarted) - a pub-sub infrastructure written in Scala. It’s aiming for distributed systems with its advanced clustering capabilities. It also provides mechanisms for accessing queues/topics on any offset. It would be nice to access Kafka with reactive API and that’s how [reactive-kafka](https://github.com/kciesielski/reactive-kafka) was born. Let’s jump straight to some code to see how it can be used:  
```scala
import akka.actor.ActorSystem
import akka.stream.FlowMaterializer
import akka.stream.scaladsl.{Sink, Source}
import com.softwaremill.react.kafka.ReactiveKafka

implicit val materializer = FlowMaterializer()
implicit val actorSystem = ActorSystem("ReactiveKafka")

val kafka = new ReactiveKafka(host = "localhost:9092", zooKeeperHost = "localhost:2181")

val publisher = kafka.consume("jobCandidates", "groupName")
val subscriber = kafka.publish("hrNotifications", "groupName")

Source(publisher).map(extractCandidateName).to(Sink(subscriber)).run()
```
Such flow would listen on a topic with incoming job applications, extract candidate names and send them to a new channel (topic), dedicated for notifications in the HR department.
If you’ve been working with Scala before, It may look pretty familiar to stream processing. Indeed, reactive streams aim to offer a similar, declarative and functional syntax. However, pretty syntax is just a nice addition.  
  
**Reactive streams**  
The main premise of this initiative is to provide stream processing tools which are asynchronous and support non-blocking back-pressure.
The full specification is a set of interfaces and [rules](https://github.com/reactive-streams/reactive-streams/blob/v1.0.0.M3/README.md#specification) which have to be fulfilled by any implementation. We will use [Akka Streams](http://doc.akka.io/docs/akka-stream-and-http-experimental/1.0-M2/scala.html), which allows creating objects that follow these interfaces and rules around own Kafka processing code.  

**The combination**  
The scala-kafka client library provides simple abstractions to work with Kafka topics:  
  
*Producer* -  a writer which will be requested to push a new message to a Kafka topic.  
*Consumer* - a listener bound to a topic. It can be requested to fetch next available message and pass it to a given callback.  
  
Reactive-kafka uses Akka Streams to wrap these two with standard interfaces for reactive streams processing, so now we work with:  
  
*Publisher* - a source of messages coming out of a Kafka topic. Subscribers can subscribe to it.  
*Subscriber* - a listener which can be subscribed to any Publisher. Writes messages to a given Kafka topic each time it receives a message.   
  
Using these standard interfaces from the org.reactivestreams package, we can combine many kinds of reactive streams into one flow. We can now rebuild our first example and change the source stream, so that we produce Strings and feed them into our destination Kafka topic:  
```scala
import akka.actor.ActorSystem
import akka.stream.FlowMaterializer
import akka.stream.scaladsl.{Sink, Source}
import com.softwaremill.react.kafka.ReactiveKafka

implicit val materializer = FlowMaterializer()
implicit val actorSystem = ActorSystem("ReactiveKafka")

val kafka = new ReactiveKafka(host = "localhost:9092", zooKeeperHost = "localhost:2181")

val candidatesFromFile =
  """|John Doe,31,java,$150;
    |Bob Smith,27,java,$200;
    |Paul Muller,28,scala,$220""".stripMargin

val publisher = () => candidatesFromFile.split(";").iterator
val subscriber = kafka.publish("hrNotifications", "groupName")

Source(publisher).map(extractCandidateName).to(Sink(subscriber)).run()
```

As we can see, the API operates on a high level of abstraction, without exposing infrastructure details. The publisher has changed, but without impact on the flow. With our library, you can now seamlessly add Kafka topics as streams to your flows.  

**Approaching blocking features**  
As Kafka’s interface is not really reactive in it’s nature, we have to work around the some blocking code. The direct ‘pull’ call on Kafka’s stream is executed within an actor, so we need to make sure that such blocking call won’t put any overhead on ActorSystem’s ExecutionContext. Similarly with synchronous action of putting messages in the topic.
To overcome this, a custom dispatcher has been added. Reactive-kafka comes with a reference.conf file where you can see how to override thread pool executor settings. If you need to tune the thread pool sizes and related parameters, override those dispatcher settings.

**Future development**  
Kafka is not only about the publisher-subscriber pattern. It offers a lot of flexibility due to the notion of offset. It is the position of the consumer in the log. Being able to control it, a consumer can read from any point of the topic. This opens many interesting possibilities (for example a way to achieve at-least-once delivery). Digging deeper into offsets will be probably the subject of next features.  

You can find project sources on [GitHub](https://github.com/kciesielski/reactive-kafka).
