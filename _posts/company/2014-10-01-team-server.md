---
title: pawels team server
description: Adam Warski, one of SoftwareMill's founders, has 3 presentations at JavaOne 2014. Here's a short sneak-peek of what he'll talk about.
author: Adam Warski
author_login: stawicki
categories:

layout: simple_post
---
Blogpost o TestServer [jakiś tytuł fajny by się przydał]
--------

As a programmer, probably you need to create web service client time to time. You also need to test it, don’t you? It is useful to test what is sent to the server, and to see what the client is doing when it receives certain response. To test it you need a server, where you can connect with the client, send something, make it respond and later check what was sent.

We try to make our tests as independent of the environment as possible, so we like to run/configure/stop the server in the test or tests suite. That’s why we have created TestServer. Maybe the name is not very creative (well, we never meant to sell it ;) ), but it’s lightweight, starts and stops quickly and it’s embedded - you can manage it entirely from the test code. On Mac Retina, Mid 2012 the TestServer starts in 10 and stops in 2 milliseconds. It does the job, and does it quite simply.

TestServer is part of [softwaremill-commons](https://github.com/softwaremill/softwaremill-common/tree/master/softwaremill-test/softwaremill-test-server), our open source library. To get it, add our repository to your `pom.xml`:

    <repository>
        <id>softwaremill-snapshots</id>
        <name>SoftwareMill Snapshots</name>    
        <url>https://nexus.softwaremill.com/content/repositories/snapshots</url>
    </repository>
    <repository>
        <id>softwaremill-releases</id>
        <name>SoftwareMill Releases</name>
        <url>https://nexus.softwaremill.com/content/repositories/releases</url>
    </repository>

And add softwaremill-commons dependency:

    <dependency>
        <groupId>com.softwaremill.common</groupId>
        <artifactId>softwaremill-test-server</artifactId>
        <version>80</version>
        <scope>test</scope> 
    </dependency>

Ok, so you have the dependency and it's ready to run. To start the server, all you need to do is 

    testServer = new TestServer();
    testServer.start();

Stopping is quote obvious too:

    testServer.stop();

To use it, you also need to implement a Responder interface. Responder has two methods: 

    canRespond(HttpServletRequest request);
    respond(HttpServletRequest request, HttpServletResponse response);

If you have the Responder ready, add it to TestServer:

    testServer.addResponder(responder);

canRespond() method is useful if you want to have more than one Responder. Then the TestServer iterates over all of them (in the order they were added) and uses the first one that canRespond. 

In the respond() method you need to put all your logic. It can be simple hardcoded response, HTTP error code or whatever - it’s up to you. Isn’t it flexible?

We have one Responder ready for you - LogAndStoreRequestResponder. This one logs the request on the standard output, stores it so you can check it later, and responds “OK” with HTTP status 200. It’s enough to check what your client sent to the server. If you need to check how it reacts to different responses, you’ll need to code your responses yourself.

It might be a good idea to put start/stop in your `@BeforeClass`/`@AfterClass` methods. Then you might want to use different Responder in each test, so we also provided clearResponders() method for you, you can use it in `@Before`.

The TestServer listens to HTTP and HTTPS traffic, so you can also test your web service clients connecting via HTTPS. By default it listens for HTTP connections on port 18182, and for HTTPS ones on 18183. Of course, it's configurable. You can set the ports in the TestServer constructor.

Hope it’s simple, and might be useful for you. Happy testing!

