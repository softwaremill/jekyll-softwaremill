---
layout: post
status: publish
published: true
title: ! 'Bootzooka Iteration 11: project rename and Jasmine tests visibility in TeamCity'
description: "Our open source project Bootzooka is a showcase application which can be used as a starting point for the development of any real application. It's developed in scala + angularjs + twitter bootstrap."
keywords: "open source, application, piotr buda, scala, angularjs, twitter bootstrap"
author: Tomasz Dziurko
author_login: tomasz_dziurko
author_email: dziurko@softwaremill.com
wordpress_id: 300
wordpress_url: https://softwaremill.com/?p=300
date: 2013-03-26 19:55:27.000000000 +01:00
categories:
- company
- Projects
tags: []
comments: []
---

<h6>Company news</h6>
<div class="post-header clearfix">
<figure><div class="image"><img src="https://softwaremill.com/wp-content/uploads/2013/04/dziurko.jpg" alt="Tomasz Dziurko"></div></figure><div class="title">
<h2 class="font-dark-blue font-normal">Bootzooka Iteration 11: project rename and Jasmine tests visibility in TeamCity</h2>26 March, 2013 | <b>Tomasz Dziurko</b><br><br>
</div>
</div>
<div class="post-rows">
<div class="text">
<p>So, as you probably already know, we have picked the winner in our “better name for Bootstrap” contest. Our beloved open source project is now called <strong>Bootzooka</strong>. So in this iteration the main visible change was to find every old name usage and replace it with Bootzooka. And as you can see below, everything, even <a href="http://bootzooka.softwaremill.com/">url</a> is now bootzooked <img alt=";)" src="http://softwaremill.pl/wp-includes/images/smilies/icon_wink.gif"></p>
</div>
<figure><img src="https://softwaremill.com/wp-content/uploads/2013/03/Bootzooka1.png" alt="Bootzooka Iteration 11: project rename and Jasmine tests visibility in TeamCity"></figure><div class="text">
<h2>Jasmine tests visible in TeamCity</h2>
<p>Another change, less visible to users, but very crucial for application developers is a small extension in <a href="https://github.com/guardian/sbt-jasmine-plugin">sbt jasmine tests runner</a> that allows to report results of JavaScript tests to TeamCity. With this feature our tests are listed next to Scala unit tests and we can check their status: failure or success without diving into build log:</p>
</div>
<figure><img src="https://softwaremill.com/wp-content/uploads/2013/03/Bootzooka2.png" alt="Bootzooka Iteration 11: project rename and Jasmine tests visibility in TeamCity"></figure><div class="text">
<h3>Plugin modification internals overview</h3>
<p>TeamCity has a very cool feature: when it executes each build, it also checks build log file for some specific patterns and then, when pattern is detected, TC executes corresponding action. In our case we are going to use “Reporting Tests” functionality (check <a href="http://confluence.jetbrains.com/display/TCD65/Build+Script+Interaction+with+TeamCity#BuildScriptInteractionwithTeamCity-ReportingTests">TC documentation</a> for more details) that allows to add information about executed tests. So what our plugin extension will do on each test start, failure, success and finish is to print specific string to the build log so TC could detect it.</p>
<h3>Implementation details</h3>
<p>Now, when we know what should be done, the only thing left is the actual implementation. The first problem is to find the way to execute specific action on different test events. Luckily Jasmine has <a href="http://pivotal.github.com/jasmine/jsdoc/symbols/jasmine.JsApiReporter.html">JsApiReporter</a> with methods suited exactly to our needs.</p>
<pre>

<div class="codecolorer-container javascript railscasts" style="overflow:auto;white-space:nowrap;width:480px;"><table cellspacing="0" cellpadding="0"><tbody><tr>
<td class="line-numbers"><div>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>
</div></td>
<td><div class="javascript codecolorer">reportRunnerStarting<span class="sy0">:</span> <span class="kw2">function</span><span class="br0">(</span>runner<span class="br0">)</span> <span class="br0">{</span><br>
  <span class="co1">// here we will print test suite started message</span><br><span class="br0">}</span><span class="sy0">,</span><br>
 <br>
reportRunnerResults<span class="sy0">:</span> <span class="kw2">function</span><span class="br0">(</span>runner<span class="br0">)</span> <span class="br0">{</span><br>
  <span class="co1">// here we will print test suite finished message</span><br><span class="br0">}</span><span class="sy0">,</span><br>
 <br>
reportSpecResults<span class="sy0">:</span> <span class="kw2">function</span><span class="br0">(</span>spec<span class="br0">)</span> <span class="br0">{</span><br>
  <span class="co1">// here we will print:</span><br>
  <span class="co1">// 1. test started message</span><br>
  <span class="co1">// 2. if(test.passed) {</span><br>
  <span class="co1">//   print test passed message</span><br>
  <span class="co1">// } else {</span><br>
  <span class="co1">//   print test failed message with description of the problem</span><br>
  <span class="co1">// }</span><br>
  <span class="co1">// 3. test finished message</span><br><span class="br0">}</span>
</div></td>
</tr></tbody></table></div>

</pre>
<p>Next thing is to inform Jasmine tests runner that our custom reporter exists and wants to be notified about test execution events. This can be achieved pretty easily with this one-liner:</p>
<pre>

<div class="codecolorer-container javascript railscasts" style="overflow:auto;white-space:nowrap;width:480px;"><table cellspacing="0" cellpadding="0"><tbody><tr>
<td class="line-numbers"><div>1<br>
</div></td>
<td><div class="javascript codecolorer">jasmine.<span class="me1">getEnv</span><span class="br0">(</span><span class="br0">)</span>.<span class="me1">addReporter</span><span class="br0">(</span><span class="kw2">new</span> TeamCityReporter<span class="br0">(</span><span class="br0">)</span><span class="br0">)</span><span class="sy0">;</span>
</div></td>
</tr></tbody></table></div>

</pre>
<p>After that everything is more or less ready. If you want to see full commit with this extension, please check our <a href="https://github.com/softwaremill/sbt-jasmine-plugin/commit/cb1592a59025e1e5222464a3ec511f9c37abe2b2">company Github</a>. We have also created a pull request to the original sbt-jasmine-plugin project and maybe it will be merged into the core.</p>
<h3>How it looks in Bootzooka</h3>
<p>After we replaced original sbt-jasmine-plugin with our custom made solution, all Jasmine tests are listed as a separate test suite:</p>
</div>
<figure><img src="https://softwaremill.com/wp-content/uploads/2013/03/Bootzooka3.png" alt="Bootzooka Iteration 11: project rename and Jasmine tests visibility in TeamCity"></figure><div class="text">
<p>And when any tests fail, we could see what went wrong without examining build log file:</p>
</div>
<figure><img src="https://softwaremill.com/wp-content/uploads/2013/03/Bootzooka4.png" alt="Bootzooka Iteration 11: project rename and Jasmine tests visibility in TeamCity"></figure><div class="text">
<h3>Summary</h3>
<p>As you can see, Bootzooka is constantly growing and evolving. You can always check its live demo on <a href="http://bootzooka.softwaremill.com/">bootzooka.softwaremill.com</a>, browse source code on <a href="https://github.com/softwaremill/bootzooka">GitHub</a> or subscribe to <a href="http://softwaremill.pl/feed">our RSS</a> to keep in touch with latest news.</p>
</div>
</div>
<div class="post-footer">Posted in Projects</div>
