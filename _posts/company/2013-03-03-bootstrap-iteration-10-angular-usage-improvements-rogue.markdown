---
layout: post
status: publish
published: true
title: ! 'Bootstrap Iteration 10: Angular usage improvements, Rogue'
description: "Our open source project Bootzooka is a showcase application which can be used as a starting point for the development of any real application. It's developed in scala + angularjs + twitter bootstrap."
keywords: "open source, bootzooka, application, scala, angularjs, twitter bootstrap"
author: Adam Warski
author_login: adam_warski
author_email: adam.warski@softwaremill.com
wordpress_id: 355
wordpress_url: /?p=355
date: 2013-03-03 21:06:29.000000000 +01:00
categories:
- company
- Projects
tags: []
comments: []
---
<p>[cc lang='abap' ][/cc][cc lang='actionscript3' ][/cc][cc lang='abap' ][/cc][cc lang='actionscript3' ][/cc][cc lang='abap' ][/cc][cc lang='abap' ][/cc][cc lang='java' ][/cc][cc lang='abap' ][/cc][cc lang='javascript' ][/cc]</p>
<h6>Company news</h6>
<div class="post-header clearfix">
<figure><div class="image"><img src="/img/members/warski.jpg" alt="Adam Warski"></div></figure><div class="title">
<h2 class="font-dark-blue font-normal">Bootstrap Iteration 10: Angular usage improvements, Rogue</h2>03 March, 2013 | <b>Adam Warski</b><br><br>
</div>
</div>
<div class="post-rows">
<div class="text">
<h2>Overview</h2>
<p>Here we are again! <a href="https://github.com/softwaremill/bootzooka">Bootstrap</a> is evolving and a new contributor, Krzysztof Ciesielski, joined our ranks! This iteration was a technical one but very interesting at the same time. Highlights of the changes:</p>
<ul>
<li>better Angular files layout</li>
<li>testing Angular directives (= testing DOM manipulation!)</li>
<li>migrating from Salat to Lift Record + Rogue</li>
</ul>
<p>Read on to find out the details.</p>
<h2>Rearrangement in UI module</h2>
<p>Recently Brian Ford from Google, a developer working on AngularJS, <a href="http://briantford.com/blog/huuuuuge-angular-apps.html">blogged</a> about his recommendations on how to structure non-trivial Angular applications. As the Bootstrap project reaches greater maturity, it was a perfect opportunity to compare its layout and conventions to those proposed by the author. After a short research we decided to apply the following updates.</p>
<h3>Redistribution of files and directories</h3>
<p>All the controllers, services, directives and filters have been extracted to separate files, which feels quite natural in a growing project. Additionaly we divided all the javascripts files into folders representing these ‘layers’, here’s a sneak peek into this new layout:</p>
</div>
<figure><img src="https://softwaremill.com/img/uploads/2013/03/new-layout.gif" alt="Bootstrap Iteration 10: Angular usage improvements, Rogue"></figure><div class="text">
<h3>Reorganization of Angular modules</h3>
<p>The concept of ‘module’ in Angular’s sense can be leveraged to split code into logical ‘contexts’:</p>
<ul>
<li>entries (everything that’s related to entries)</li>
<li>profile (user logon, registration, profile update, password recovery)</li>
<li>maintenance (server uptime recording)</li>
<li>session (user session and security concerns)</li>
<li>directives</li>
<li>filters</li>
</ul>
<p>Further expansion of directives and filters should also result in putting these items in their respective modules.</p>
<h3>Exploring more awesomeness of Angular directives</h3>
<p><a href="http://piotrbuda.eu/2013/02/angularjs-directive-for-password-matching.html">Piotr’s recent blogpost</a> about directives illustrates how powerful they can be. I highly recommend that you check it out if you haven’t yet done so. In this iteration we would like to show how you can effectively unit test custom directives. If you thought that “it’s DOM manipulation and cannot be tested” then take a look at this example:</p>
<p><em>Testing AngularJS directives</em></p>
<pre>

