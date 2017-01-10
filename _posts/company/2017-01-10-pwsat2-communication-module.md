---
title: PW-Sat2 communication module
description: How to communicate with a sattelite when there is no Internet on the orbit.
author: Tomasz Łuczak
author_login: tomasz_luczak
keywords: pwsat-2, satellite, hamradio, AX.25, AGWPE, KISS, open-source
categories:
- scala
- company
layout: simple_post
---

[As you may already know](https://softwaremill.com/pwsat-tech-update-1/), we are involved in developing [the PW-Sat2 project](http://pw-sat.pl/). It is the second Polish [cube satellite](https://en.wikipedia.org/wiki/CubeSat) developed by students of the Warsaw University of Technology, and enthusiasts. Our role in this project is to prepare [ground station](https://en.wikipedia.org/wiki/Ground_station) software, which will enable mission control operators to gather and present data received from the satellite, as well as to send commands to the satellite.

#Communicating with a satellite#
As a part of PW-Sat2 Ground Station project we need to implement a command module that will allow system operators to uplink with [the cubesat](https://en.wikipedia.org/wiki/CubeSat). There is one major problem when communicating with a satellite - there is no Internet (smile) (someone should fix that). Satellites communicate with ground stations using radio waves. The communication can be achieved only in a communication window - time when the satellite is passing over the ground station.

<div style="width: 100%; text-align: center">
<img src="/img/uploads/2017/01/satellite_trajectory.png" alt="Satellite trajectory" />
</div>

An electromagnetic wave is generated to convey binary data based on a chosen modulation schema. On the other side the received radio wave needs to be demodulated using the same schema. An appliance for converting digital binary data to an analog signal - and the other way round - is called a modem (Modulator/Demodulator). The basic communication schema looks as follows:

<div style="width: 100%; text-align: center">
<img src="/img/uploads/2017/01/comunication_schema.png" alt="Simple communication schema" />
</div>

The modem can be implemented as a software solution but that is not an easy task. Insofar as modulating the signal is not that challenging, in case of demodulation things get much more complicated. The signal received by the transceiver is weak and very noisy. 

The modem needs to extract the signal and demodulate it into binary form. Fortunately there are many soundmodems on the market already. Some of them can be found below:

* [UZ7HO SoundModem](http://uz7.ho.ua/packetradio.htm)
* [javAX25](https://github.com/sivantoledo/javAX25)
* [mixW](http://mixw.net/)
* [Digital Master from ham radio delux](http://ham-radio-deluxe.com/)

others can be found in the [QRZCQ - The database for radio hams](https://ssl.qrzcq.com/page/articles/showsingle/id/6) article. What is crucial for us - most of the presented soundmodems expose an API over TCP/IP using [KISS](https://en.wikipedia.org/wiki/KISS_\(TNC\)) or [AGWPE](http://www.sv2agw.com/ham/develop.htm) protocols making integration quite straightforward.

#Next steps#

Evidently, we decided not to implement a modem on our own, but to use one of the available solutions. As a result, the PW-Sat2 Ground Station was divided into two modules:

* pwsat-gs - the main application, responsible for presenting data, composing commands, etc. 
* [modem-connector](https://github.com/softwaremill/modem-connector) - a Scala wrapper for the AGWPE protocol for soundmodem integration

The [modem-connector](https://github.com/softwaremill/modem-connector) is still in its early stages, but it was successfully tested with the [UZ7HO SoundModem](http://uz7.ho.ua/packetradio.htm). Now we are waiting for integration tests in a [cleanroom](https://en.wikipedia.org/wiki/Cleanroom) with a physical satellite radio.

You can find more details about the [modem-connector](https://github.com/softwaremill/modem-connector) implementation on [the Softwarepassion blog﻿](http://www.softwarepassion.com/agwpe-protocol-based-modem-connector-library/) or on [GitHub](http://uz7.ho.ua/packetradio.htm) itself. The library has been released under [the Apache 2.0 License](https://github.com/softwaremill/modem-connector/blob/master/LICENSE).
