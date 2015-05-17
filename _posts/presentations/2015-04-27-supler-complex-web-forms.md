---
layout: simple_presentation
title: Supler - complex web forms, not so complex
conference: Scalar/LJC
abstract_fragment: How can Supler help you to create complex web forms rapidly? 
keywords: scala, javascript, crud, form, supler, web
speaker: Adam Warski
speaker_login: adam_warski
categories:
- presentations
---

Let’s face it. Creating websites with complex forms is a pain, and usually ends in lots of code duplication and frustration. And even though it's the age of big data and microservices, form-based applications still take a large share of our development time. That’s why we have decided to create Supler, a Rapid Form Development library.

[Supler](https://github.com/softwaremill/supler) has a very focused set of functionality:

* a Scala DSL for defining forms, generating JSON form description, applying values to backing objects and running actions & validations on the backend
* a Javascript HTML form renderer, automatically-generated client-side validations, form templating and automatic reloading

You can use Supler with any Javascript frontend and Scala/Java backend framework, ORM layer, etc. The software stack is left entirerly to the developer.

The presentation will be entirely live coding. We will create a simple form-based application from scratch and gradually introduce various Supler features. At the same time, we will explain what approach Supler takes and how Supler solves some of the problems faced when creating a form-based applications.

<h4>Video: 30 minutes (Scalar)</h4>

<iframe width="560" height="315" src="https://www.youtube.com/embed/ex9H_pHdFZ4?list=PL8NC5lCgGs6N5_mHAx9LjOO1NBEADQ4cP" frameborder="0" allowfullscreen></iframe>

<h4>Video: 60 minutes (LJC)</h4>

<a href="https://skillsmatter.com/skillscasts/6342-supler-complex-web-forms-not-so-complex#video">View here</a>