---
title: Six steps to improve your remote communication with TeamSpeak
description: Configuring TeamSpeak for performance and usability in a remote work environment
author: Tomasz Dziurko
author_login: tomasz_dziurko
categories:
- remote work
layout: simple_post
---

Communication is the key in any team working on software, this well-known fact is even more true in a company
working 100% remotely where team members sit at their comfortable desks hundred kilometers away from each other.


Remote work brings many advantages but, at the same time, requires more cautious approach to setting and preserving
communication within the team. It is very easy to "leave" your people feeling alone or left without any connection with the 
rest of your company. To resemble the feeling of being together in SoftwareMill we use [TeamSpeak](https://www.teamspeak.com/). In our setup 
TeamSpeak is used as a central hub for voice communication. Each team working on a specific project has its own
channel (room) where developers "sit", any of them can initiate discussion with other team members using "push-to-talk" in just one click. 
No "Can I call you on Skype?" questions, no "Let's create a group call to discuss it". One click and you are talking with your peers.

But as usual, over the time we have learnt more about TeamSpeak and how we could adjust it to our needs. In this post I am
going to share a few trick that could make your work with TeamSpeak even more productive.


## Away from keyboard status

There are only few more irritating things than a situation where you are describing a complicated problem to developers in your team
for a few minutes only to notice that all of them are away from their computers. Of course you can always ask beforehand, but...
this quickly becomes a tedious task. To avoid such situations we have introduced a habit to use "Toggle away" TeamSpeak status 
(marked with red rectangles):

![everyone-is-away](/img/uploads/2016/05/team_speak_away_all.png)

So in one glance you can check if person is away or not. Clicking this "toggle" it each time is rather a slow and quickly becomes a tedious task 
so we have added a handy shortcut to toggle it on and off. This way we have reached another important topic.

## Shortcuts, shortcuts, shortcuts

When using any application, as soon as you spot any patterns in your monkey clicking, please spend a few minutes checking if 
this activity could be replaced by a handy shortcut. TeamSpeak is very customizable in this area so you will be able 
to save dozens of clicks every hour. For example I have shortcuts for:

 - switching to my project channel
 - switching to 2nd most frequently used channel
 - toggle away status

![everyone-is-away](/img/uploads/2016/05/team_speak_shortcuts.png)  

## Place to discuss in smaller groups

From time to time a smaller group in a project starts diving into specific topic which is not interesting for others.
After few struggles to find a proper place to continue discussion we decided to create a sub-channel in our project rooms.
In most cases it is called "Couch", "Terrace on the roof", "Luxury sofa", etc. These channels are easily accessible so
people could quickly switch to them and keep the discussion flow without unnecessary breaks.

## Default channels

Another tiny tip, but also saving you a few clicks each day: in your server settings you can set up a default channel
to join after you start TeamSpeak client. If you spend most of your time in specific channel this setting will make your
life a bit easier.

![default-channel-settings](/img/uploads/2016/05/team_speak_default_channel.png)  

## Reduce TeamSpeak client CPU usage

TeamSpeak client is known for its surprisingly high CPU consumption. I have seen situations when client was consuming 30 or
even 40% of CPU time on our Mac Books. After many trial and errors I have observed that disabling following options
significantly improves the situation:

 - close small, moving news moving banner at the bottom of your client window
 - turn off Animated GIF Support in _Preferences -> Design_
 - turn off Echo Reduction and Echo cancellation in _Preferences -> Capture_ (however, depending on your headphones/speakers setup, this might reduce sound quality) 

After such tuning my TS client rarely goes above 10% of CPU.

 
## Text to Speech for most important events, others turned off
 
Quite often I hear "User joined your channel" message and to know who has just stepped in I need to find TS window
and check it visually. Same happens when I am in the middle of conversation with a developer from my team and suddenly
I hear "User disconnected" and I am not sure if this is my current interlocutor and I should wait for him or someone else.

Both situations are irritating interruptions. To limit their number you can simply:

1. Disable notifications on almost all events in in _Preferences -> Notifications_ window. I only have "user left/joined/disconnected your channel" enabled.
2. Switch to "Default Text To Speech" under _Preferences -> Notifications -> Sound Pack_

![default-channel-settings](/img/uploads/2016/05/team_speak_text_to_speech.png)
  
3. Download "Text to Speech" voice pack in your native language for your OS. This applies only if user names in your team/company sound weird in English :)

![default-channel-settings](/img/uploads/2016/05/text_to_speech.png)

4. Edit messages about events you are interested in, for example you can replace

```
CLIENT_CONNECTION_CONNECTED_CURRENT_CHANNEL = say("${clientname} entered your channel")
```
with translated:

```
CLIENT_CONNECTION_CONNECTED_CURRENT_CHANNEL = say("${clientname} dołączył do twojego kanału")
```

All messages are configured in _settings.ini_ file located in your TeamSpeak installation folder (for example under OS X it is 
_/Applications/TeamSpeak 3 Client.app/Contents/SharedSupport/sound/default_speech/settings.ini_)

After these steps number of notifications is really small and those most important are self descriptive instead of enigmatic
_User joined your channel_.

##  Wrap up

TeamSpeak is a very useful tool for any remote communication, in our company it quickly became essential for every team working 
on software project. With these small adjustments presented above it can be even better and make your work a bit easier.