
# Mongo

<table>
  <tbody>
    <tr>
      <td><em>Version</em></td>
      <td>server 3.0.1, java driver 2.13.0</td>
    </tr>
    <tr>
      <td><em>Replication</em></td>
      <td>configurable, asynchronous &amp; synchronous</td>
    </tr>
    <tr>
      <td><em>Last tested</em></td>
      <td>10 Apr 2015</td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>Engine</th>
      <th>Threads</th>
      <th>Nodes</th>
      <th>Send msgs/s</th>
      <th>Receive msgs/s</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>mmap</td>
      <td>1</td>
      <td>1</td>
      <td>7 242</td>
      <td>1 601</td>
    </tr>
    <tr>
      <td>mmap</td>
      <td>5</td>
      <td>1</td>
      <td>10 687</td>
      <td><strong>2 761</strong></td>
    </tr>
    <tr>
      <td>mmap</td>
      <td>1</td>
      <td>2</td>
      <td>8 928</td>
      <td>2 426</td>
    </tr>
    <tr>
      <td>mmap</td>
      <td>5</td>
      <td>2</td>
      <td><strong>10 963</strong></td>
      <td>2 673</td>
    </tr>
    <tr>
      <td>wired tiger</td>
      <td>1</td>
      <td>1</td>
      <td>4 409</td>
      <td><strong>1 145</strong></td>
    </tr>
    <tr>
      <td>wired tiger</td>
      <td>5</td>
      <td>1</td>
      <td>5 293</td>
      <td>832</td>
    </tr>
    <tr>
      <td>wired tiger</td>
      <td>1</td>
      <td>2</td>
      <td>3 769</td>
      <td>907</td>
    </tr>
    <tr>
      <td>wired tiger</td>
      <td>5</td>
      <td>2</td>
      <td><strong>5 937</strong></td>
      <td>630</td>
    </tr>
  </tbody>
</table>

If we use synchronous replication (wait for the replica to acknowledge the writes, instead of just one node), the send throughput falls to **8 000 msgs/s**, and the receive to about **2 800 msgs/s**. As before, results when using `wired tiger` are worse than when using `mmap`:

<table>
  <thead>
    <tr>
      <th>Engine</th>
      <th>Threads</th>
      <th>Nodes</th>
      <th>Send msgs/s</th>
      <th>Receive msgs/s</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>mmap</td>
      <td>1</td>
      <td>1</td>
      <td>1 952</td>
      <td>1 630</td>
    </tr>
    <tr>
      <td>mmap</td>
      <td>25</td>
      <td>1</td>
      <td><strong>8 006</strong></td>
      <td><strong>2 819</strong></td>
    </tr>
    <tr>
      <td>mmap</td>
      <td>1</td>
      <td>2</td>
      <td>2 649</td>
      <td>2 463</td>
    </tr>
    <tr>
      <td>mmap</td>
      <td>5</td>
      <td>2</td>
      <td>7 191</td>
      <td>2 618</td>
    </tr>
    <tr>
      <td>wired tiger</td>
      <td>1</td>
      <td>1</td>
      <td>1 531</td>
      <td><strong>1 239</strong></td>
    </tr>
    <tr>
      <td>wired tiger</td>
      <td>5</td>
      <td>1</td>
      <td>2 866</td>
      <td>884</td>
    </tr>
    <tr>
      <td>wired tiger</td>
      <td>25</td>
      <td>1</td>
      <td><strong>3 777</strong></td>
      <td>422</td>
    </tr>
    <tr>
      <td>wired tiger</td>
      <td>1</td>
      <td>2</td>
      <td>2 039</td>
      <td>933</td>
    </tr>
    <tr>
      <td>wired tiger</td>
      <td>5</td>
      <td>2</td>
      <td>3 004</td>
      <td>530</td>
    </tr>
  </tbody>
</table>

Overall in my opinion, not bad for a very straightforward queue implementation on top of Mongo.