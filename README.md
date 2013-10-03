# softwaremill.com v2.5 based on Jekyll


# Quick howtos

## Running in development

Files are regenerated on every change. Note, IntelliJ saves a file after window defocus, so it's usually 2 seconds before you see the change.

1. `jekyll serve -w`
2. Go to http://localhost:4000/.

### Pre-steps

1. Install Ruby 1.9.3 or newer.
2. `gem install bundler`
3. `bundle`


## Running in production

Call `__proxy/server.sh`. This will generate the website and serve `_sites/`, an output directory, at http://localhost:8000/.

### Pre-steps

1. Install Python 2.


## Regenerating Twitter or blogs

Call `__generators/generate.sh`.

### Pre-steps

1. Install PHP for command line. Package name is usually "php-cli".
2. Go to `__generators/` and call `bundle`.


# Technical documentation

## How to add a static page?

What you see in the project structure is what you get in the browser.
File `/img/agile.png` is visible under address http://localhost:4000/img/agile.png`.
The only exception is `index.html` - it's visible under `http://localhost:4000/`.

Therefore, to add a new page, say `/struts`, you need to create `/struts/index.html` file.
Each file should contain this on top:
---
layout: default
title: Nice page name - SoftwareMill
---

## How to add a blog post?

TBD

## Q&A

- Why PHP?
- Twitter feeds collector is Balsam's code. Copy-paste ftw.

- Why Python?
- Python has an embedded HTTP server called SimpleHTTPServer.
  Adding a custom 404 page and url rewriting was a matter of a few lines of code.
  We don't need to mess with Apache to achieve such trivial things.

- Why Ruby?
- Jekyll is written in Ruby.

