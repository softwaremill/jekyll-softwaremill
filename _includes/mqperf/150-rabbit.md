
# RabbitMQ

| *Version*     | 3.5.0-1, java amqp client 3.5.0 |
| *Replication* | synchronous |
| *Last tested* | 10 Apr 2015 |

RabbitMQ is one of the leading open-source messaging systems. It is written in Erlang, implements [AMQP](http://www.amqp.org/) and is a very popular choice when messaging is involved. It supports both message persistence and replication, with well documented behaviour in case of e.g. [partitions](http://www.rabbitmq.com/clustering.html).

We’ll be testing a 3-node Rabbit cluster. To be sure that sends complete successfully, we’ll be using [publisher confirms](http://www.rabbitmq.com/confirms.html), a Rabbit extension to AMQP, instead of transactions:

> "Using standard AMQP 0-9-1, the only way to guarantee that a message isn't lost is by using transactions -- make the channel transactional, publish the message, commit. In this case, transactions are unnecessarily heavyweight and decrease throughput by a factor of 250. To remedy this, a confirmation mechanism was introduced."

The confirmations are cluster-wide, so this gives us pretty strong guarantees: that messages will be both written to disk, and replicated to the cluster (see the [docs](http://www.rabbitmq.com/ha.html)):

> "When will messages be confirmed?
For routable messages, the basic.ack is sent when a message has been accepted by all the queues. For persistent messages routed to durable queues, this means persisting to disk. For mirrored queues, this means that all mirrors have accepted the message."

Such strong guarantees are probably one of the reasons for mediocre performance. A single-thread, single-node gives us **1000 msgs/s** sent&received: 

| Nodes | Threads  | Send msgs/s | Receive msgs/s |
| ----------------------------------------------- |
| 1     | 1        | 1 025       | 1 029          |
| 1     | 5        | 2 527       | 2 509          |
| 1     | 25       | 3 488       | 3 488          |

This scales nicely as we add threads/nodes, up to **3 600 msgs/s**, which seems to be the maximum that Rabbit can achieve:

![RabbitMQ](/img/mqperf/rabbit1.png)

The [RabbitMq](https://github.com/adamw/mqperf/blob/master/src/main/scala/com/softwaremill/mqperf/mq/RabbitMq.scala) implementation of the Mq interface is again pretty straightforward. We are using the mentioned publisher confirms, and setting the quality-of-service when receiving so that at most 100 messages are delivered unconfirmed.

Interestingly, sending the messages in larger batches doesn’t affect overall throughput, it stays at around **3 500 msgs/s**, falling down to **2 900 msgs/s**when we batch up to 1000 messages.

| Nodes | Threads  | Send msgs/s | Receive msgs/s | Notes          |
| ---------------------------------------------------------------- |
| 1     | 25       | 3 488       | 3 488          | max batch 10   |
| 2     | 25       | **3 663**   | **3 628**      | max batch 10   |
| 4     | 25       | 3 551       | 3 528          | max batch 10   |
| 4     | 5        | 3 610       | 3 587          | max batch 100  |
| 4     | 5        | 2 897       | 2 695          | max batch 1000 |

Another side-note: RabbitMQ has a great web-based console, available with almost no setup.