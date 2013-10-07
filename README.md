# softwaremill.com v2.5 based on Jekyll


# Quick howtos

## Running in development

Files are regenerated on every change. Note, IntelliJ saves a file after window defocus, so it's usually 2 seconds before you see the change.

1. `jekyll serve -w`
2. Go to [http://localhost:4000/](http://localhost:4000).

### Pre-steps

1. Install Ruby 1.9.3 or newer.
2. `gem install bundler`
3. `bundle`

You may need to add `$HOME/.gem/ruby/1.9.1/bin` to `$PATH`.


## Regenerating Twitter or blogs

Call `__generators/generate.sh`.

### Pre-steps

1. Install PHP for command line. Package name is usually `php-cli`.
2. Go to `__generators/` and call `bundle`.


## Sending e-mails via contact form - pre-steps

`__dynamic/contact.json.php` is using built-in `mail()` function in PHP.
It sends the e-mails via `/usr/bin/sendmail`. Server should have some sendmail-alternative installed.
These days, `msmtp` is recommended, and it's installed on critical.sml.cumulushost.eu.

User running the server should create `~/.msmtprc`:

```
defaults
auth on
tls on
tls_trust_file /usr/share/ca-certificates/mozilla/Thawte_Premium_Server_CA.crt

account default
host smtp.gmail.com
port 587
from EMAIL
user EMAIL
password PASSWORD
tls_trust_file /etc/ssl/certs/ca-certificates.crt
```

During the development you probably want to temporarily change `$to = 'hello@softwaremill.com';` in `__dynamic/contact.json.php`.


## Running in production

Call `jekyll build` to generate the website in `_site`.

Call `__proxy/server.sh` to serve `_sites/` at [http://localhost:8000/](http://localhost:8000/).

### Pre-steps

1. Install Python 2.7.x.


## Auto-rebuild in production

crontab entry:

    * * * * * /home/softwaremill/jekyll-softwaremill/__generators/cron.sh

Make sure gem directory is in $PATH.


# Technical documentation

## How to add a static page?

What you see in the project structure is what you get in the browser.
File `/img/agile.png` is visible under address `http://localhost:4000/img/agile.png`.

The only exception is `index.html` - it's visible under `http://localhost:4000/`. Therefore, to add a new page, say `/struts`, you need to create `/struts/index.html` file.

Each file should contain this on top:

    ---
    layout: default
    title: Nice page name - SoftwareMill
    description: A short 140-words SEO-friendly description, goes to meta description.
    keywords: single, word, meta, description, double words
    ---

## How to add a blog post on company blog?

Create a new file in `_posts/company/`. The filename should be `YYYY-MM-DD-permalink-to-the-post.markdown`.
This is what every new post needs to have on top:

    ---
    layout: simple_post
    title: Your blog post title
    description: A short description that will appear as a post excerpt. This will appear in Google as well. Keep it short.
    keywords: list, of, several, most, important, words
    author: Name Surname
    categories:
    - company
    ---

If you don't have an official photo yet, please remove a line with `author_login`.
A placeholder will be rendered instead.

If you remove a post from `company` category, the post will be available via a permalink only.
It won't appear on the blog. May be useful for testing.

Below the `---` you write a post in Markdown flavor. It's the same as on Github.
See an [example blog post][example-blog] and [Markdown documentation][markdown] for details.

You may use a plain HTML. Change the file extension to `html`.
You may also use Textile or whatever but you have to figure out yourself.

[example-blog] https://github.com/softwaremill/jekyll-softwaremill/blob/master/_examples/2013-10-07-this-will-become-a-permalink-to-the-post.markdown
[markdown] http://daringfireball.net/projects/markdown/syntax

## Q&A

- Why PHP?
- Twitter feeds collector, e-mail sender and newsletter is Balsam's code. Copy-paste ftw.

- Why Python?
- Python has an embedded HTTP server called SimpleHTTPServer.
  Adding a custom 404 page, url rewriting and threaded dispatching was a matter of a few lines of code.
  We don't need to mess with Apache to achieve such trivial things.

- Why Ruby?
- Jekyll is written in Ruby.

## What can be done better?

1. Replace crappy `__dynamic/contact.json.php` with gem [mail](https://github.com/mikel/mail).
   This will eliminate a need for `sendmail`.
2. Replace crappy Twitter generators written in PHP with gem [twitter](http://sferik.github.io/twitter/).
   This will also eliminate a need for maintaining a config a PHP-based configuration file. Ruby hash would suffice.
2. Upgrade Jekyll to [Octopress](http://octopress.org/).
