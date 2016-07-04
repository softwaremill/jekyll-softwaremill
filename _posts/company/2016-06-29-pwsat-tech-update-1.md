---
title: PW-Sat2 Ground Station Update
description: In which we reveal a few details about a little side project
author: Mikołaj Koziarkiewicz
author_login: mikolaj_koziarkiewicz
categories:
- scala
- space
- company

layout: simple_post
---
​
While we advertise it more prominently [in other media](https://www.facebook.com/SoftwareMill/photos/a.687334144705834.1073741839.286344158138170/687335164705732/?type=3&theater) 
than on this blog, some of the readers may be aware that we support [PW-Sat2](http://pw-sat.pl/en/),
a [2U cubesat](https://en.wikipedia.org/wiki/CubeSat) project created by a group students from the Warsaw University of Technology.

Specifically, we're responsible for developing the ground station component. It comprises the following functionality:

 - a client app to crowdsource telemetry data from amateur radio operators 
 (gathered when the satellite is broadcasting telemetry while overhead) ;
 - a server app to aggregate the data, validate it, and present reports;
 - a command module to the server app that allows PW-Sat2 operators to uplink with the cubesat.
 
The ground station project is still in the relatively early stages, since a number of issues remain open. We can, however, share a few words about
the technologies employed so far.

First of all, we're set to have the entirety of data processing implemented in [Akka Streams](http://akka.io/). In fact, we don't care much about
backpressure in this project, as the expected data volume is manageable on even low-end systems, and the risk of a DoS is similarly meagre. Regardless,
a stream architecture has allowed us to conveniently "wire up" various processing components necessary to go from raw telemetry frames 
to pre-processed data entities.

Happily, we are able to use Akka Streams from the very level of raw data capture via radio receivers. This is thanks to a library called 
[flow](https://github.com/jodersky/flow). In fact, this is the same library that we used for 
[low-level controller signal capture in our promotional game](https://www.facebook.com/SoftwareMill/photos/a.687334144705834.1073741839.286344158138170/687334624705786/?type=3&theater), 
[last year at Confitura](https://www.facebook.com/SoftwareMill/photos/?tab=album&album_id=687334144705834).

Less importantly (but interesting nonetheless), we've decided to try out a graph DB in a Scala environment for this project. Of course, the workload we have here 
is not characterized with a particular affinity towards storage. Nevertheless, due to the experimental nature of the project we have judged it to be a good opportunity to see
how a graph-based approach fares in comparison to relational- or document-oriented ones in a "vanilla" environment.
 
We went with [OrientDB](http://orientdb.com/) as our DB implementation. However, we've mostly operated on the higher-level abstraction of TinkerPop 3. 
[TinkerPop](http://tinkerpop.incubator.apache.org/) is an agnostic JVM-based layer for graph databases. It has made major steps towards API maturity lately 
(and accordingly been named an Apache Top-Level Project [very recently](https://blogs.apache.org/foundation/entry/the_apache_software_foundation_announces91)).

For us, it meant a now-convenient graph API, especially since a [quite pleasant Scala implementation](https://github.com/mpollmeier/gremlin-scala) is available. One has to 
thread carefully, as some rough edges remain - mostly regarding case class (de)serialization - so take care to evaluate independently regardless of this blog post. Fortunately, the library 
certainly provides a net improvement over those Scala APIs based on previous TinkerPop implementations.

Overall, progress on the Ground Station is ongoing, and we hope to share some more tech-stack and domain info tidbits in the coming months.

_PS. TinkerPop has possibly one of the most... unorthodox introductions of all IT projects. It certainly [makes for an interesting read](http://tinkerpop.apache.org/docs/current/reference/#preface)._