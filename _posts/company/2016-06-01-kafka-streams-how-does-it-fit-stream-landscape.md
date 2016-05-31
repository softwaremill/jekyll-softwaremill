---
title: Kafka Streams - how does it fit the stream processing landscape?
description: The recently released Kafka Streams offers some interesting aggregation, joining, stateful operations and windowing capabilities. Where can it be useful, comparing to other streaming libraries and frameworks?
author: Adam Warski
author_login: warski
categories:
- kafka
- reactive
- bigdata
- spark
- flink
layout: simple_post
---

[Apache Kafka](http://kafka.apache.org) development recently increased pace, and we now have [Kafka 0.10.0.0 at our disposal](http://www.confluent.io/blog/announcing-apache-kafka-0.10-and-confluent-platform-3.0). One of the main features of the release is Kafka Streams, a **library** for transforming and combining data streams which live in Kafka. The streaming space is quickly becoming crowded, so how is Kafka Streams different and where does it fit in the stream-processing developers toolbox? When can you consider using Kafka Streams over [Apache Fink](http://flink.apache.org), [Spark Streaming](http://spark.apache.org) or [Reactive Kafka](https://github.com/akka/reactive-kafka)? (Which is our own Kafka <-> Reactive Streams connector).

Let’s take a look at the characteristic of the library, which make it stand out from its competitors. It’s not going to be a comprehensive guide in any way (for that, there’s quite extensive [documentation](http://docs.confluent.io/3.0.0/streams) from Confluent), but rather a short overview.

# Kafka-centric

First of all, that’s probably not surprising (the name kind of reveals that), but Kafka Streams is designed to consumer from & produce data to Kafka topics. That’s both an advantage - such specialisation opens new opportunities for the API, and a restriction - other streaming libraries are much more general.

It is of course possible to ingest data from different data sources, or write to different data sources - but for that, you need to go to through a Kafka topic as well, and use e.g. [Kafka Connect](http://docs.confluent.io/3.0.0/connect/index.html) to get the data in/out.

# Back-pressure/buffering

There are no back-pressure mechanisms built into the library. A topology (a topology consists of multiple source topics, a number of data processors connected by stream operations and multiple sink topics) handles *one element at a time*. Buffering “to be processed” elements is delegated to the pull-based Kafka consumer (the same one which you normally use to read data from Kafka), and batching writes is delegated to the Kafka producer.

This greatly simplifies the design, but has one important consequence: there’s no support for asynchronous operations, and quite obviously, you shouldn’t do any blocking operations in your data processors as this will block the whole stream.

# Data abstractions: streams and tables

Kafka Streams defined two basic abstractions: `KStream` and `KTable`. The distinction comes from how the key-value pairs are interpreted. In a stream, each key-value is an independent piece of information. For example, in a stream of user purchases: `alice -> butter`, `bob -> bread`, `alice -> cheese`, we know that Alice bought both butter and cheese.

A table, on the other hand, is a *changelog*. If the table contains a key-value pair for the same key twice, the latter overwrites the mapping. For example, a table of user addresses with `alice -> new york`, `bob -> san francisco`, `alice -> chicago` means that Alice moved from New York to Chicago, not that she lives at both places in the same time.

There’s a duality between the two concepts, as explained in the [documentation](http://docs.confluent.io/3.0.0/streams/concepts.html#duality-of-streams-and-tables), so a stream can be viewed as a table, and a table as a stream. However, having these two concepts reified as distinct abstractions makes it much more clear when working with data. I don’t think the stream/table separation is common in other streaming libraries/frameworks.

# Running streaming applications

Kafka Streams is a library, which means that how you run and distribute the code across the cluster is left to you. There’s no resource manager, no master/worker nodes etc. So how can you process data from Kafka topic(s) in a distributed way? Using the same mechanism as consuming data from Kafka on multiple worker nodes: when creating your stream, you specify an “application id” (similar to consumer group id). When a new node using a given application id registers in the Kafka broker, the topic partitions assigned to each node are re-balanced and each node receives a set of tasks (partitions+topology) to execute.

It’s definitely good that Kafka chose to go this way, instead of introducing yet another way of running your applications, and providing some kind of distributed processing framework.

# Stateful stream processors

An important feature of Kafka’s Streams are stateful stream processors. You have the possibility to attach a local per-task store (a task is a combination of a set of topic’s partitions and a topology). The store can be either in-memory or use [RocksDB](http://rocksdb.org). Even though these stores are local (hence, giving fast access times), they are backed by a Kafka topic, which contains the changelog for each such store; hence, in case of a re-balancing of tasks, such store can be re-created on any other node. In that sense, the store is distributed and fault-tolerant (via the usual Kafka mechanisms).

These local stores are very useful for all kinds of local stateful operations, such as aggregations and joins.

I’m not aware of other streaming systems offering such capabilities out-of-the-box. I think the design here offers a lot of possibilities. You need to keep in mind, however, that the store is *local*, and contains information only for a single task (which handles onlt a subset of the input data). Hence this mechanism won’t be useful for global aggregations.

# Available operations

A standard set of stream operations is available, such as `map` and `filter`, both on element keys & values. It is also possible to map a single element to multiple elements using `flatMap` - however here we can only map to an `Iterable`, not a `KStream`, so it’s not a “real” flat map; however as the assumption is that most streams are infinite, flat mapping to a stream wouldn’t make sense anyway.

It is possible to write the results to a Kafka topic (`to`), or wite & continue processing (`through`).

We can also `transform`/`process` elements using a custom processor, which can be stateful. This operation is useful for custom, hand-written aggregations.

However, the most interesting operations are joins & aggregations. It is possible to inner/outer/left join two `KStream`s, a `KStream` to a `KTable` or two `KTables`. For example, left-joining a user-purchases stream to a user-address table, it is possible to enrich each purchase element with the address of the buyer, flip the key-value pairs and compute aggregate data on in which city butter is most popular. This particular type of join works by storing the current (local) `KTable` state in the local store, and looking up a value for each incoming stream element. Another join type is for two `KStreams`; it is then mandatory to specify a time window, in which elements from both elements will be matched. For the joins to work, both streams must use same types of keys, as the joins always match on the key values.

As for aggregations, we can `count`, `reduceByKey`, obtaining a table with incremental reductions for each key. Here also the local store is used, to store the current reduction for each key. This is a specialized version of `aggregateByKey`, where you can specify arbitrary value aggregations. It is also possible to do time-windowed aggregations, arbitrarily specifying the window step & length (giving overlapping or disjoint windows)

# Time

Finally, how Kafka Streams handles time is also worth mentioning. It is possible to use different timestamps for windowing operations: event time (defined by whatever creates the event), ingestion time (when the event is stored into Kafka), and processing time (when the event is processed). When aggregating elements in time windows, it is possible to use any of these timestamps (by using a custom or one of the built-in `TimestampExtractor`s).

When using even-time, there’s a possibility of some of the records arriving out-of-order. That’s supported as well: when windowing, there’s a defined retention period, for which a window is stored in the local store (by default 1 day). If the out-of-order event arrives before that, a new window update will be emitted (windowing operations result in a `KTable` - a changelog - so each new entry for a given key should be interpreted as updating the previous value).

This flexibility in time handling can certainly be very useful for streaming operations.

# When to use Kafka Streams?

Summing up, Kafka Streams offers a very interesting feature set for transforming & combining data living in Kafka topics. Especially the above mentioned stateful processors, windowing, joining, aggregation operations seem powerful and can be very useful. Also, as this is a library, not a framework, it’s easy to use Kafka Streams in any existing Kafka setup, as it uses the same core primitives (producers, consumers and consumer groups).

However, it is a rather focused library, and it’s very well suited for certain types of tasks; that’s also why some of its design can be so optimized for how Kafka works. If you need to do a simple Kafka topic-to-topic transformation, count elements by key, enrich a stream with data from another topic, or run an aggregation: Kafka Streams is for you.

But there’s of course a huge field of use-cases where other streaming libraries excell. If, for example, you need asynchronous event processing, integrate with various data sources/sinks, send/receive data over the network or to combine multiple streams (where only one of them is Kafka-based) in a back-pressure aware way, then take a look at [Reactive Kafka](https://github.com/akka/reactive-kafka). If you are looking for ML, SQL interfaces, graph processing or a complete stream processing framework, take a look at [Spark](http://spark.apache.org) or [Flink](http://flink.apache.org).

I can easily imagine a system where both Kafka Streams, Reactive Kafka and Spark is used, all playing a different role in the overall data-processing pipeline. With Kafka Streams we gain yet another building block to make our developer life a bit easier.
