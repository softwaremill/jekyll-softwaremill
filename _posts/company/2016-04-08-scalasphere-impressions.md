---
title: Impressions after ScalaSphere
description: Summary of and comments on a unique Scala conference
author: Mikołaj Koziarkiewicz
author_login: mikolaj_koziarkiewicz
categories:
- scala
- conference
- company
layout: simple_post
---
[ScalaSphere](http://scalasphere.org/) by [VirtusLab](http://virtuslab.com/) happened well over one-and-a-half months ago, so it's high time for some sort of summary.

A "DevTools Summit" is an uncommon theme for a conference. Typically, tooling presentation given during programming-related
 events focus on the "shiny-shiny", i.e. user-facing, prominent features. ScalaSphere aimed at providing a more holistic
 view of various tools, featuring a pronounced focus on the tool developer's perspective.
 
Before we get into the details, let me dispel a probable misconception about the subject matter - in the context of topics presented, 
"tools" was not a synonym for "IDEs". Rather, the talks covered a wide variety of meta level technologies and concepts, 
from learning environments, through IDEs, to license models.

The agenda can be found on the [conference's website](http://scalasphere.org/#agenda) (along with slides and recordings). That being given, 
I will list several subjectively more intriguing highlights.

Matthias Langer shared his experiences during [_The Scala Refactoring Library: Problems and Perspectives_](https://youtu.be/Josjt_awx08), providing a very representative set of examples 
  of problems that refactoring lib developer must deal with, especially in a language as syntactically and semantically complex as Scala.

Eugene Burmako's immediately following up [_What we learned in scala.meta?_](https://youtu.be/zuBAOktT938) tied in nicely with the theme of its predecessor, going down to the language design level. 
Included was a very valuable discussion of various problems that crop up when dealing with the high (syntactic sugar)/low level representation mismatch. 

Rory Graves, in [_Scalanator.io - Building a training platform on compiler tools_](https://youtu.be/13uf7hHh-BQ), had announced a new Scala learning tool initiative. Apart from said announcement, the talk 
 included an interesting overview of design and implementation choices during the creation of such a platform.

Sam Halliday refreshed everyone's memory on the oft-neglected topic of OS licensing in [_How to be Free, Libre and Open Source_](https://youtu.be/6pEQ4xT1LMQ). The talk also discussed several important legal
  aspects of various licensing schemes, so if you just spam GPL or BSD into your projects, I very much recommend taking a look at it (even forgiving [being coerced to speak German](https://www.youtube.com/watch?v=6pEQ4xT1LMQ&feature=youtu.be&t=700)).

Lukas Wegmann's [_Scaps – Type-directed API Search for Scala_](http://scalasphere.org/speaker/lukas-wegmann/) is still in the early stages of development, but looks very promising in the context of addressing Scala's perennial
  problem of API discoverability.

Alexandre Archambault presented his Scala-native tool in [_Easy dependency management with coursier_](https://youtu.be/rNiwFxF_T98). The improved resolution features, and the impressive processing speed were certainly a sight to behold.

Additionally, several talks provided an intriguing sneak peak into the internals of the currently dominant IDEs - ENSIME, Scala IDE and IntelliJ's Scala plugin.

In general, the quality of talks remained solid throughout, and - despite being unfortunately pre-fatigued while attending the conference - I found no problem with following the talks, nor maintaining an interest during any of them.

Organizationally speaking, everything was well. The logistics were well prepared and executed, especially for a first edition of a conference.

I can definitely say that the conference was a success, recommend to check out [the videos](http://scalasphere.org/#agenda), and keep a lookout for a future installment.