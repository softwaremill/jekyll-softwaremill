
# Summary 

As always, which message queue you choose depends on specific project requirements. All of the above solutions have some good sides:

* SQS is a service, so especially if you are using the AWS cloud, it’s an easy choice: good performance and no setup required
* if you are using Mongo, it is easy to build a replicated message queue on top of it, without the need to create and maintain a separate messaging cluster
* if you want to have high persistence guarantees, RabbitMQ ensures replication across the cluster and on disk on message send. It’s also a very popular choice and used in many projects
* ActiveMQ is a popular and widely used messaging broker with good performance, wide protocol support
* HornetQ has great performance with a very rich messaging interface and routing options
* Kafka offers the best performance and scalability

When looking only at the throughput, Kafka is a clear winner (unless we include SQS with multiple nodes, but as mentioned, that would be unfair):

![Summary 1](/img/mqperf/summary1.png)

It is also interesting to see how sending more messages in a batch improves the throughput. Rabbit achieves the same performance as before, HornetQ gains a 1.2x speedup and Kafka a 3x speedup, achieving about 90 000 msgs/s!

![Summary 2](/img/mqperf/summary2.png)

There are of course many other aspects besides performance, which should be taken into account when choosing a message queue, such as administration overhead, partition tolerance, feature set regarding routing, etc.
