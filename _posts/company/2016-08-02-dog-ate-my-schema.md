---
title: The dog ate my schema... or what is your excuse not to use the Schema Registry with Apache Kafka?
description: Enforcing schemas on messages passed through Apache Kafka
author: Jarosław Kijanowski
author_login: kijanowski
categories:
- company
- Confluent
- Schema Registry
- Apache Kafka
- BigData

layout: simple_post
---


A typical use case for [Apache Kafka](http://kafka.apache.org/) is to use it as an intermediate party to distribute data among different clients. So far I've never payed much attention to the payload. It was a String serialized by the built-in StringSerializer to a byte array - a format that Kafka accepts.
This may work well, when you're in full control of all the receivers of the data and when the stuff you send through Kafka is not complex, a CSV string for example. However, I can imagine a scenario, where there are multiple receivers, where you, as a sender, are not even aware of and changing the format "slightly" could make some pandas cry. Besides that, distributing the data format among different clients is not standardised in any way so far.

The solution to these problems is an open source tool developed at Confluent called [Schema Registry](http://docs.confluent.io/3.0.0/schema-registry/docs/).
It is a standalone web application (hosted on a built-in Jetty server) exposing a REST interface to store and retrieve schemas. The Schema Registry also validates, if a schema is compatible with its previous versions according to the configured compatibility level.

Before moving on, let's introduce [Apache Avro](https://avro.apache.org/), a serialization mechanism, similar to Google's Protocol Buffers. Keeping it simple, it's a thing to serialize data to send it over the wire.

Back to the Schema Registry and how to use it. In a nutshell, the sending application creates a message, which is an Avro record. This record contains the schema and payload. Then the Avro Serializer kicks in and forms a byte array which consists of just the schema **id** and the payload. This process of serialization is promised to be fast, since first of all the serializer itself has a cache to lookup already registered schemas and then the Schema Registry also caches informations about its schemas.
Now the Consumer receives the payload and deserializes it with the dedicated Avro Deserializers. The Deserializer looks up the full schema, either in its own cache or contacts the Schema Registry. Additionally, the Consumer provides another schema, the one it is expecting the message to conform to. Wait wait wait, two schemas? A writer schema which id arrived with the payload makes sense, but what is the reader schema about? This is the schema the consuming application has been written against. Now having two schemas, the "writer" schema and the "reader" schema, a compatibility check is performed. If the schemas do not match, but are compatible, a transformation of the payload takes place, also called [Schema Evolution](https://docs.oracle.com/cd/NOSQL/html/GettingStartedGuide/schemaevolution.html). Finally the client application receives the message which conforms to the client's schema.

One more thing to keep in mind, is that a Kafka message is a Key-Value pair. In consequence, a topic can have two schemas, one for the Key, one for the Value. Besides that, the Schema Registry allows a schema to evolve and may store multiple versions of a schema.

# Schema compatibility

The compatibility level is set to backward by default. This means, that a new, backward compatible schema, must not break consumers, when used to deserialize messages sent with an older schema. This can easily happen, when we develop an application against a brand new schema, but it turns out that Kafka still stores some legacy messages, which also have to be processed. Also some producer apps may have not yet been updated and are still sending messages with some previous version of the schema. 

Forward compatibility on the other hand means that messages sent with that new forward compatible schema can be deserialized with older schemas. This can also easily happen when our consumer applications have not yet been or never will be updated to use the new schema.

It's also possible to set the compatibility level to `full`, which assures that any new version of a schema is backward and forward compatible.

Finally we can set the level to `none`, to prevent the schema being validated for compatibility at all, but I'm not convinced this is the way to go. If we want to post messages with an incompatible schema, I'd rather think to use a new topic for that.

Not going deeper into the topic, I just want to highlight a typical scenario. If a producer application sends messages with a given schema and after some time decides to include a new field, it can be only transformed, if a default value is provided. This scenario is evaluated in [`AvroGenericSenderTest#testAvroBackwardIncompatibleSerialization`](https://github.com/softwaremill/confluent-playground/blob/master/avro-serialization/src/test/java/wrapper/AvroGenericSenderTest.java#L86)
This makes sense, because how should a deserializer know how to transform (add a new field to) messages, that have been sent with the old schema? To adhere to the new schema, a default value for the non-existing field has to be provided, not to blow up the client applications.

# Key Benefits

1. The Schema Registry allows to share schemas between producers and consumers and validate messages against them. 
2. An incompatible messages never makes it into Kafka.
3. The development and deployment processes of Producer and Consumer applications do not depend on each other.
4. There should be a performance decrease, since each send and read request requires the schema to be verified for compatibility. It has been promised to keep it low due to caching on both, the serializer level and Schema Registry level.
5. The compatibility level can be set for the whole Schema Registry as well as on the schema itself. This is a very powerful feature which allows to ensure different compatibility strategies per topic.

# Limits

There are a couple of issues logged against the Schema Registry and here are some I thought to highlight:

* [Can not rollback the old schema as the newest version under the same subject](https://github.com/confluentinc/schema-registry/issues/270)

* [Example showing how to delete/remove a topic/subject from Schema-Registry](https://github.com/confluentinc/schema-registry/issues/227)

# Conclusions and miscellaneous notes

There's a video by Gwen Shapira explaining the Schema Registry available on [Vimeo](https://vimeo.com/167028700).
A sample application evaluating the Schema Registry is available on [github](https://github.com/softwaremill/confluent-playground/tree/master/avro-serialization).

The Schema Registry is not a must, it is still possible to send data to topics bypassing the Schema Registry. What can go wrong? ;)

The Schema Registry can be deployed in form of a single-master multiple-slave architecture also supporting multi data-center deployments.

Using the Schema Registry is in that sense *transparent*, that only the Avro serializers/deserializers have to be put into the Consumer's / Producer's config properties as well as the URL to the Schema Registry.

There is an development overhead related to providing the schema, no matter if using the [generic approach](https://github.com/softwaremill/confluent-playground/tree/master/avro-serialization#avro-generic-approach) or [specific approach](https://github.com/softwaremill/confluent-playground/tree/master/avro-serialization#avro-specific-approach). A price to pay for a safe way to interchange messages.

*So, what is your excuse for not using the Schema Registry?*

