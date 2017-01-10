---
title: PWSat-2 communication module
description: How to communicate with a sattelite when there is no Internet on the orbit.
author: Tomasz Łuczak
author_login: tomasz_luczak
keywords: pwsat-2, satellite, hamradio, AX.25, AGWPE, KISS, open-source
categories:
- scala
- company
layout: simple_post
---

As you may already know we are involved in developing [the PW-Sat2 project](http://pw-sat.pl/). It is a second polish [cube satellite](https://en.wikipedia.org/wiki/CubeSat) developed by students from the Warsaw University of Technology and enthusiasts. Our role in this project is to prepare the [ground station](https://en.wikipedia.org/wiki/Ground_station) software which will enable mission control operators to gather and present data received from the satellite as well as to send commands to the satellite.

#Communicating with a satellite#
As a part of PW-Sat2 Ground Station project we need to implement a command module that will allow system operators to uplink with [the cubesat](https://en.wikipedia.org/wiki/CubeSat). There is one major problem when communicating with a satellite - there is no Internet (smile) (someone should fix that). Satellites communicate with ground stations using radio waves. The communication can be achieved only in a communication window - time when the satellite is bypassing the ground station.

<div style="width: 100%; text-align: center">
<img src="/img/uploads/2017/01/satellite_trajectory.png" alt="Satellite trajectory" />
</div>

An electromagnetic wave is generated to convey binary data based on chosen modulation schema. On the other site the received radio wave needs to be demodulated using the same schema. Utility for converting digital binary data to analog signal and the other way round is called a modem (Modulator/Demodulator). The basic communication schema looks as follows:

<div style="width: 100%; text-align: center">
<img src="/img/uploads/2017/01/comunication_schema.png" alt="Simple communication schema" />
</div>

Modem can be implemented as a software solution but that is not an easy task. In so far as modulating signal is not that challenging, in case of demodulation things get much more complicated. The signal received by the transceiver is weak and very noisy. The modem needs to extract the signal and demodulate it into binary form. Fortunately there are many soundmodems on the market already implemented. Some of them can be found below:

* [UZ7HO SoundModem](http://uz7.ho.ua/packetradio.htm)
* [javAX25](https://github.com/sivantoledo/javAX25)
* [mixW](http://mixw.net/)
* [Digital Master from ham radio delux](http://ham-radio-deluxe.com/)

others can be found in [QRZCQ - The database for radio hams article](https://ssl.qrzcq.com/page/articles/showsingle/id/6). What is crucial for us - most of the presented soundmodems expose an API over TCP/IP using [KISS]('https://en.wikipedia.org/wiki/KISS_(TNC)') or [AGWPE](http://www.sv2agw.com/ham/develop.htm) protocols what makes integration quite easy.

#Next steps#

We decided not to implement modem on our own but to use one of the available solutions. As a result the PWSat2 Ground Station was divided into two modules:

* pwsat-gs - the main application, responsible for presenting data, composing commands, etc. 
* [modem-connector](https://github.com/softwaremill/modem-connector) - a Scala wrapper on AGWPE protocol for soundmodem integration

The [modem-connector](https://github.com/softwaremill/modem-connector) is still in early stage but it was successfully tested with the [UZ7HO SoundModem](http://uz7.ho.ua/packetradio.htm). Now we are waiting for integration tests in clean room with a real satellite radio.

More details about the [modem-connector](https://github.com/softwaremill/modem-connector) implementation you can find at [the Softwarepassion blog﻿](http://www.softwarepassion.com/agwpe-protocol-based-modem-connector-library/) or at [GitHub](http://uz7.ho.ua/packetradio.htm) itself. The library was released under [Apache 2.0 License](https://github.com/softwaremill/modem-connector/blob/master/LICENSE).