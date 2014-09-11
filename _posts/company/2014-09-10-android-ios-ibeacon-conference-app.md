---
title: iOS/Android iBeacon app for Confitura 2014
description: We've prepared iOS/Android iBeacon app for Confitura 2014, one of the biggest Java conferences in Europe.
author: Jarosław Kijanowski, Michał Mital
author_login: no-image
categories:
- company
layout: simple_post
---

This is the second part of the Confitura conference support blog post - check out [pt. 1 about the Raspberry Pi 3DP voting machines](https://softwaremill.com/3dp-raspberry-pi-ibeacon-conference-voting-machine/).

####Jarek:

We developed a conference application for [Android](https://play.google.com/store/apps/details?id=com.softwaremill&hl=en) and [iOS](https://itunes.apple.com/us/app/confitura/id886610651?mt=8).
The main purpose of the iPad application was to display the agenda. But that would be very poor for a 2014 app. If equipped with an iPad mini or iPad4 you could enable Bluetooth, which would allow the application to receive signals from beacons. 

In fact what the app received were unique ids broadcasted by them. We placed these small devices all over the conference area:

<div style="width=100%; text-align:center">
<img src="/img/uploads/2014/09/beacons.jpg" width="500" />
</div>

_Courtesy of The Shine blog_

We mapped the ids to room names and since the application can determine which beacon is the closest one, it is straightforward to figure out in which room the iPad currently is:

<div style="width=100%; text-align:center">
<img src="/img/uploads/2014/09/ibeacon_admin.png" width="500" />
</div>


The last feature of the iPad application was the ability to store your favorite talks. A user could read details of a particular talk and mark it.

It’s worth to mention that neither the agenda nor the beacons’ mappings were hardcoded in the application. 

This information was hosted in json format on an Amazon S3 instance. In case a beacon failed to broadcast its id, which actually happened due to its end of battery life, we were able to update the mapping and made it available to all clients. With the agenda we pushed it one step further, by caching it in the application. 

This allowed saving bandwidth and downloading a new agenda only if the version on the server was higher.

####Michał:

The Android version of the application was quite similar. At first we had some problems with connecting Android devices with iBeacons, after that we could use all of the features the iBeacon technology gives. 
The main screen:

<div style="width=100%; text-align:center">
<img src="/img/uploads/2014/09/confitura-app.png" width="300" />
</div>

There's a progress bar which shows the strength of iBeacon signal. Actually it looks for all beacons and takes the strongest one. As in iOS application we could build our own conference programme. There was a possibility to visit the speakers' blogs as well as their twitter profiles.

The applications themselves are available at [Google Play](https://play.google.com/store/apps/details?id=com.softwaremill&hl=en) and [AppStore](https://itunes.apple.com/us/app/confitura/id886610651?mt=8) - we also offer a commercial white label version - [contact us](mailto:hello@softwaremill.com) if you think this might be a good fit!


