
# Kafka

| *Version*     | 0.8.2.1 |
| *Replication* | configurable, asynchronous & synchronous |
| *Last tested* | 10 Apr 2015 |

Kafka takes a different approach to messaging. The server itself is a streaming publish-subscribe system. Each Kafka topic can have multiple partitions; by using more partitions, the consumers of the messages (and the throughput) may be scaled and concurrency of processing increased.

On top of publish-subscribe with partitions, a point-to-point messaging system is built, by putting a significant amount of logic into the consumers (in the other messaging systems we’ve looked at, it was the server that contained most of the message-consumed-by-one-consumer logic; here it’s the consumer).

Each consumer in a consumer group reads messages from a number of dedicated partitions; hence it doesn’t make sense to have more consumer threads than partitions. Messages aren’t acknowledged on server (which is a very important design difference!), but instead message offsets processed by consumers are written to Zookeeper, either automatically in the background, or manually. This allows Kafka to achieve much better performance.

Such a design has a couple of consequences:

* messages from each partition are processed in-order. A custom partition-routing strategy can be defined
* all consumers should consume messages at the same speed. Messages from a slow consumer won’t be "taken over" by a fast consumer
* messages are acknowledged “up to” an offset. That is messages can’t be selectively acknowledged.
* no "advanced" messaging options are available, such as routing, delaying messages, re-delivering messages, etc.

You can read more about the design of the consumer in [Kafka’s docs](http://kafka.apache.org/documentation.html#theconsumer).

To achieve guaranteed sends and at-least-once delivery, I used the following configuration (see the [KafkaMq class](https://github.com/adamw/mqperf/blob/master/src/main/scala/com/softwaremill/mqperf/mq/KafkaMq.scala)):

* topic is created with a `replication-factor` of `3`
* for the sender, the `request.required.acks` option is set to `1` (asynchronous replication - a send request blocks until it is accepted by the partition leader) or `-1` (synchronous replication; in conjunction with `min.insync.replicas` topic config set to `2` a send request blocks until it is accepted by at least 2 replicas - a quorum when we have 3 nodes in total) 
* consumer offsets are committed every 10 seconds manually; during that time, message receiving is blocked (a read-write locked is used to assure that). That way we can achieve at-least-once delivery (only committing when messages have been "observed").

Now, to the results. Kafka’s performance is great. With asynchronous replication, a single-node single-thread achieves about **2&nbsp;550 msgs/s**, and the best result was **30&nbsp;000 msgs/s** with 25 sending&receiving threads and 4 nodes:

| Nodes | Threads  | Send msgs/s | Receive msgs/s | 
| ----------------------------------------------- |
| 1     | 1        | 2 582       | 2 586          | 
| 1     | 5        | 10 943      | 9 503          | 
| 1     | 25       | 24 113      | 21 733         | 
| 2     | 1        | 4 799       | 4 573          | 
| 2     | 5        | 13 516      | 11 691         | 
| 2     | 25       | 26 892      | 24 310         | 
| 4     | 1        | 8 103       | 7 222          | 
| 4     | 5        | 17 950      | 15 969         | 
| 4     | 25       | **31 859**  | **28 205**     | 

When using synchronous replication, the numbers fall down to **1&nbsp;000 msgs/s** and **11&nbsp;000 msgs/s** respectively. Which makes sense - with synchronous replication there are 3 network hops, instead of 1, so we have a 3x slow-down:

| Nodes | Threads  | Send msgs/s | Receive msgs/s | 
| ----------------------------------------------- |
| 1     | 1        | 1 179       | 1 079          | 
| 1     | 5        | 3 470       | 3 427          | 
| 1     | 25       | 9 321       | 9 113          | 
| 2     | 1        | 1 793       | 1 768          | 
| 2     | 5        | 4 706       | 4 571          | 
| 2     | 25       | 10 645      | 10 267         | 
| 4     | 1        | 2 905       | 2 851          | 
| 4     | 5        | 6 520       | 6 327          | 
| 4     | 25       | **11 308**  | **10 951**     | 

Kafka has a big scalability potential, by adding nodes and increasing the number of partitions; however how it scales exactly is another topic, and would have to be tested.
