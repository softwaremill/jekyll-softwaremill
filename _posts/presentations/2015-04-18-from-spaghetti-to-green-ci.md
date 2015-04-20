---
layout: simple_presentation
title: From spaghetti with no `src/test` to green CI and well-sleeping developers
conference: DevCrowd, Poland
abstract_fragment: We’ll show you how to become friends with your legacy code
keywords: spring, spock, devops, bugsnag, logstash, kibana, ci, aspectj
speaker: Jacek Kunicki & Michał Matłoka
speaker_login: no-image
categories:
- presentations
---

We have presented this topic on Poznań Java User Group and DevCrowd 2015. If you missed those talks, you still have a chance to hear us at GeeCON 2015 and Devoxx PL - see you there!

<h4>Abstract</h4>
Yes, we did it! Over a year ago we met a monster – a legacy Spring MVC application with 50% code duplication, no tests, manual deployment and mysterious error reporting. Come and see yourself how blood, sweat and tears have then turned into a well-tested REST API, pleasant to use and develop.

After a year we have an interactive API documentation, informative call statuses and error messages. We precisely track every request through its entire lifecycle. Together with version tracking on multiple nodes, this lets us spot any errors really quickly.

Plus, we reduced the boilerplate needed to achieve all of this to a single annotation for each API call – with the help of AspectJ, MDC, custom filters, converters and more. Obviously, we also introduced src/test/groovy, full of Spock and rest-assured – which made our application "the most rigid part of the infrastructure", as per our customer.

Come to hear our story, share yours and let us know if we could do better!

<h4>Slides</h4>
<iframe src="https://www.slideshare.net/slideshow/embed_code/46980945?rel=0" width="427" height="356" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC;border-width:1px 1px 0;margin-bottom:5px" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="https://www.slideshare.net/SoftwareMill/p-46980945" title="From spaghetti with no `src/test` to green CI and well-sleeping developers" target="_blank">From spaghetti with no `src/test` to green CI and well-sleeping developers</a> </strong></div>
