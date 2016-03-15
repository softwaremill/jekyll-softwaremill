---
title: New version of Codebrag is out!
description: Added support for Teams, possibility to mark all commits as reviewed and other small improvements
author: Lukasz Lenart
author_login: lukasz_lenart
categories:
- scala
- codebrag
- company
layout: simple_post
---

I have spent some time on adding new features to our open source project [Codebrag](http://codebrag.com/).
If you don't know what it is, please visit the site to read more about it.

### too many commits to review

The most annoying thing for me, when I was joining a new project where Codebrag was used, it was too many commits to review
on the beginning. It was not possible to mark all commits as reviewed at once and you have had to mark them one by one
spending a lot of time on this useless activity ;-)

Now you can mark all commits as reviewed by hitting just one button:

![](/img/uploads/2016/03/2016-03-15-cbr-1.png)

The button is available after opening any commit which is on your `TO REVIEW` list. With one shot you mark all of them
as reviewed!

### manage your teams

Thanks to [Ruben Gerits](https://github.com/gerits) it is possible now to define teams and manage members of the teams
inside Codebrag. What does it mean? If you have a large development team and you want to, that just some members
of the team are involved in code review of some parts of your project, you can form a team in Codebrag to narrow
pool of commits they have to review. It works very simple: if a team member made a change, that change will only be
visible to other team members from her team. If someone isn't assigned to any team, she will see all the commits as usual.

![](/img/uploads/2016/03/2016-03-15-cbr-2.png)

### other small things

There were also few other changes applied to fix commonly spotted issues, please see
[CHANGELOG](https://github.com/softwaremill/codebrag/blob/master/CHANGELOG.md#v233-15032016) for more details.
