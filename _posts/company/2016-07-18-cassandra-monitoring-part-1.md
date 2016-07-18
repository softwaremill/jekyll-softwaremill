---
title: Cassandra Monitoring - part I - Introduction
description: Introduction to possible variants of Cassandra Monitoring
author: Michał Matłoka
author_login: matloka
categories:
- cassandra
- monitoring
- bigdata

layout: simple_post
---

*This is the first part of the Cassandra Monitoring miniseries, index of all parts below:*

1. *[Cassandra Monitoring - part I - Introduction](https://softwaremill.com/cassandra-monitoring-part-1/)*

# Cassandra Monitoring

In this series we would like to focus on the Cassandra NoSQL database monitoring. If you would like to read more about general metric collection then you can find a great post on the [DataDog Blog](https://www.datadoghq.com/blog/monitoring-101-collecting-data/). Here, we are not going to focus on **what** specifically you can gather from Cassandra, but rather **how**. Again, for details about different Cassandra metrics see the [another DataDog  blogpost](https://www.datadoghq.com/blog/how-to-monitor-cassandra-performance-metrics/).
In the upcoming parts we are also going to present our open source contributions which make Cassandra monitoring easier and more effective.

## Nodetool

Everybody who uses Cassandra knows [`nodetool`](http://docs.datastax.com/en/cassandra/3.x/cassandra/tools/toolsNodetool.html). It is a basic tool, bundled in the Cassandra distribution, for node management and [statistics gathering](http://docs.datastax.com/en/cassandra/3.0/cassandra/operations/opsMonitoring.html?scroll=opsMonitoring__opsMonitoringNodetool). Under the hood it is just a Python console application. Nodetool shows [cluster status, compactions, bootstrap streams and much more](https://www.datadoghq.com/blog/how-to-monitor-cassandra-performance-metrics/). It is a very important source of information, but it's just a CLI tool without any storage or visualization capabilities. For comfortable monitoring, and to get a better understanding of what hides behind all these numbers, we need something more, preferably with a GUI.

It is worth noting that Cassandra commiters [find it important](https://issues.apache.org/jira/browse/CASSANDRA-11939) to not change output structure of `nodetool`, because people might have scripts based on them.

![Nodetool](/img/uploads/2016/07/cassandra-monitoring-1-nodetool.png)

## JMX & Reporters

Cassandra exposes all its metrics via JMX (by default on port `7199`).

JMX can be read e.g. with `jconsole` or `jvisualvm` with `VisualVM-MBeans plugin` (both tools bundled in JDK distributions).
The JMX interface also offers some management features! For example under `org.apache.cassandra.db.StorageService` you can find operations related to node removal, drain, table snapshoting and more.

![JMX operations](/img/uploads/2016/07/cassandra-monitoring-1-jmx.png)

Note: by default remote JMX is disabled. If you really need it, you can enable it in `cassandra-env.sh`.

For metrics gathering Cassandra internally leverages [`io.dropwizard.metrics`](http://metrics.dropwizard.io/)  (only from version `2.2`, previously library was named `com.yammer.metrics` and to be more confusing  `io.dropwizard.metrics` uses `com.codahale.metrics` package names). Those are the metrics presented via JMX. However, it is possible to access them in a different way. From Cassandra 2.0.2 it is possible to configure reporters, so that every configured period Cassandra forwards those metrics e.g. to [Graphite](https://graphiteapp.org/). This is implemented by [`metrics-reporter-config`](https://github.com/addthis/metrics-reporter-config) library  (see [CASSANDRA-4430](https://issues.apache.org/jira/browse/CASSANDRA-4430)) and provides a nice automatic way to process metrics in different systems, store and display them or check for alarms.

We will cover the concept of reporters in more detail, in the next part of this blogpost series.

## DataStax OpsCenter

[OpsCenter](http://www.datastax.com/products/datastax-opscenter) is a monitoring and management solution. It is also capable of system monitoring. Every node needs to have an OpsCenter agent installed, which sends data to the main OpsCenter service, which in turn stores them in a Cassandra keyspace. It is recommended to have a separate Cassandra cluster for storing OpsCenter data, so that OpsCenter activity won't be seen among the presented metrics. The application is also able to manage the cluster, add/remove nodes and more. However, the "free" OpsCenter is compatible with the open source Cassandra up to version 2.1. The new OpsCenter 6.0 is available only for DataStax Enterprise 4.7+ (based on Cassandra 2.1) and 5.0 (based on Cassandra 3.0). [The Documentation](http://docs.datastax.com/en/landing_page/doc/landing_page/compatibility.html?scroll=compatibilityDocument__opsc-compatibility) shows more detailed compatibility matrix.

In other words if your cluster uses open source Cassandra 2.2 or 3.x then OpsCenter is not for you.

![OpsCenter](/img/uploads/2016/07/cassandra-monitoring-1-opscenter.jpg)[Source](http://www.datastax.com/wp-content/themes/datastax-2014-08/images/products/OpsCenter-Screenshot-VisualMonitoringandTuning.jpg)

## DataDog

In contrast, [DataDog](datadoghq.com) is a SaaS solution. It is capable of monitoring, but also supports a lot of other databases and services. However it is [free](https://www.datadoghq.com/pricing/) for only no more than 5 hosts with major [limitations](https://www.datadoghq.com/pricing/).

DataDog requires an agent installed on every Cassandra node. It reads Cassandra [logs](https://github.com/DataDog/dd-agent/blob/master/dogstream/cassandra.py) and metrics using JMX. The agent is [open source](https://github.com/DataDog/dd-agent) so you can check what exactly it’s doing.

![DataDog](/img/uploads/2016/07/cassandra-monitoring-1-datadog.png)[Source](https://www.datadoghq.com/blog/how-to-monitor-cassandra-performance-metrics/)

## Conclusions

There are a lot of options for Cassandra monitoring (and management), however none of them are perfect. If you are still using open source Cassandra 2.1 or below, or DataStax Enterprise, then you can use OpsCenter. If you are open to Cloud and SaaS then DataDog monitoring might be for you. Otherwise, you might be interested in Cassandra reporters and solutions based on [Graphite](https://graphiteapp.org/) or [InfluxDB](https://influxdata.com/time-series-platform/influxdb/) and [Grafana](http://grafana.org/) which we will describe in the next parts of this blog series. We will compare the different options and show how to configure them for different Cassandra versions.

If you want to dive deeper into the topic of metrics, then these links might be interesting for you (some quoted already in the article):

* https://www.datadoghq.com/blog/monitoring-101-collecting-data/
* https://www.datadoghq.com/blog/how-to-monitor-cassandra-performance-metrics/
* https://www.datadoghq.com/blog/how-to-collect-cassandra-metrics/
* https://www.datadoghq.com/blog/monitoring-cassandra-with-datadog/
* https://medium.com/@mlowicki/alternatives-to-datastax-opscenter-8ad893efe063#.wpetbdrj9
* https://medium.com/@mlowicki/cassandra-metrics-and-their-use-in-grafana-1f0dc33f9cca#.37bkpooc4
