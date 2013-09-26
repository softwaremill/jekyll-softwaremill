---
layout: post
status: publish
published: true
title: Monitor anything (with JBison)
author: Adam Warski
author_login: adam_warski
author_email: adam.warski@softwaremill.com
wordpress_id: 193
wordpress_url: https://softwaremill.com/?p=193
date: 2013-03-05 11:35:17.000000000 +01:00
categories:
- company
- Projects
- JBison
tags: []
comments: []
---

<h6>Company news</h6>
<div class="post-header clearfix">
<figure><div class="image"><img src="https://softwaremill.com/wp-content/uploads/2013/08/warski.jpg" alt="Adam Warski"></div></figure><div class="title">
<h2 class="font-dark-blue font-normal">Monitor anything (with JBison)</h2>05 March, 2013 | <b>Adam Warski</b><br><br>
</div>
</div>
<div class="post-rows">
<div class="text">
<p>We have recently released a new version of <a href="https://www.jbison.com/">JBison (https://jbison.com)</a>, our software-as-a-service web&amp;application monitoring website.</p>
<p>The highlight of this release are the so-called “JSON monitors”. What can you monitor with them? Basically – anything. JSON monitors allow to monitor an arbitrary metric of your application in three easy steps, with minimal setup.</p>
<p>How is that possible? First you need to expose, as a flat JSON map, the custom metrics that you would like to be monitored. There are no constraints as to the keys or values; you can have entries for free memory, task queue size, status of a link to a third party service, etc. The JSON can be publicly available, or firewalled but you will have to let JBison in (see the <a href="https://jbison.com/faq.html">FAQ</a>). At the same time you can use HTTP authentication to secure access to the JSON. Example:</p>
<pre>GET http://betterfacebook.com/monitoring/status.json { "mail_queue_size": 91, "shipping_queue_size": 182, "since_last_import_seconds": 1086, "system_status": "ok", "free_memory_mb": 1024 }</pre>
<p>Next, you need to login to JBison, and go to the “Add a new monitor” page. There you have to point JBison to the JSON, and define the constraints:</p>
</div>
<figure><img src="https://softwaremill.com/wp-content/uploads/2013/03/2013-02-28_2020.png" alt="Monitor anything (with JBison)"></figure><div class="text">
<p>And that’s it! When the monitor is saved, the given constraints will be checked every 5 minutes. If any constraint is broken, you will be immediately notified by e-mail. That way, any custom metric can be easily monitored. Moreover all numeric metrics will be graphed, giving you an overview of how the values change during the last day.</p>
<p>Apart from the new JSON monitors, JBison also offers other types of monitors, such as “Ping” for monitoring a webpage (either just the response time or if it contains specified content).</p>
<p>Developing quite a lot of software ourselves, we often needed the custom metric monitoring functionality, but didn’t manage to find an online service which would offer such features. The JSON monitors in JBison have already proven very useful in our projects, and we hope that you will find them useful as well.</p>
<p>During the beta period, the service is free, so don’t hesitate and create an account – it’s really simple. And as always, as we are further developing <a href="https://jbison.com/">JBison</a>, any feedback will be highly appreciated!</p>
<p>Signup for free at: <a href="https://jbison.com/">https://jbison.com/</a>.</p>
</div>
</div>
<div class="post-footer">Posted in JBison, Projects</div>
