---
title: Gems of SBT
description: Some of the most exceptional features of SBT.
author: Krzysztof Ciesielski
author_login: ciesielski
categories:
- scala
- reactive
- company
layout: simple_post
---

Recently in SoftwareMill we started a series of weekly online meetings around the reading club - a new idea by [Marcin](https://marcinkubala.wordpress.com/). For our first book we chose [“SBT in Action”](http://www.manning.com/suereth2/) (MEAP v15) by Joshua Suereth and Matthew Farwell. The idea worked perfectly, we are now starting our next book and more engineers from the company are joining the club.  

The learning curve of SBT has a pretty bad reputation and many developers find it difficult to switch from Maven/Gradle to its core concepts right away. The book explains all the important features and also reveals some really excellent advantages of this build tool. However, sometimes we found these gems to be easy to miss, insufficiently emphasized and a bit hidden between less exciting instructions about standard features. During the course of our reading club, we tried to note down what we found particularly interesting in SBT:

## Parallel task execution
This one is often mentioned as one of the main advantages. In SBT you have to specify explicit dependencies between your tasks. This allows SBT to build a dependency tree of all the tasks and decide whether certain tasks can be executed in parallel, because there is no dependency between them. This is the default behaviour and it can really speed up your build.

## Running tasks for multiple Scala versions
If you want your project to be built against more than one Scala version, you can define them in your build.sbt:
`crossScalaVersions := Seq(“2.10.5”, “2.11.6”)`
Now, in the SBT console, you can type `+package` and watch SBT run this tasks for all the defined versions. This simple `+` shortcut is really handy, especially when it comes to publishing your artifacts.

## inspect tree
I already mentioned that there are explicit task dependencies. You can easily analyse these dependencies with `inspect tree`. For example, executing `inspect tree compile:compile` outputs an ASCII tree detailing what tasks/settings the compile task depends on, and what values those settings/tasks return.

## testQuick and testOnly
One of the most exceptional features is the `testQuick` command. It will only execute those tests which have been affected by the changed sources. If you combine it with `~` and run `~testQuick`, you’ll get continuous and immediate feedback on your changes to the code. Each time you save a change, SBT will re-launch `testQuick` and run only relevant tests. You can also use `testOnly` to manually limit scope of your tests to a single suite or suites matching an expression. For example, typing `testOnly *Auction*` will run all the suites with word `Auction` in their name. Also, don’t forget about SBT’s tab-completion, you can use `testOnly <tab>` to let SBT suggest tests for you.

## Forking JVM
Sometimes you may want to run your tasks in a different instance of JVM. For example, if you want to fork your jvm for tests, you can specify:
`fork in Test := true`
and then continue with your custom options, like:
`javaOptions in Test += "-Dspecs2.outDir=target/generated/test-reports”`.
Other reasons why you may need to fork the JVM may be:  
- **Calling System.exit() in your code**  
If your code creates a lot of new threads and these threads are not cleaned up before the main method returns (like in Swing).  
- **Class loading**  
Libraries like scalate create scala files and then compile and load the classes. Some JVMs may run into trouble with PermGen.  
- **Executing selected multiple tasks/commands in parallel**   
You can use the `all` command and run multiple tasks. If possible, these tasks will be executed in parallel, for example: `all test integrationTests`. SBT will figure out whether these tasks are independent and can be run at the same time.

## Global plugins
Some settings and plugins (like sbt-dependency-graph or sbt-idea) are specific to your tools or processes. Specifying them in the build configuration is not a good idea, but you can list them in `~/.sbt/0.13/plugins/plugins.sbt`.

## Autocompleting parser combinators
Parsers are able to take an input stream and attempt to see if that string matches their expectations. If you’re writing tasks relying on user input, SBT allows you to define your own parser combinators. This way you can have powerful input validation and auto-completion with <tab>.

## Tasks vs commands
Sometimes input tasks are not enough. Commands allow building scripting tasks to define broader workflows. Here are some situations when you may prefer to use commands over tasks:  
- You need to reload the build or alter settings in your script (There’s a nice example in the book with calling `git tag`)  
- You need to run tasks in a specific order  
- You need to alter the core `sbt.State` object (to schedule more commands to run)  

## Getting debug logs
SBT prints out a lot of additional debug stuff, but it's not visible in the console by default. You can always call `last` (not only in case of errors) and see what has been printed out on the debug level.

## Temporary settings
You can use the `Def.setting` method to create a temporary setting. It’s a value that cannot be discovered by the user (it never lives inside a key). Temporary settings can depend on other settings. They can also be assigned into a setting key. You can think of them as handy ‘local wrappers’ for some other settings or their transformations.

## Revolver plugin
This one is not really a feature of SBT, but it’s a very useful plugin. With revolver, you can easily start/stop you appliaction, but you can also run `~reStart`.
It’s a great speedup of web app development. As soon as you save any code changes, the plugin would run all the necessary compilation/packaging steps and then stop/start the application. All without your intervention.

So, did we mention that having a reading club in the company is awesome? Try it yourself and maybe you will learn a lot new things from books that would otherwise wait forever “to be read”.*
You can use the `all` command and run multiple tasks. If po
