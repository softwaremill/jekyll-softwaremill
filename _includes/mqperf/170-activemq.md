
# ActiveMQ

<table>
  <tbody>
    <tr>
      <td><em>Version</em></td>
      <td>5.11.1</td>
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

[ActiveMQ](http://activemq.apache.org) is one of the most popular message brokers. In many cases it’s "the" messaging server when using JMS. However, it gained replication features only recently. Until version 5.9.0, it was possible to have a [master-slave setup](http://activemq.apache.org/masterslave.html) using a shared file system (e.g. SAN) or a shared database; these solutions require either specialised hardware, or are constrained by a relational database (which would have to be clustered separately).

However, it is now possible to use the [Replicated LevelDB](http://activemq.apache.org/replicated-leveldb-store.html) storage, which uses [Zookeeper](https://zookeeper.apache.org) for cluster coordination (like Kafka).

Replication can be both synchronous and asynchronous; in fact, there’s a lot of flexibility. By setting the `sync` configuration option of the storage, we can control how many nodes have to receive the message and whether it should be written to disk or not before considering a request complete:

* `quorum_mem` corresponds to synchronous replication, where a message has to be received by a majority of servers and stored in memory
* `quorum_disk` is even stronger, requires the message to be written to disk
* `local_mem` is asynchronous replication, where a message has to be stored in memory only. Even if disk buffers are flushed, this doesn’t guarantee message delivery in case of a server restart
* `local_disk` is asynchronous replication where a message has to be written to disk on one server 

In the tests we’ll be mainly using `quorum_mem`, with a cluster of 3 nodes. As we require a quorum of nodes, this setup should be partition tolerant, however there’s no documentation on how partitions are handled and how ActiveMQ behaves in such situations.

The [ActiveMq](https://github.com/adamw/mqperf/blob/master/src/main/scala/com/softwaremill/mqperf/mq/ActiveMq.scala) implementation uses standard JMS calls using the OpenWire protocol to connect to the ActiveMQ server. For sends, we create a producer with delivery mode set to `PERSISTENT`, and for receives we create a consumer with `CLIENT_ACKNOWLEDGE`, as we manually acknowledge message delivery.

Performance-wise, ActiveMQ does better than RabbitMQ, achieving at most **3 900 msgs/s** with synchronous replication, and **5 450 msgs/s** with asynchronous replication. This seems to be the maximum and is achieved with 1 node and 25 threads: 

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
      <td>657</td>
      <td>657</td>
    </tr>
    <tr>
      <td>1</td>
      <td>5</td>
      <td>1 863</td>
      <td>1 863</td>
    </tr>
    <tr>
      <td>1</td>
      <td>25</td>
      <td>3 907</td>
      <td>3 891</td>
    </tr>
  </tbody>
</table>

Adding more nodes doesn’t improve the results, in fact, they are slightly worse. Interestingly, using the stronger `quorum_disk` guarantee has no big effect on performance, the broker tops out at **3 600 msgs/s**:

<table>
  <thead>
    <tr>
      <th>Nodes</th>
      <th>Threads</th>
      <th>Send msgs/s</th>
      <th>Receive msgs/s</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>25</td>
      <td><strong>3 907</strong></td>
      <td><strong>3 891</strong></td>
      <td>quorum_mem</td>
    </tr>
    <tr>
      <td>2</td>
      <td>25</td>
      <td>3 482</td>
      <td>3 383</td>
      <td>quorum_mem</td>
    </tr>
    <tr>
      <td>4</td>
      <td>25</td>
      <td>3 778</td>
      <td>3 726</td>
      <td>quorum_mem</td>
    </tr>
    <tr>
      <td>4</td>
      <td>5</td>
      <td>3 688</td>
      <td>3 648</td>
      <td>quorum_disk</td>
    </tr>
    <tr>
      <td>4</td>
      <td>5</td>
      <td>6 951</td>
      <td>6 875</td>
      <td>local_mem</td>
    </tr>
    <tr>
      <td>4</td>
      <td>5</td>
      <td>5 455</td>
      <td>5 424</td>
      <td>local_disk</td>
    </tr>
  </tbody>
</table>

![ActiveMQ](/img/mqperf/activemq1.png)

