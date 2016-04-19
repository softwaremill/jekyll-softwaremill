---
title: Building Bootzooka UI with Webpack
description: Introducing a new frontend build system for Bootzooka - Softwaremill's projects scaffolding framework
author: Jan Kowalski &  Marcin Baraniecki
author_login: kowalski
categories:
- scala
- bootzooka
- webpack
- javascript
- company
layout: simple_post
---

Together with Marcin Baraniecki we have worked on switching [Bootzooka's](https://github.com/softwaremill/bootzooka) UI build system to [Webpack](http://webpack.github.io/docs/what-is-webpack.html).

Since some time Webpack is desireable technology in all modern javascript web application build process. Hopefully Bootzooka’s application code using ES2015 modules system and import/export feature makes a really interesting combination for you.

Looks like best time of grunt and bower is gone. Moving to Webpack significantly reduces the configuration code one needs to write (compare `gruntfile.js` (327 loc) + `bower.json`(31 loc) vs `webpack.config.js` (61 loc)). That change eliminates one factor - big files - of build system complexity.
For this change we got inspiration from [egghead.io](https://egghead.io/series/angular-and-webpack-for-modular-applications) Webpack lessons.


### What has changed?
  - no grunt
  - no bower
  - ES2015 (plus import/export syntax)
  - Webpack (also for unit tests)


### Npm scripts now
We make use of npm scripts (instead of `grunt` in `bootzooka/ui` directory):

  - **npm start** - start hotreloading Webpack dev server
  - **npm run build** - create a distribution
  - **npm run dist** - create a distribution and serve with http-server
  - **npm run test** - run karma unit tests


[Read more](http://softwaremill.github.io/bootzooka/frontend.html)


The biggest benefit we got with this change is the true modularity of angular webapp. Take a look at `components` (this name moves us towards angular 2.0 future upgrade ;) directory. Each subdirectory is a complete component which might be copy&pasted to your own project and imported to main index.js (assuming you are using angular-ui) - it should work out of the box.  Engaging isn’t it?
