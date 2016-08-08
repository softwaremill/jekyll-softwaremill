---
title: Kafka Connect - Import Export for Apache Kafka
description: Evaluating Kafka Connectors to import data into Kafka and export data to various targets
author: Jarosław Kijanowski
author_login: kijanowski
categories:
- Confluent
- Kafka Connect
- kafka
- bigdata
layout: simple_post
---

Usually when I invite [Apache Kafka](http://kafka.apache.org/) to a project I end up with writing my own wrappers around Kafka’s Producers and Consumers. They are responsible for putting data into topics and reading data. And for each kind of source, is it file, jdbc, jms, I have to repeat some of the work.

What would you say, if there would be a way to just provide some configuration details about the source or target and also the way you want to format the data and “everything else” is done for you? By everything else I mean:

* data conversion / serialization

* parallelism / scaling

* load balancing

* fault tolerance

## Kafka Connect
It is an open source import and export framework shipped with the [Confluent Platform](http://www.confluent.io). There are a couple of supported connectors built upon Kafka Connect, which also are part of the Confluent Platform. Below you will find examples of using the File Connector and JDBC Connector. Besides that, the community also offers connectors, which of I'd like to present the Cassandra Connector by [datamountaineer](https://github.com/datamountaineer/stream-reactor/tree/master/kafka-connect-cassandra).
Here’s a [rather incomplete list of available connectors](http://www.confluent.io/product/connectors).

To run the examples, the Confluent Platform is needed. It can be downloaded from http://www.confluent.io/download. The price is your email address.


## File Connector
Let's take it easy with the first example. The goal is to read data from a file and import it into Kafka. Then we want to export that data and save to another file.

We start with the **Source Connector**, which will read lines from a file and put them into a Kafka topic.

There are two files we need to take a look at.

A [worker specific file](http://docs.confluent.io/3.0.0/connect/userguide.html#configuring-workers), which specifies, where to persist offsets and what kind of formatter to use:

`./etc/kafka/connect-standalone.properties`

A [connector specific file](http://docs.confluent.io/3.0.0/connect/userguide.html#configuring-connectors), which specifies the file to be tailed for new records and what topic data is written to:

`./etc/kafka/connect-file-source.properties`

The interesting properties here are:

`connector.class` - it's the Java class that implements the connector

`tasks.max` - this is the maximum number of tasks, that should be created for this connector

The number of tasks is a way to control parallelism. However in case of the File Connector, we have to set it to 1, since we cannot read a file in parallel.

Now it's time for the **Sink Connector**, which will read records from Kafka and append them to a file.

The connector specific file tells which topic to consume from and which file to write to:

`./etc/kafka/connect-file-sink.properties`

We're good to go. Start Zookeeper, Kafka and the two connectors (Source and Sink):

```
$ ./bin/zookeeper-server-start ./etc/kafka/zookeeper.properties
$ ./bin/kafka-server-start ./etc/kafka/server.properties
$ ./bin/connect-standalone etc/kafka/connect-standalone.properties etc/kafka/connect-file-source.properties etc/kafka/connect-file-sink.properties
```

Add some lines to the file and watch the magic happen:

```
$ echo -e "test 1\ntest 2" > test.txt
```

```
$ cat test.sink.txt
test 1
test 2
```

When examining the topic with the console consumer, you will see the output in json format, since that is the converter we've chosen in the worker config properties file:

```
$ ./bin/kafka-console-consumer --from-beginning --zookeeper 127.0.0.1:2181 --topic connect-test
{"schema":{"type":"string","optional":false},"payload":"test 1"}
{"schema":{"type":"string","optional":false},"payload":"test 2"}

```

Obviously it is possible to read from multiple files simultaneously by running multiple Source Connectors and "merge" the data into one topic. Just assure to have a unique name attribute in the Connectors' config files.

The key take away here is, that we haven't written any Producer nor Consumer code to load data into Kafka from a file and to load data off from Kafka to a file.

One thing to note is that when you restart the Source Connector, it will not read the whole file again, since it knows exactly, where it left off. This is the role of the offset, which in this scenario is persisted to /tmp/connect.offsets. Offsets are configured through the worker properties by `offset.storage.file.filename.`

Same goes for the Sink Connector, which persist its offset in Zookeeper:

```
$ ./bin/kafka-consumer-offset-checker --group connect-local-file-sink --topic connect-test --zookeeper localhost:2181
Group          	         Topic                          Pid Offset          logSize         Lag             Owner
connect-local-file-sink connect-test                   0   20              20              0               none

```

Another thing is that when you remove test.txt and start from scratch, the Source Connector won't pick up the new lines. You also have to delete the offset storage, in this case `/tmp/connect.offsets`

A detailed [step by step guide](http://docs.confluent.io/3.0.0/connect/intro.html#connect-quickstart) is available in the documentation.

## JDBC Connector
In this example we want to load data from different tables into Kafka. Also when records are being added or modified, we want to get that information into Kafka. Finally tables may be deleted. We want to have this scenario handled as well. All in an automated fashion of course and without writing a single line of code.

The example is based on Postgresql 9.5. I've used Docker Machine for this:

```
$ docker run -p 5432:5432 --name confluent -e POSTGRES_PASSWORD=postgres -d postgres:9.5

$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
a6ed5c0886bc        postgres:9.5        "/docker-entrypoint.s"   3 minutes ago       Up 3 minutes        0.0.0.0:5432->5432/tcp   confluent

$ docker exec -it a6ed5c0886bc /bin/bash

root@a6ed5c0886bc:/# su - postgres

$ psql

postgres=# create database connect_test;
postgres=# \c connect_test;

connect_test=# CREATE TABLE movies(id INTEGER PRIMARY KEY, modified TIMESTAMP NOT NULL, title VARCHAR(80), year INTEGER);

connect_test=# INSERT INTO movies VALUES (1, LOCALTIMESTAMP(3), 'Forrest Gump', 1994);
connect_test=# INSERT INTO movies VALUES (2, LOCALTIMESTAMP(3), 'Fight Club', 1999);
```
The `modified` column is required for the connector to recognize modifications of a record. The idea is to update this column, every time the record is modified.
You may ask what this `LOCALTIMESTAMP(3)` is about? Why not `now()`? I'll come back to this later...

Let's configure the JDBC Source Connector in `./etc/kafka-connect-jdbc/psql.properties`:

```
name=psql-source
connector.class=io.confluent.connect.jdbc.JdbcSourceConnector
tasks.max=10

connection.url=jdbc:postgresql://192.168.99.100:5432/connect_test?user=postgres&password=postgres
mode=timestamp+incrementing
timestamp.column.name=modified
incrementing.column.name=id

topic.prefix=psql
```

Start the Connector:

```
$ ./bin/connect-standalone etc/kafka/connect-standalone.properties etc/kafka-connect-jdbc/psql.properties
```

If you see this:

```
[2016-07-09 15:47:02,258] ERROR Stopping after connector error (org.apache.kafka.connect.cli.ConnectStandalone:100)
java.lang.IllegalArgumentException: Number of groups must be positive.
	at org.apache.kafka.connect.util.ConnectorUtils.groupPartitions(ConnectorUtils.java:45)

```

then it could mean, that there are no tables in the database you connected with.

If everything goes well, running the console consumer confirms, that records in the DB have been processed:

```
$ ./bin/kafka-console-consumer --from-beginning --zookeeper 127.0.0.1:2181 --topic psqlmovies

{"schema":{"type":"struct","fields":[{"type":"int32","optional":false,"field":"id"},{"type":"int64","optional":false,"name":"org.apache.kafka.connect.data.Timestamp","version":1,"field":"modified"},{"type":"string","optional":true,"field":"title"},{"type":"int32","optional":true,"field":"year"}],"optional":false,"name":"movies"},"payload":{"id":1,"modified":1468077175152,"title":"Forrest Gump","year":1994}}
{"schema":{"type":"struct","fields":[{"type":"int32","optional":false,"field":"id"},{"type":"int64","optional":false,"name":"org.apache.kafka.connect.data.Timestamp","version":1,"field":"modified"},{"type":"string","optional":true,"field":"title"},{"type":"int32","optional":true,"field":"year"}],"optional":false,"name":"movies"},"payload":{"id":2,"modified":1468077178257,"title":"Fight Club","year":1999}}

```

This is just the tip of the iceberg. You can configure white and black lists to specify which tables to include or exclude, the poll interval, even tailored sql statements to query for new and modified records just to name the most important ones. More details about the JDBC Connector can be found at [Confluent’s JDBC Connector documentation](http://docs.confluent.io/3.0.0/connect/connect-jdbc/docs/jdbc_connector.html).

What about that precision in `LOCALTIMESTAMP(3)`? Compared to `now()`, it creates a timestamp rounded to the milliseconds part, like `2016-07-09 15:12:58.257` instead of `2016-07-09 15:12:58.257191`.
Now when you look at the /tmp/connect.offsets file, you'll see that the timestamp, used to find new or modified records, is in milliseconds:

```
... {"incrementing":6,"timestamp":1470209167516}...
```

If you would use the full available precision with `now()` or `LOCALTIMESTAMP`, the persisted offset by the Kafka Connector would always be smaller than the value in the database (15:12:58.257 < 15:12:58.257191), what the connector would interpret as the record not having been processed yet. As a consequence, the connector would reprocess the last record in an endless loop every 5 seconds.

On a final note, when you add a new table, it will be picked up by the connector automatically and a new topic will be fed with the table's records. It just may take up to `table.poll.interval.ms` (by default 60000ms), another configurable connector property.


## Distributed Connector Setup

One of the benefits of using Kafka Connect is built-in fault tolerance and scalability. Starting a connector in distributed mode differs from standalone mode. It is started with only the worker properties and the connector configuration is provided via REST API calls:

```
$ ./bin/connect-distributed etc/kafka/connect-distributed.properties
```

To start another worker on the **same** machine, copy `etc/kafka/connect-distributed.properties` and append `rest.port=8084`, since by default the REST service is launched on `8083`.

To add a connector run:

```
$ curl -X POST -H "Content-Type: application/json" --data '{"name": "distributed-psql-source", "config": {"connector.class":"io.confluent.connect.jdbc.JdbcSourceConnector", "tasks.max":"2", "connection.url":"jdbc:postgresql://192.168.99.100:5432/connect_test?user=postgres&password=postgres", "mode":"timestamp+incrementing", "timestamp.column.name":"modified", "incrementing.column.name":"id", "topic.prefix":"psql" }}' http://localhost:8083/connectors
{"name":"distributed-psql-source","config":{"connector.class":"io.confluent.connect.jdbc.JdbcSourceConnector","tasks.max":"2","connection.url":"jdbc:postgresql://192.168.99.100:5432/connect_test?user=postgres&password=postgres","mode":"timestamp+incrementing","timestamp.column.name":"modified","incrementing.column.name":"id","topic.prefix":"psql","name":"distributed-psql-source"},"tasks":[{"connector":"distributed-psql-source","task":0},{"connector":"distributed-psql-source","task":1}]}

```

To delete this connector run:

```
$ curl -X DELETE  http://localhost:8083/connectors/distributed-psql-source
```

## Cassandra Connector

There are at least two open source Cassandra connectors provided by the community. I've chosen the one from [DataMountaineer](http://docs.datamountaineer.com). They seem to build an interesting ecosystem around Apache Kafka with very useful tools and especially connectors. I won't copy their documentation about the [Cassandra connector](http://docs.datamountaineer.com/en/latest/cassandra.html), rather paste a shell session that shows, how to use the connector.

```
$ mkdir cassandra-connector
$ cd cassandra-connector/
$ git clone https://github.com/datamountaineer/stream-reactor
$ cd stream-reactor/kafka-connect-cassandra/
$ gradle fatJarNoTest
```

Launch Cassandra and connect with cqlsh

```
cqlsh> create keyspace connector WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 } ;

cqlsh> create table connector.metrics(device_id text, created timeuuid, button int, primary key(device_id, created));

cqlsh> insert into connector.metrics(device_id, created, button) values('indoor', now(), 0);

cqlsh> insert into connector.metrics(device_id, created, button) values('outdoor', now(), 1);
```

Now we go to the confluent directory.

The connector can run in two modes, `bulk` load and `incremental`.
Let's use bulk load mode, to load all data we have in the Cassandra table into Kafka. Create a file `etc/kafka/cassandra-source-bulk-metrics.properties`

```
name=cassandra-source-metrics
connector.class=com.datamountaineer.streamreactor.connect.cassandra.source.CassandraSourceConnector
connect.cassandra.key.space=connector
connect.cassandra.import.route.query=INSERT INTO metrics-topic SELECT * FROM metrics
connect.cassandra.import.mode=bulk
connect.cassandra.contact.points=localhost
```

And execute:

```
CLASSPATH=/PATH_TO_PROJECT/cassandra-connector/stream-reactor/kafka-connect-cassandra/build/libs/kafka-connect-cassandra-0.1-3.0.0-all.jar ./bin/connect-standalone etc/kafka/connect-standalone.properties etc/kafka/cassandra-source-bulk-metrics.properties


[2016-07-26 23:27:17,622] INFO Query SELECT * FROM connector.metrics executing. (com.datamountaineer.streamreactor.connect.cassandra.source.CassandraTableReader:173)
[2016-07-26 23:27:17,625] INFO Querying returning results for connector.metrics. (com.datamountaineer.streamreactor.connect.cassandra.source.CassandraTableReader:189)
[2016-07-26 23:27:17,625] INFO Storing offset 1900-01-01 00:00:00.000Z (com.datamountaineer.streamreactor.connect.cassandra.source.CassandraTableReader:236)
[2016-07-26 23:27:17,625] INFO Entries still pending drainage from the queue for connector.metrics! Not submitting query till empty. (com.datamountaineer.streamreactor.connect.cassandra.source.CassandraTableReader:105)
[2016-07-26 23:27:17,626] INFO Storing offset 1900-01-01 00:00:00.000Z (com.datamountaineer.streamreactor.connect.cassandra.source.CassandraTableReader:236)
[2016-07-26 23:27:17,626] INFO Found 1. Draining entries to batchSize 100. (com.datamountaineer.streamreactor.connect.queues.QueueHelpers$:60)
[2016-07-26 23:27:17,626] INFO Processed 2 rows for table metrics-topic.metrics (com.datamountaineer.streamreactor.connect.cassandra.source.CassandraTableReader:210)
```

To verify the data has been moved to Kafka, run:

```
$ ./bin/kafka-console-consumer --zookeeper 127.0.0.1:2181 --from-beginning --topic metrics-topic

{"schema":{"type":"struct","fields":[{"type":"string","optional":true,"field":"device_id"},{"type":"string","optional":true,"field":"created"},{"type":"int32","optional":true,"field":"button"}],"optional":false},"payload":{"device_id":"indoor","created":"ae7cdfb0-460c-11e6-b9d8-8fd53a25cd0e","button":0}}
{"schema":{"type":"struct","fields":[{"type":"string","optional":true,"field":"device_id"},{"type":"string","optional":true,"field":"created"},{"type":"int32","optional":true,"field":"button"}],"optional":false},"payload":{"device_id":"outdoor","created":"b363e8c0-460c-11e6-b9d8-8fd53a25cd0e","button":1}}
```

The thing to note here is that the bulk load will happen every 60 seconds, which is the default import poll interval. This can be configured in the `cassandra-source-bulk-metrics.properties` with the `connect.cassandra.import.poll.interval` property (in milli seconds).

The second import mode is `incremental`, which will load new data into Kafka. This can be configured in the `cassandra-source-bulk-metrics.properties` file:

```
connect.cassandra.import.route.query=INSERT INTO metrics-topic SELECT * FROM metrics PK created
connect.cassandra.import.mode=incremental
```

The create column has to be of type `TIMEUUID`. Running the connector and adding a new record into Cassandra results in a new message showing up in the Kafka topic:

```
cqlsh> insert into connector.metrics(device_id, created, button) values('nextdoor', now(), 2);
```

```
{"schema":{"type":"struct","fields":[{"type":"string","optional":true,"field":"device_id"},{"type":"string","optional":true,"field":"created"},{"type":"int32","optional":true,"field":"button"}],"optional":false},"payload":{"device_id":"nextdoor","created":"5ef324c0-5379-11e6-9eb6-a3fd5552bc44","button":2}}

```

## Final words

Kafka Connect provides a framework to develop connectors importing data from various sources and exporting it to multiple targets. There are already plenty of connectors available, some of which are supported by Confluent and its partners.
The documentation for Kafka Connect is available at [Confluent](http://docs.confluent.io/3.0.0/connect/intro.html).
I'd recommend to watch [Confluent's introduction to Kafka Connectors](https://vimeo.com/168998241). It gives a high level overview of what it is about, the benefits and even a quick introduction into developing own connectors.
