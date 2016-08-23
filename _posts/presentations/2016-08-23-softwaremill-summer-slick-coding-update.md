---
title: Summer Slick coding update
description: An update on the progress done on the Softwaremill-sponsored summer project to enhance Slick
author: Adam Warski
author_login: warski
categories:
- scala
- company
- slick
- summer
layout: simple_post
---

Summer is inevitably coming to an end, but work on [Slick](http://slick.typesafe.com) is progressing at a fast pace! This year we are happy to sponsor a student, [Trevor Sibanda](http://sibandatrevor.blogspot.com) from Zimbabwe (you can find the original info [here](https://softwaremill.com/summer-slick-coding/)), to work on the project during the summer months.

We've asked Trevor how the work is going. Turns out, quite a lot of PRs are in progress! Here's a short summary, as provided by Trevor:

"Most of the work I've worked so far have revolved around fixing issues in the code generator and a couple of driver specifc issues.

Work on the code generator includes:

* running the codegenerator tests against all databases [PR1570](https://github.com/slick/slick/pull/1570)
* escaping special characters for table names in codegenerator [PR1477](https://github.com/slick/slick/pull/1477)
* adding support for generating case classes for tables with > 22 columns [PR1546](https://github.com/slick/slick/pull/1546)
* Fixing codegen cyclic dependency error given table "Table" [PR1508](https://github.com/slick/slick/pull/1508) (merged)

Driver specific work done includes:

* Improving Mysql string type inference [PR1578](https://github.com/slick/slick/pull/1587)
* Allow Mysql profile to parse default bit values [PR1584](https://github.com/slick/slick/pull/1584)
* Fix mysql model builder parsing of schema name [PR1528](https://github.com/slick/slick/pull/1528)
* Fix mysql parsing default value for numeric types [PR1583](https://github.com/slick/slick/pull/1583)
* Improve sqlite driver's parsing of timestamp values [PR1580](https://github.com/slick/slick/issues/1580)
* Fix sqlite driver's handling of decimal type with precision [PR1551](https://github.com/slick/slick/pull/1551)

Other changes made include:

* Added O.Unique columnoption [PR1523](https://github.com/slick/slick/pull/1523) (merged) 
* Adding O.DefaultExpression column option to handle default expressions [PR1533](https://github.com/slick/slick/pull/1533)

And some other minor tweaks"

If you are curious about the ongoing status, the list of submitted PRs can be [found here](https://github.com/slick/slick/pulls?utf8=✓&q=is%3Apr%20author%3Atrevorsibanda), and the issues found&reported [here](https://github.com/slick/slick/issues/created_by/trevorsibanda).

Looking forward to a successful closing of the project! And thanks to [Christopher Vogt](https://twitter.com/cvogt) for mentoring and reviewing the code!
