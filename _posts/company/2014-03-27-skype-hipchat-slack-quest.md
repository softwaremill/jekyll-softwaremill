---
title: Skype, HipChat or Slack? Our quest for a remote communication tool.
description: A remote, distributed team needs the very best communication tools. We've tried some of the most popular ones and proudly present the winner.
author: Mirek Woźniak
author_login: wozniak
categories:
- company
layout: simple_post
---

As we [wrote some time ago](https://softwaremill.com/online-meeting-that-works/), we were quite used to using Skype + TeamSpeak + BigBlueButton as our primary company communication tools. While TS and BBB proved to be reliable as AK47, Skype "could" be a bit better. Still, it was (and still is) an almost free tool, so it had its merit.

However, as we're a team of (mostly) engineers, our communication tool had to be perfect or get busted. Thus, the company-wide testing of new tools - HipChat and Slack ensued. We gave ourselves a week for each tool, after which time we would decide on what to do. 

Here's a basic pros/cons comparison for each of the three tools. It's brutally honest and very relative - this worked/didn't work for us and us only, your team might find the tools completely different. This post has been crowdsourced by the SoftwareMill team.

##Skype 

####Pros

To start, **almost everyone** has it. And that includes clients, with one of our biggest partners as well. Also, Skype has **avatars** (Mac version only) and combines **text and video chat**.

####Cons

Firstly, messages get delivered only when at least two people in the conversation are online. You can't enter/leave chatrooms easily and  pasted **code/stacktrace doesn't look very well**. There's no API available, you may be logged into one account at a time only and one of our clients doesn't use Skype.


**Skype** was our first tool, familiar and free. However, we needed something better. We moved to **HipChat** next.

##HipChat##

####Pros####

HC's got an **app for almost every platform**, pasted code looks nice (**syntax colouring**), the API's available, you can enter/leave chatrooms as you like and create private channels (e.g. if you want to buy sb a present). Finally, it has got a **rich command system** (e.g. part, away, all, here etc.) and lots of integrations (even more than Slack, it seems).

####Cons####

HC has **no avatars**, you can't set notifications for selected rooms only and you can't leave an offline message to be visible after you open HipChat.

You may be logged into **one account at a time only** (except the web app), at least on a Mac; plus, there's no native client for Snow Leopard. If you're absent for a while and want to check a popular channel, you've got to **scroll all the way up** just to find there's no full conversation log there and no link to the history. You've got to go to the web app and find the room's history. 


Finally, HipChat **isn't free** - it costs $2/user/month. We've tested it for a week and moved on to the **new, chic Slack**. Straight from San Fran!


##Slack##
####Pros####

Slack has avatars, pasted code looks nice (**syntax colouring**) and its API is available. Slack's got a powerful **search** - you can scan messages, files, snippets - everything! 
It also shows others' **time zone**, which is crucial when working remotely.

Slack lets you star messages, create private channels easily, *force* everyone to be on the "general" (default) channel and it [integrates with almost everything](https://slack.com/integrations). 


####Cons####

However! There's **no desktop app for Linux/Windows** <del>and it's only for a team/company itself - if we wanted a client to use Slack, we'd have to create an e-mail in our domain for them. You can't add people to selected rooms, it's either full access or no access.</del>

EDIT (11.08.2014): It seems that **Slack's exclusivity is no longer valid** - [you can now add team members that see only a selected bit of your communication](https://slack.zendesk.com/hc/en-us/articles/202518103-Restricted-Accounts-and-Single-Channel-Guest-FAQ).

As for the bottom line, Slack's free version has a **10,000 message searchable archive**, the paid version hasn't got this limit, but it's $8/user/month. For us it means around 10-day long archive. We're considering an upgrade, though - sometimes you just need to check a project's chat archive.

##There can be only one

We've decided to go for **Slack**. And it was almost an unanimous decision, not so with HipChat or Skype. Some people around still think we should use IRC, but... well, no.
We know there's Flowdock and a flock of other communication tools, but for now **Slack completely rocks and it seems we'll stick to it**.

