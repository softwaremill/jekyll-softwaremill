
# Kafka

<table>
  <tbody>
    <tr>
      <td><em>Version</em></td>
      <td>0.8.2.1</td>
    </tr>
    <tr>
      <td><em>Replication</em></td>
      <td>configurable, asynchronous &amp; synchronous</td>
    </tr>
    <tr>
      <td><em>Last tested</em></td>
      <td>4 May 2015</td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>Nodes</th>
      <th>Threads</th>
      <th>Send msgs/s</th>
      <th>Receive msgs/s</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>1</td>
      <td>2 582</td>
      <td>2 586</td>
    </tr>
    <tr>
      <td>1</td>
      <td>5</td>
      <td>10 943</td>
      <td>9 503</td>
    </tr>
    <tr>
      <td>1</td>
      <td>25</td>
      <td>24 113</td>
      <td>21 733</td>
    </tr>
    <tr>
      <td>2</td>
      <td>1</td>
      <td>4 799</td>
      <td>4 573</td>
    </tr>
    <tr>
      <td>2</td>
      <td>5</td>
      <td>13 516</td>
      <td>11 691</td>
    </tr>
    <tr>
      <td>2</td>
      <td>25</td>
      <td>26 892</td>
      <td>24 310</td>
    </tr>
    <tr>
      <td>4</td>
      <td>1</td>
      <td>8 103</td>
      <td>7 222</td>
    </tr>
    <tr>
      <td>4</td>
      <td>5</td>
      <td>17 950</td>
      <td>15 969</td>
    </tr>
    <tr>
      <td>4</td>
      <td>25</td>
      <td><strong>31 859</strong></td>
      <td><strong>28 205</strong></td>
    </tr>
  </tbody>
</table>

When using synchronous replication, the numbers fall down to **1&nbsp;000 msgs/s** and **11&nbsp;000 msgs/s** respectively. Which makes sense - with synchronous replication there are 3 network hops, instead of 1, so we have a 3x slow-down:

<table>
  <thead>
    <tr>
      <th>Nodes</th>
      <th>Threads</th>
      <th>Send msgs/s</th>
      <th>Receive msgs/s</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>1</td>
      <td>1 179</td>
      <td>1 079</td>
    </tr>
    <tr>
      <td>1</td>
      <td>5</td>
      <td>3 470</td>
      <td>3 427</td>
    </tr>
    <tr>
      <td>1</td>
      <td>25</td>
      <td>9 321</td>
      <td>9 113</td>
    </tr>
    <tr>
      <td>2</td>
      <td>1</td>
      <td>1 793</td>
      <td>1 768</td>
    </tr>
    <tr>
      <td>2</td>
      <td>5</td>
      <td>4 706</td>
      <td>4 571</td>
    </tr>
    <tr>
      <td>2</td>
      <td>25</td>
      <td>10 645</td>
      <td>10 267</td>
    </tr>
    <tr>
      <td>4</td>
      <td>1</td>
      <td>2 905</td>
      <td>2 851</td>
    </tr>
    <tr>
      <td>4</td>
      <td>5</td>
      <td>6 520</td>
      <td>6 327</td>
    </tr>
    <tr>
      <td>4</td>
      <td>25</td>
      <td><strong>11 308</strong></td>
      <td><strong>10 951</strong></td>
    </tr>
  </tbody>
</table>

Kafka has a big scalability potential, by adding nodes and increasing the number of partitions; however how it scales exactly is another topic, and would have to be tested.
