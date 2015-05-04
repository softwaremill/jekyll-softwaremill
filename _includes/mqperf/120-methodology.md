
# Testing methodology

We’ll be looking at how fast (in terms of throughput, messages/second) we can send and receive messages using a single message queue cluster. Ideally, we want to have 3 identical, replicated nodes running the message queue server.

All sources for the tests are [available on GitHub](https://github.com/adamw/mqperf).

Each test run is parametrised by the type of the message queue tested, optional message queue parameters, number of client nodes, number of threads on each client node and message count. A client node is either sending or receiving messages; in the tests we used from 1 to 8 client nodes of each type (there’s always the same number of client and receiver nodes), each running from 1 to 25 threads.

Each [Sender](https://github.com/adamw/mqperf/blob/master/src/main/scala/com/softwaremill/mqperf/Sender.scala) thread tries to send the given number of messages as fast as possible, in batches of random size between 1 and 10 messages. For some queues, we’ll also evaluate larger batches, up to 100 or 1000 messages. After sending all messages, the sender reports the number of messages sent per second.

The [Receiver](https://github.com/adamw/mqperf/blob/master/src/main/scala/com/softwaremill/mqperf/Receiver.scala) tries to receive messages (also in batches), and after receiving them, acknowledges their delivery (which should cause the message to be removed from the queue). When no messages are received for a minute, the receiver thread reports the number of messages received per second.

![Test setup](/img/mqperf/mqtestsetup.png)

The queues have to implement the [Mq](https://github.com/adamw/mqperf/blob/master/src/main/scala/com/softwaremill/mqperf/mq/Mq.scala) interface. The methods should have the following characteristics:

* `send` should be synchronous, that is when it completes, we want to be sure (what sure means exactly may vary) that the messages are sent
* `receive` should receive messages from the queue and block them; if the node crashes, the messages should be returned to the queue and re-delivered
* `ack` should acknowledge delivery and processing of the messages. Acknowledgments can be asynchronous, that is we don’t have to be sure that the messages really got deleted.

## Server setup

Both the clients, and the messaging servers used [m3.large EC2 instances](http://aws.amazon.com/ec2/instance-types/); each such instance has 2 virtual CPUs, 7.5GB of RAM and a 32GB SSD. All instances were started in a *single* availability zone (eu-west-1a). While for production deployments it is certainly better to have the replicas distributed across different locations (in EC2 terminology - different availability zones), as the aim of the test was to measure performance, a single availability zone was used to minimise the effects of network latency as much as possible.

The servers were provisioned automatically using [Chef](http://www.getchef.com/chef/) through [Amazon OpsWorks](http://aws.amazon.com/opsworks/); when possible, each server was running a single [Docker](https://www.docker.com/) container, which allowed e.g. to quickly deploy a new version of clients to multiple machines. For a detailed description of that approach, see [here](http://www.warski.org/blog/2014/06/cluster-wide-javascala-application-deployments-with-docker-chef-and-amazon-opsworks/).