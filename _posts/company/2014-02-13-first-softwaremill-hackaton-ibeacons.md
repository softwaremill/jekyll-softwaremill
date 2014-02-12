---
title: First SoftwareMill hackaton - iBeacons
description: Recently we held the first SoftwareMill hackaton - creating various apps leveraging iBeacons
keywords: softwaremill, ibeacons, bluetooth, iphone, estimote
author: Adam Warski
author_login: warski
categories:
layout: simple_post
---

Last week, during our monthly face-to-face meeting, we held the first Softwaremill hackaton. The main theme were iBeacons. As many of us already did some experiments with Bluetooth LE (the technolgy behind beacons), we had a couple of [Estimote](http://estimote.com/) beacons, [Gimbal](https://gimbal.com/) beacons, RaspberryPis with BLE dongles and iPhones/MacBooks; so on the hardware side we've been pretty well equipped.

We had a couple of teams, working on different apps: an android Estimote app, an iPhone triangulation app and an iPhone "Gandalf" game.

<div style="width:100%; text-align:center">
<img src="/img/uploads/2014/02/hackaton.jpg" style="height: 200px" align="center" />
</div>

I'm not quite sure where the name Gandalf came from, but the person/beacon-finding game in its current post-hackaton state keeps track of who you already found. If a person is nearby, you either get a notification (if the app is in the background), or see the picture of the person associated with the beacon.

<div style="width:100%; text-align:center">
<img src="/img/uploads/2014/02/gandalf_main.PNG" style="height: 200px" />
<img src="/img/uploads/2014/02/gandalf_face.PNG" style="height: 200px" />
<img src="/img/uploads/2014/02/gandalf_notif.PNG" style="height: 200px" />
</div style="width:100%; text-align:center">

Overall, we found that developing beacon apps went surprisingly fast. We started by modifying some Estimote examples, but soon were able to code using beacons in our own projects. We had some problems with proximity accuracy, but we solved them with some correctional code.

To sum up, I think the hackaton went really well: in less then a day we coded an app which could serve as a demo app for retail (iPhone app + web managing backend), and made good progress on the game. We also had a chance to work in a single room, something that doesn't happen often in a fully remote company! Now we continue to work on our apps in a well known, remote setting :).

Stay tuned for future hackatons, who knows what will come out of them!
