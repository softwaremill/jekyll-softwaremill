---
layout: post
status: publish
published: true
title: Mobicents in production – Attikis from the inside
description: "Mobicents in production – Attikis from the inside"
keywords: "voip, web app, application, software"
author: Adam Warski
author_login: adam_warski
author_email: adam.warski@softwaremill.com
wordpress_id: 985
wordpress_url: https://softwaremill.com/?p=985
date: 2011-04-11 15:49:51.000000000 +02:00
categories:
- company
- Projects
tags: []
comments: []
---

<h6>Company news</h6>
<div class="post-header clearfix">
<figure><div class="image"><img src="https://softwaremill.com/wp-content/uploads/2013/08/warski.jpg" alt="Adam Warski"></div></figure><div class="title">
<h2 class="font-dark-blue font-normal">Mobicents in production – Attikis from the inside</h2>11 April, 2011 | <b>Adam Warski</b><br><br>
</div>
</div>
<div class="post-rows"><div class="text">
<p id="Postyarchiwalne-Mobicentsinproduction–Attikisfromtheinside">One of the main parts of the <a href="http://attikis.com/" rel="nofollow">Attikis</a> system is a VoIP module that services incoming alarms and outgoing voice mail. The module was built 100% based on an open-source project, <a href="http://mobicents.org/" rel="nofollow">Mobicents</a>. We used two components of Mobicents: <a href="http://www.mobicents.org/products_sip_servlets.html" rel="nofollow">Mobicents SIP Servlets</a> and <a href="http://www.mobicents.org/mms/mms-main.html" rel="nofollow">Mobicents Media Server</a>.</p>
<p>When <a href="http://attikis.com/" rel="nofollow">Attikis</a> gets an incoming connection, first it is intercepted by one of our SIP Servlets. Thanks to a cohesive application writing model, people with JEE experience have little problem starting work with SIP Servlets. And everything runs on the tried and tested <a href="http://jboss.org/jbossas" rel="nofollow">JBoss Application Server 5.1</a>. Next, the servlet decides what to do with the connection. Usually a session with the Media Server is started. Because both servers come from the same platform, they have no problems working together and their integration is very easy. Mobicents Media Server receives the alarm signal, parses it and sends it on for further processing.</p>
<p>SIP Servlets also serve outgoing connections, made in order to inform users about alarms that have been set off. The Mobicents platform includes a TTS (Text-To-Speech) engine, which works out very well in testing, but due to the quality of generated sound we decided to use a different solution.</p>
<p>Our general experience with Mobicents servers is very positive. First of all, the software is very well written. Moreover, the programmers working on the project are very helpful; if you have any problems you can ask on the forum. A significant factor is that the project is open-source, so it’s easy to apply patches where the need arises (for instance in the Attikis project we had to adapt tone recognition to the high requirements of alarm systems).</p>
<p>And the most important thing: the Mobicents servers on Attikis production environments have been performing stably and without significant problems for several months now.</p>
</div></div>
<div class="post-footer">Posted in Projects</div>
