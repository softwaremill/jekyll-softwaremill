---
layout: simple_presentation
title: The ideal module system and the harsh reality
conference: Devoxx 2013, Belgium
abstract_fragment: I'd like to show two approaches to solving problem with modularity in Java/Scala applications. One is Veripacks, a library which verifies transitive module-related annotations. Second is the module system in Ceylon.
keywords: scala, ceylon, veripacks, osgi
speaker: Adam Warski
speaker_login: adam_warski
categories:
- presentations
---

I think most of us will agree that modularity is a Good Thing. However, while it is possible to create nice
modular applications, current languages do not offer a lot of tools that would make this task easier.
Hence we'll start by creating a (subjective) list of requirements for an "ideal" module system, just
to know how much more work is needed.

Then we will take a look at Java packages. We usually think about packages in a hierarchical way, yet
they are treated by tools as simple identifiers. We use them for scoping, but Java only supports
package-private scope. We could use them as a module system, but we create build modules instead.

I'd like to show two approaches to solving this problem. One is Veripacks, a Java/Scala library which
verifies transitive module-related annotations. Second is the module system in Ceylon, where modularity
is one of the main features of the language. I'll also compare with OSGi, and show how it differs.

<h4>Slides</h4>
<iframe src="https://www.slideshare.net/slideshow/embed_code/28292352" width="427" height="356" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC;border-width:1px 1px 0;margin-bottom:5px" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="https://www.slideshare.net/adamw1pl/the-ideal-module-system-and-the-harsh-reality" title="The ideal module system and the harsh reality" target="_blank">The ideal module system and the harsh reality</a> </strong></div>
