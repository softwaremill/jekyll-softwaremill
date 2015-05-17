
# HornetQ

<table>
  <tbody>
    <tr>
      <td><em>Version</em></td>
      <td>2.4.0, java driver 2.4.5</td>
    </tr>
    <tr>
      <td><em>Replication</em></td>
      <td>synchronous</td>
    </tr>
    <tr>
      <td><em>Last tested</em></td>
      <td>1 Jul 2014</td>
    </tr>
  </tbody>
</table>

HornetQ, written by JBoss and part of the JBossAS (implements JMS) is a strong contender. Since some time it supports over-the-network replication using [live-backup pairs](http://docs.jboss.org/hornetq/2.4.0.Final/docs/user-manual/html_single/index.html#d0e11342). I tried setting up a 3-node cluster, but it seems that data is replicated only to one node. Hence here we will be using a two-node cluster.

This raises a question on how partitions are handled; if a node dies, the fact is detected automatically, but then we can end up with two live servers (unless we have more nodes in the cluster), and that rises the question what happens with the data on both primaries when the connection is re-established. Overall, the replication support and documentation is worse than for Mongo and Rabbit.

Although it is not clearly stated in the documentation (see [send guarantees](http://docs.jboss.org/hornetq/2.4.0.Final/docs/user-manual/html_single/index.html#send-guarantees)), replication is synchronous, hence when the transaction commits, we can be sure that messages are written to journals on both nodes. That is similar to Rabbit, and corresponds to Mongo’s replica-safe write concern.

The [HornetMq](https://github.com/adamw/mqperf/blob/master/src/main/scala/com/softwaremill/mqperf/mq/HornetMq.scala) implementation uses the core Hornet API. For sends, we are using transactions, for receives we rely on the internal receive buffers and turn off blocking confirmations (making them asynchronous). Interestingly, we can only receive one message at a time before acknowledging it, otherwise we get exceptions on the server. But this doesn’t seem to impact performance.

Speaking of performance, it is very good! A single-node, single-thread setup achieves **1 100 msgs/s**. With 25 threads, we are up to **12 800 msgs/s**! And finally, with 25 threads and 4 nodes, we can achieve **17 000 msgs/s**.

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
      <td>1 108</td>
      <td>1 106</td>
    </tr>
    <tr>
      <td>1</td>
      <td>5</td>
      <td>4 333</td>
      <td>4 318</td>
    </tr>
    <tr>
      <td>1</td>
      <td>25</td>
      <td>12 791</td>
      <td>12 802</td>
    </tr>
    <tr>
      <td>2</td>
      <td>1</td>
      <td>2 095</td>
      <td>2 029</td>
    </tr>
    <tr>
      <td>2</td>
      <td>5</td>
      <td>7 855</td>
      <td>7 759</td>
    </tr>
    <tr>
      <td>2</td>
      <td>25</td>
      <td>14 200</td>
      <td>13 761</td>
    </tr>
    <tr>
      <td>4</td>
      <td>1</td>
      <td>3 768</td>
      <td>3 627</td>
    </tr>
    <tr>
      <td>4</td>
      <td>5</td>
      <td>11 572</td>
      <td>10 708</td>
    </tr>
    <tr>
      <td>4</td>
      <td>25</td>
      <td><strong>17 402</strong></td>
      <td><strong>17 160</strong></td>
    </tr>
  </tbody>
</table>

One final note: when trying to send messages using 25 threads in bulks of up to 1000, I once got into a situation where the backup considered the primary dead even though it was working, and another time when the sending failed because the “address was blocked” (in other words, queue was full and couldn’t fit in memory), even though the receivers worked all the time. Maybe that’s due to GC? Or just the very high load?
