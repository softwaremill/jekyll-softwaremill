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


## Regenerating Twitter or blogs

Call `__generators/generate.sh`.

### Pre-steps

1. Install PHP for command line. Package name is usually "php-cli".
2. Go to `__generators/` and call `bundle`.


## Running in production

Call `jekyll build` to generate the website in `_site`.

Call `__proxy/server.sh` to serve `_sites/` at http://localhost:8000/.


## Auto-rebuild in production

crontab entry:

    * * * * * export LANG="en_US.UTF-8"; source ~/.zshrc_local; cd /home/nowaker/jekyll-softwaremill; /home/nowaker/jekyll-softwaremill/__generators/generate.sh; jekyll build

Replace `~/.zshrc_local` with your profile file. The only thing we expect from the env file
is providing `$PATH` to Rubygems binaries, which is usually `~/.gem/ruby/1.9.1/bin`.

### Pre-steps

1. Install Python 2.


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