<div class="codecolorer-container javascript railscasts" style="overflow:auto;white-space:nowrap;width:480px;height:300px;"><table cellspacing="0" cellpadding="0"><tbody><tr>
<td class="line-numbers"><div>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20<br>21<br>22<br>23<br>24<br>25<br>26<br>27<br>28<br>29<br>30<br>31<br>32<br>33<br>
</div></td>
<td><div class="javascript codecolorer">beforeEach<span class="br0">(</span>inject<span class="br0">(</span><span class="kw2">function</span> <span class="br0">(</span>$rootScope<span class="sy0">,</span> $compile<span class="br0">)</span> <span class="br0">{</span><br>
       elm <span class="sy0">=</span> angular.<span class="me1">element</span><span class="br0">(</span><br>
           <span class="st0">'&lt;/pre&gt;<br>
&lt;form name="registerForm" novalidate=""&gt;'</span> <span class="sy0">+</span> <span class="st0">'&lt;input type="password" name="password" /&gt;'</span> <span class="sy0">+</span> <span class="st0">'&lt;input type="password" name="repeatPassword" /&gt;'</span> <span class="sy0">+</span> <span class="st0">'&lt;/form&gt;<br>
&lt;pre&gt;'</span><span class="br0">)</span><br>
       scope <span class="sy0">=</span> $rootScope<span class="sy0">;</span><br>
       scope.<span class="me1">model</span> <span class="sy0">=</span> <span class="br0">{</span> password1<span class="sy0">:</span> <span class="kw2">null</span><span class="sy0">,</span> password2<span class="sy0">:</span> <span class="kw2">null</span><span class="br0">}</span><span class="sy0">;</span><br>
       $compile<span class="br0">(</span>elm<span class="br0">)</span><span class="br0">(</span>scope<span class="br0">)</span><span class="sy0">;</span><br>
       scope.$digest<span class="br0">(</span><span class="br0">)</span><span class="sy0">;</span><br>
       form <span class="sy0">=</span> scope.<span class="me1">registerForm</span><span class="sy0">;</span><br>
   <span class="br0">}</span><span class="br0">)</span><span class="br0">)</span><span class="sy0">;</span><br>
 <br>
   it<span class="br0">(</span><span class="st0">'should be valid initially'</span><span class="sy0">,</span> <span class="kw2">function</span> <span class="br0">(</span><span class="br0">)</span> <span class="br0">{</span><br>
       expect<span class="br0">(</span>form.<span class="me1">password</span>.$valid<span class="br0">)</span>.<span class="me1">toBe</span><span class="br0">(</span><span class="kw2">true</span><span class="br0">)</span><span class="sy0">;</span><br>
       expect<span class="br0">(</span>form.<span class="me1">repeatPassword</span>.$valid<span class="br0">)</span>.<span class="me1">toBe</span><span class="br0">(</span><span class="kw2">true</span><span class="br0">)</span><span class="sy0">;</span><br>
   <span class="br0">}</span><span class="br0">)</span><span class="sy0">;</span><br>
 <br>
   it<span class="br0">(</span><span class="st0">'should set model to valid after setting two matching passwords'</span><span class="sy0">,</span> <span class="kw2">function</span> <span class="br0">(</span><span class="br0">)</span> <span class="br0">{</span><br>
       <span class="co1">// when</span><br>
       form.<span class="me1">password</span>.$setViewValue<span class="br0">(</span><span class="st0">'pass123'</span><span class="br0">)</span><span class="sy0">;</span><br>
       form.<span class="me1">repeatPassword</span>.$setViewValue<span class="br0">(</span><span class="st0">'pass123'</span><span class="br0">)</span><span class="sy0">;</span><br>
       <span class="co1">// then</span><br>
       expect<span class="br0">(</span>form.<span class="me1">password</span>.$valid<span class="br0">)</span>.<span class="me1">toBe</span><span class="br0">(</span><span class="kw2">true</span><span class="br0">)</span><span class="sy0">;</span><br>
       expect<span class="br0">(</span>form.<span class="me1">repeatPassword</span>.$valid<span class="br0">)</span>.<span class="me1">toBe</span><span class="br0">(</span><span class="kw2">true</span><span class="br0">)</span><span class="sy0">;</span><br>
   <span class="br0">}</span><span class="br0">)</span><span class="sy0">;</span><br>
 <br>
   it<span class="br0">(</span><span class="st0">'should set model to invalid after setting only first input'</span><span class="sy0">,</span> <span class="kw2">function</span> <span class="br0">(</span><span class="br0">)</span> <span class="br0">{</span><br>
       <span class="co1">// when</span><br>
       form.<span class="me1">password</span>.$setViewValue<span class="br0">(</span><span class="st0">'pass123'</span><span class="br0">)</span><span class="sy0">;</span><br>
       <span class="co1">// then</span><br>
       expect<span class="br0">(</span>form.<span class="me1">password</span>.$valid<span class="br0">)</span>.<span class="me1">toBe</span><span class="br0">(</span><span class="kw2">true</span><span class="br0">)</span><span class="sy0">;</span><br>
       expect<span class="br0">(</span>form.<span class="me1">repeatPassword</span>.$valid<span class="br0">)</span>.<span class="me1">toBe</span><span class="br0">(</span><span class="kw2">false</span><span class="br0">)</span><span class="sy0">;</span><br>
   <span class="br0">}</span><span class="br0">)</span><span class="sy0">;</span>
</div></td>
</tr></tbody></table></div>

</pre>
<p>In the given example, we prepare a html template using our directive and bind it to test model. Then we use Angular’s $compile() function to process it. Now we can verify the form’s behavior in different conditions. The test cases are expressive and concise, which is not common when it comes to javascript, especially DOM manipulations. See <a href="https://github.com/softwaremill/bootzooka/blob/master/bootzooka-ui/src/test/unit/specs/directives/bsRepeatPassword-spec.js">the full code on Github</a>. I also highly recommend that you check out <a href="http://www.youtube.com/watch?v=rB5b67Cg6bc">this video</a> where Vojta Jina explores more great examples.</p>
<h3>Run your tests from IDEA!</h3>
<p>Last but not least: we added additional configuration file allowing you to run javascript unit tests directly from the IDE. This means even more instant feedback and quite a nice productivity boost. More details on how to setup and execute such tests can be found on<a href="http://abstractionextraction.wordpress.com/2013/02/13/testing-angularjs-apps-in-intellij-idea-with-jstestdriver/">Krzysiek’s blog</a>.</p>
<h2>Migrating from Salat to Rogue</h2>
<p>The persistence layer of Bootstrap was composed of <a href="https://github.com/mongodb/casbah">Casbah</a> (the MongoDB driver for Scala) and <a href="https://github.com/novus/salat">Salat</a> (provides serialization of case classes). The DAO code written using this combination proved to be degrading in readability over time. Luckily, Scala provides great tools to create DSLs and that’s exactly what guys at Foursquare did; they’ve built a DSL for queries on MongoDB: <a href="https://github.com/foursquare/rogue/">Rogue</a>.</p>
<p>Nothing is as good as some examples, so here is how you’d normally implement a DAO method using Casbah/Salat:</p>
<p><em>Sample DAO implementation</em></p>
<pre>

<div class="codecolorer-container javascript railscasts" style="overflow:auto;white-space:nowrap;width:480px;"><table cellspacing="0" cellpadding="0"><tbody><tr>
<td class="line-numbers"><div>1<br>2<br>3<br>4<br>5<br>
</div></td>
<td><div class="javascript codecolorer">
<span class="kw2">class</span> MongoUserDAO<span class="br0">(</span>implicit val mongo<span class="sy0">:</span> MongoDB<span class="br0">)</span> <span class="kw2">extends</span> SalatDAO<span class="br0">[</span>User<span class="sy0">,</span> ObjectId<span class="br0">]</span><span class="br0">(</span>mongo<span class="br0">(</span><span class="st0">"users"</span><span class="br0">)</span><span class="br0">)</span> <span class="kw1">with</span> UserDAO <span class="br0">{</span><br>
  def changeLogin<span class="br0">(</span>currentLogin<span class="sy0">:</span> String<span class="sy0">,</span> newLogin<span class="sy0">:</span> String<span class="br0">)</span> <span class="br0">{</span><br>
    update<span class="br0">(</span>MongoDBObject<span class="br0">(</span><span class="st0">"login"</span> <span class="sy0">-&amp;</span>gt<span class="sy0">;</span> currentLogin<span class="br0">)</span><span class="sy0">,</span> $set<span class="br0">(</span><span class="st0">"login"</span> <span class="sy0">-&amp;</span>gt<span class="sy0">;</span> newLogin<span class="sy0">,</span> <span class="st0">"loginLowerCased"</span> <span class="sy0">-&amp;</span>gt<span class="sy0">;</span> newLogin.<span class="me1">toLowerCase</span><span class="br0">)</span><span class="sy0">,</span> <span class="kw2">false</span><span class="sy0">,</span> <span class="kw2">false</span><span class="sy0">,</span> WriteConcern.<span class="me1">Safe</span><span class="br0">)</span><br>
  <span class="br0">}</span><br><span class="br0">}</span>
</div></td>
</tr></tbody></table></div>

</pre>
<p>Such updates don’t look particularily well. First of all, parameters are maps with string keys – what happens when you refactor a field name in your case class? You either change all those string occurences by yourself or with help of the IDE. This is error prone, as sometimes you don’t want to check each occurence of such a string in the project.</p>
<p>Secondly the ‘$’ functions look very technical and degrade readibility even further. Sure, they look like original Mongo operators, but why should we pollute our code with such ‘low level’ technicals?</p>
<h3>Rogue to the rescue</h3>
<p>Rogue alleviates all those drawbacks and provides a type-safe DSL. This is nice! Now when you change a field in a class, compilation will fail if you forget to change it in your queries; but of course usually IDE refactorings do the job for you. Nice thing about DSLs is that they provide great readability. Previously quoted DAO can now be changed to the following code:</p>
<p><em>DAO with Rogue</em></p>
<pre>

<div class="codecolorer-container javascript railscasts" style="overflow:auto;white-space:nowrap;width:480px;"><table cellspacing="0" cellpadding="0"><tbody><tr>
<td class="line-numbers"><div>1<br>2<br>3<br>4<br>5<br>
</div></td>
<td><div class="javascript codecolorer">
<span class="kw2">class</span> MongoUserDAO <span class="kw2">extends</span> UserDAO <span class="br0">{</span><br>
  def changeLogin<span class="br0">(</span>currentLogin<span class="sy0">:</span> String<span class="sy0">,</span> newLogin<span class="sy0">:</span> String<span class="br0">)</span> <span class="br0">{</span><br>
    UserRecord where <span class="br0">(</span>_.<span class="me1">login</span> eqs currentLogin<span class="br0">)</span> modify <span class="br0">(</span>_.<span class="me1">login</span> setTo newLogin<span class="br0">)</span> and <span class="br0">(</span>_.<span class="me1">loginLowerCase</span> setTo newLogin.<span class="me1">toLowerCase</span><span class="br0">)</span> updateOne<span class="br0">(</span><span class="br0">)</span><br>
  <span class="br0">}</span><br><span class="br0">}</span>
</div></td>
</tr></tbody></table></div>

</pre>
<p>There is a little problem with Rogue though as it uses Lift MongoDB Record which exposes the Active Record pattern. While there are many views on whether Active Record is good or bad, personally I don’t like this pattern. So to satisfy current DAO interfaces an object decoupling domain object from the Lift Record has been introduced. The UserRecord object you can see in the above example is a Lift Record whereas implicits are used to convert between User and UserRecord objects.</p>
<pre>

<div class="codecolorer-container javascript railscasts" style="overflow:auto;white-space:nowrap;width:480px;height:300px;"><table cellspacing="0" cellpadding="0"><tbody><tr>
<td class="line-numbers"><div>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20<br>21<br>22<br>23<br>24<br>25<br>26<br>27<br>28<br>
</div></td>
<td><div class="javascript codecolorer">
<span class="kw2">class</span> MongoUserDAO <span class="kw2">extends</span> UserDAO <span class="br0">{</span><br><span class="kw2">import</span> UserImplicits._<br>
 <br>
  def load<span class="br0">(</span>userId<span class="sy0">:</span> String<span class="br0">)</span><span class="sy0">:</span> Option<span class="br0">[</span>User<span class="br0">]</span> <span class="sy0">=</span> <span class="br0">{</span><br>
    UserRecord where <span class="br0">(</span>_.<span class="me1">id</span> eqs <span class="kw2">new</span> ObjectId<span class="br0">(</span>userId<span class="br0">)</span><span class="br0">)</span> get<span class="br0">(</span><span class="br0">)</span><br>
  <span class="br0">}</span><br>
 <br>
  <span class="kw2">private</span> object UserImplicits <span class="br0">{</span><br>
    implicit def fromRecord<span class="br0">(</span>user<span class="sy0">:</span> UserRecord<span class="br0">)</span><span class="sy0">:</span> User <span class="sy0">=</span> <span class="br0">{</span><br>
      User<span class="br0">(</span>user.<span class="me1">id</span>.<span class="me1">get</span><span class="sy0">,</span> user.<span class="me1">login</span>.<span class="me1">get</span><span class="sy0">,</span> user.<span class="me1">loginLowerCase</span>.<span class="me1">get</span><span class="sy0">,</span> user.<span class="me1">email</span>.<span class="me1">get</span><span class="sy0">,</span> user.<span class="me1">password</span>.<span class="me1">get</span><span class="sy0">,</span> user.<span class="me1">salt</span>.<span class="me1">get</span><span class="sy0">,</span> user.<span class="me1">token</span>.<span class="me1">get</span><span class="br0">)</span><br>
    <span class="br0">}</span><br>
 <br>
    implicit def fromOptionalRecord<span class="br0">(</span>userOpt<span class="sy0">:</span> Option<span class="br0">[</span>UserRecord<span class="br0">]</span><span class="br0">)</span><span class="sy0">:</span> Option<span class="br0">[</span>User<span class="br0">]</span> <span class="sy0">=</span> <span class="br0">{</span><br>
      userOpt.<span class="me1">map</span><span class="br0">(</span>fromRecord<span class="br0">(</span>_<span class="br0">)</span><span class="br0">)</span><br>
    <span class="br0">}</span><br>
 <br>
    implicit def toRecord<span class="br0">(</span>user<span class="sy0">:</span> User<span class="br0">)</span><span class="sy0">:</span> UserRecord <span class="sy0">=</span> <span class="br0">{</span><br>
      UserRecord.<span class="me1">createRecord</span><br>
        .<span class="me1">id</span><span class="br0">(</span>user.<span class="me1">id</span><span class="br0">)</span><br>
        .<span class="me1">login</span><span class="br0">(</span>user.<span class="me1">login</span><span class="br0">)</span><br>
        .<span class="me1">loginLowerCase</span><span class="br0">(</span>user.<span class="me1">loginLowerCased</span><span class="br0">)</span><br>
        .<span class="me1">email</span><span class="br0">(</span>user.<span class="me1">email</span><span class="br0">)</span><br>
        .<span class="me1">password</span><span class="br0">(</span>user.<span class="me1">password</span><span class="br0">)</span><br>
        .<span class="me1">salt</span><span class="br0">(</span>user.<span class="me1">salt</span><span class="br0">)</span><br>
        .<span class="me1">token</span><span class="br0">(</span>user.<span class="me1">token</span><span class="br0">)</span><br>
    <span class="br0">}</span><br>
  <span class="br0">}</span><br><span class="br0">}</span>
</div></td>
</tr></tbody></table></div>

</pre>
<p>This proved to be working nicely, although some additional code has to be written. Stay tuned for a post describing this pattern in detail.</p>
<p>You can view, clone &amp; fork the whole project at GitHub: <a href="https://github.com/softwaremill/bootzooka">https://github.com/softwaremill/bootzooka</a></p>
</div>
</div>
<div class="post-footer">Posted in Projects</div>
