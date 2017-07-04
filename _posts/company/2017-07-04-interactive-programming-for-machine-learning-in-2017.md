---
title: Interactive programming for Machine Learning in 2017
description: Bridge between Jupyter notebooks and full blown IDE
author: Sebastian Drygalski
author_login: sdrygalski
categories:
- machine learning
- data science
- IDE
- python
- R
layout: simple_post
---

## Introduction ##
I'm always aiming to reduce the time between writing code and actually seeing the results. Not only it allows to test rarely-used API faster and catch bugs earlier, but also enables faster prototyping. In some areas, like machine learning and data science, it's not even a matter of convenience, but necessity.
We can see the rise of IDEs and tools that allow to perform `exploratory analysis` easier, and more and more languages incorporate REPL (Read–eval–print loop) in their toolset.
This stuff is designed to give you feedback about your code and your data as soon as possible. It gives you the feel of how your data is structured, how changing simple parameters (or entire algorithm) affects your solution and lets you reduce time between adding new code and seeing it in action.


I am a big fan of Bret Victor work, especially his talk [Inventing on Principle](https://vimeo.com/36579366) and related work, like [Learnable Programming](http://worrydream.com/LearnableProgramming/). His ideas inspired projects like [Light Table](http://lighttable.com/) and [Khans Academy live coding](https://johnresig.com/blog/introducing-khan-cs/). Light Table was positioned as the IDE allowing to run code inline and get instant feedback, it also supported many different languages.
![Light Table watches](http://lighttable.com/images/watches.png)
It had a really successful Kickstarter campaign and later it somehow lost steam, but before that it gave [inspiration](http://nondot.org/sabre/) (of course alongside Bret Victor’s work) to many great things, like powerful [Swift Playground](http://nondot.org/sabre/) from Apple and... Hydrogen, which I will show you today.


## Hydrogen ##
[Hydrogen](https://nteract.io/atom) is a package for Atom editor that allows interactive programming in different languages.
I'd call it a bridge, or even a sweet spot, between Jupyter Notebooks and a full blown IDE (like IntelliJ IDEA). The former is designed solely as an exploratory tool (maybe it's not designed for it, but used by many people for this kind of work), the latter as an application development IDE. But with Hydrogen you can have the best of both worlds with much more. You can test everything right away and have room for organizing code like in IDE for normal applications.


But what exactly is this interactive programming, instant feedback and so on? For starter, you can do something like this:
![Run parts of the code and get instant results](https://cloud.githubusercontent.com/assets/13285808/20360915/a16efcba-ac03-11e6-9d5c-3489b3c3c85f.gif)
Select the code you are interested in and just press `⌘+Enter`. Instant feedback.


You can execute and see anything inline, not only the parts of code that output text:
![See graphics and plots inline in Atom](https://i.github-camo.com/e17ac2bfffce4ede5cae57c3109ef7f53effc997/68747470733a2f2f636c6f75642e67697468756275736572636f6e74656e742e636f6d2f6173736574732f31333238353830382f32303336303838362f37653033653532342d616330332d313165362d393137362d3337363737663232363631392e676966)


## Watch expressions ##
This is really nice, you can tweak your algorithm and with every change you send to underlying kernel, the watcher will execute your code. So whenever you change something, e.g. plot new values for precision, recall, accuracy and so on, you can browse the history of your changes. Like this:
![Watch expressions in action](https://cloud.githubusercontent.com/assets/13285808/20361086/4434ab3e-ac04-11e6-8298-1fb925de4e78.gif)


## Precise autocompletion ##
You can get the precise autocompletion for your living objects because Hydrogen doesn't need to guess about your code (like in dynamic languages), it can inspect objects and get all info from them.
![Autocompletion right from living objects](https://cloud.githubusercontent.com/assets/13285808/14108987/35d17fae-f5c0-11e5-9c0b-ee899387f4d9.png)
![Object inspection](https://cloud.githubusercontent.com/assets/13285808/14108719/d72762bc-f5be-11e5-8188-32725e3d2726.png)


## More features ##
Here you can find more fancy examples of what Hydrogen can do: [examples](https://nteract.gitbooks.io/hydrogen/docs/Usage/Examples.html). They have interactive JSON browser, can render images, iframe of HTML or even interactive plots with Plotly.
You can also connect to remote kernels if you need more power.
Yes, Hydrogen in fact connects to the underlying Jupyter kernel so you can have all of its magic at your disposal. And you can use different kernels... even in one file.
![Different kernels in one file](https://cloud.githubusercontent.com/assets/13285808/24365090/0af6a91c-1315-11e7-92c6-849031bf9f6a.gif)
So right from your code you can do stuff like `! pip install numpy` or execute Jupyter’s [magic commands](http://ipython.readthedocs.io/en/stable/interactive/magics.html). You can also divide your code into separate cells (like in Jupyter or RStudio) with `# %%` and with one shortcut execute all code in the entire cell.
If you need to see your code, press `⌥+⌘+backspace`, it will clear all results, plots etc.; you can even move all outputs to the right dock and focus on the code.


## Ecosystem ##
Everything is done without leaving the hackable, highly configurable Atom.
And this is the reason I think Hydrogen will succeed. They don't need to write everything by themselves, like folks at LightTable. They simply incorporate kernels from Jupyter. Also, they have the entire ecosystem from Atom at their disposal, and all its libraries written by the community: linters, scripts, simple utilities and the entire configurable editor.


## Useful Atom packages ##
Here is my subjective list of useful atom packages. Remember that you can install them right from the terminal using `apm install PACKAGE_NAME` and after this, in Atom's command list, choose `Window: Reload` to get everything installed and refreshed.
Especially if you liked the editor in IntelliJ IDEA: [expand-region](https://atom.io/packages/expand-region), [cursor-history](https://atom.io/packages/cursor-history), [ctrl-dir-scroll](https://atom.io/packages/ctrl-dir-scroll), [highlight-selected](https://atom.io/packages/highlight-selected)
Really useful packages: [atom-beautify](https://atom.io/packages/atom-beautify), [Zen](https://atom.io/packages/Zen), [busy-signal](https://atom.io/packages/busy-signal), [minimap](https://atom.io/packages/minimap), [minimap-bookmarks](https://atom.io/packages/minimap-bookmarks), [minimap-highlight-selected](https://atom.io/packages/minimap-highlight-selected), [minimap-selection](https://atom.io/packages/minimap-selection), [open-recent](https://atom.io/packages/open-recent), [symbols-tree-view](https://atom.io/packages/symbols-tree-view), [todo-show](https://atom.io/packages/todo-show), [file-icons](https://atom.io/packages/file-icons)


## Similar environments ##
There is nothing exactly like Hydrogen, but you can think of some similar tools:
Rodeo - More similar to RStudio, but unfortunately, the company behind it (Yhat), was acquired by another company and there have been no new commits for half a year, and without further improvement it is unusable for me.
Jupyter Labs - Another thing worth watching is Jupyter Labs, but for now it's not even near to completion according to their site.
More IDEs similar to RStudio: [wingware](https://wingware.com/) , [spyder](https://github.com/spyder-ide/spyder) - it's worth to check them out, but for me they were not configurable enough to make my work pleasant (Atom raised the bar significantly), and they lack some necessary shortcuts.


## BONUS ##
1. As a bonus you could also try a replacement for front-end of Jupyter notebooks [nteract desktop](https://nteract.io/desktop) by folks behind Hydrogen.
2. If you are interested in what the founder of Light Table is doing these days, check his new project - [Eve](http://witheve.com/). It's not even close to commercial use, but it presents some really interesting concepts.
