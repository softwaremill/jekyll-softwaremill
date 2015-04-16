
# Mongo

| *Version*     | server 3.0.1, java driver 2.13.0 |
| *Replication* | configurable, asynchronous & synchronous |
| *Last tested* | 10 Apr 2015 |

Mongo has two main features which make it possible to easily implement a durable, replicated message queue on top of it: very simple replication setup (we’ll be using a 3-node replica set), and various document-level atomic operations, like `find-and-modify`. The implementation is just a handful of lines of code; take a look at [MongoMq](https://github.com/adamw/mqperf/blob/master/src/main/scala/com/softwaremill/mqperf/mq/MongoMq.scala).

We are also able to control the guarantees which send gives us by using an appropriate write concern when writing new messages:

* `WriteConcern.ACKNOWLEDGED` (previously `SAFE`) ensures that once a send completes, the messages have been written to disk (but the buffers may not be yet flushed, so it’s not a 100% guarantee); this corresponds to asynchronous replication
* `WriteConcern.REPLICA_ACKNOWLEDGED` ensures that a message is written to the majority of the nodes in the cluster; this corresponds to synchronous replication

The main downside of the Mongo-based queue is that:

* messages can’t be received in bulk – the `find-and-modify` operation only works on a single document at a time
* when there’s a lot of connections trying to receive messages, the collection will encounter a lot of contention, and all operations are serialised.

And this shows in the results: sends are faster then receives. But overall the performance is quite good!

As Mongo recently got a major update (to version 3), it is also very interesting to compare the old storage engine (`mmap`) and new (`wired tiger`), which promised document-level locking, efficient disk space usage and improved performance. So we have two additional test variables: storage engine and synchronous/asynchronous replication.

A single-thread, single-node, asynchronous replication, `mmap` setup achieves **7 250 msgs/s** sent and **1 600 msgs/s** received. The maximum send throughput with multiple thread/nodes that I was able to achieve is about 10 900 msgs/s, while the maximum receive rate is **2 760 msgs/s**.

Interestingly, when using `wired tiger`, the performance is worse, at least by a factor of 2! It seems that in that usage pattern (short-lived documents, high volume of `find-and-modify` operations) the new storage engine doesn’t work that well. Furthermore, receive performance decreases with the number of threads. The more concurrency, the lower overall throughput. 

Results in detail when using asynchronous replication:

| Engine      | Threads | Nodes | Send msgs/s | Receive msgs/s |
| ------------------------------------------------------------ |
| mmap        | 1       | 1     | 7 242       | 1 601          |
| mmap        | 5       | 1     | 10 687      | **2 761**      |
| mmap        | 1       | 2     | 8 928       | 2 426          |
| mmap        | 5       | 2     | **10 963**  | 2 673          |
| wired tiger | 1       | 1     | 4 409       | **1 145**      |
| wired tiger | 5       | 1     | 5 293       |   832          |
| wired tiger | 1       | 2     | 3 769       |   907          |
| wired tiger | 5       | 2     | **5 937**   |   630          |

If we use synchronous replication (wait for the replica to acknowledge the writes, instead of just one node), the send throughput falls to **8 000 msgs/s**, and the receive to about **2 800 msgs/s**. As before, results when using `wired tiger` are worse than when using `mmap`:

| Engine      | Threads | Nodes | Send msgs/s | Receive msgs/s |
| ------------------------------------------------------------ |
| mmap        | 1       | 1     | 1 952       | 1 630          |
| mmap        | 25      | 1     | **8 006**   | **2 819**      |
| mmap        | 1       | 2     | 2 649       | 2 463          |
| mmap        | 5       | 2     | 7 191       | 2 618          |
| wired tiger | 1       | 1     | 1 531       | **1 239**      |
| wired tiger | 5       | 1     | 2 866       |   884          |
| wired tiger | 25      | 1     | **3 777**   |   422          |
| wired tiger | 1       | 2     | 2 039       |   933          |
| wired tiger | 5       | 2     | 3 004       |   530          |

Overall in my opinion, not bad for a very straightforward queue implementation on top of Mongo.