---
layout: post
status: publish
published: true
title: ! 'Bootstrap Development Report: Iteration 7'
author: Piotr Buda
author_login: piotr_buda
author_email: buda@softwaremill.com
wordpress_id: 316
wordpress_url: https://softwaremill.com/?p=316
date: 2013-02-05 21:11:41.000000000 +01:00
categories:
- company
- Projects
tags: []
comments: []
---

<h6>Company news</h6>
<div class="post-header clearfix">
<figure><div class="image"><img src="https://softwaremill.com/wp-content/uploads/2013/04/buda.jpg" alt="Piotr Buda"></div></figure><div class="title">
<h2 class="font-dark-blue font-normal">Bootstrap Development Report: Iteration 7</h2>05 February, 2013 | <b>Piotr Buda</b><br><br>
</div>
</div>
<div class="post-rows">
<div class="text">
<h3><strong>Overview</strong></h3>
<p>We just started a new iteration and it’s a great moment to share what we were able to develop during the last one. The biggest introduced feature is a brand new Profile page where login, e-mail and password are all changeable. To access the Profile page user has to be logged in and click on the “Logged in as” link.</p>
</div>
<figure><img src="https://softwaremill.com/wp-content/uploads/2013/05/SoftwareMill_Bootzooka.png" alt="Bootstrap Development Report: Iteration 7"></figure><div class="text">
<h3><strong>Custom AngularJS directives</strong></h3>
<p>There was a need for two custom AngularJS directives to handle profile changes.</p>
<p>The first one is called bsBlur and it’s a simple directive that wraps blur event and triggers some action. We use it in basic Profile edition – change your login and click somewhere beside the input, your data is saved! It has been introduced in <a href="https://github.com/softwaremill/bootzooka/commit/c9e52fdacec528e45a8b77b13f2118ceaaa23aef">this commit.</a></p>
<p>Another directive is something we called repeatPassword. In a few places around Bootstrap we have password fields that require repetition: during registration, password recovery and now password change form Profile page. To ease up on the need to implement some custom validation in all these places this directive was introduced in <a href="https://github.com/softwaremill/bootzooka/commit/515d289ddea2159b8c3eaa956cdfb658898b5358">this commit</a>. Some technical blog post is in preparation describing how this was achieved.</p>
<h3><strong>Secured areas</strong></h3>
<p>The new Profile page should only be visible to authenticated users. In order to achieve this, we introduced another new feature that will automatically redirect unauthenticated users trying to enter secured zones to login page.</p>
<p>To make it work, it’s important to place partials that are used to render secured pages in directory called ‘secured’. Authenticated users will be taken directly to the requested page, however those unauthenticated will be redirected to the login page. After successful log in, user is taken to the originally requested page. This feature was introduced in <a href="https://github.com/softwaremill/bootzooka/commit/31a1fba9148d82a451bc4c34878c8abf07445dd5">this commit </a>and later enhanced in <a href="https://github.com/softwaremill/bootzooka/commit/d9abf1063308931b8c05299607eb68cf5b1fabba">this one</a>. It still misses some fancy features but I hope it will be enhanced as time goes by.</p>
<h3><strong>Plans for Iteration 8</strong></h3>
<p>Iteration 8 will be mainly focused on integration testing. We’ll be introducing automated UI tests to the build. They are written using<a href="http://jnicklas.github.com/capybara/">Capybara</a> and we hope to demonstrate how you can test your JVM apps using it. Other integration tests include testing the mechanism of sending various e-mails to the users.</p>
<p>So stay tuned and check out <a href="https://github.com/softwaremill/bootzooka">SML Bootstrap project at GitHub</a>!</p>
<h3><strong>Bootstrap needs a new name</strong></h3>
<p>In the meantime, we are looking for a new name for this project and you can take part in a contest and win a T-shirt with our comic character – Millkovski.</p>
<p>Check the contest here: <a href="http://softwaremill.com/help-us-find-a-better-name-for-bootstrap">softwaremill.com/contest</a></p>
</div>
</div>
<div class="post-footer">Posted in Projects</div>
