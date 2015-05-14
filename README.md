# softwaremill.com v2.5 based on Jekyll


# Quick howtos

## Running in development

Files are regenerated on every change. Note, IntelliJ saves a file after window defocus, so it's usually 2 seconds before you see the change.

1. `bundle exec jekyll serve -w` 
2. Go to [http://localhost:4000/](http://localhost:4000).

### Pre-steps

1. Install Ruby version as defined in [Gemfile](https://github.com/softwaremill/jekyll-softwaremill/blob/master/Gemfile).
2. `gem install bundler`
3. `bundle`

You may need to add `$HOME/.gem/ruby/1.9.1/bin` to `$PATH`.

### Pre to Pre-steps - Install ruby 2.1.2 for complete non-ruby
if (ruby -v !=2.1.2) continue

1. curl -sSL https://get.rvm.io | bash -s stable
2. source ~/.profile
3. rvm install ruby-2.1.2
4. in case of `certificate verify failed` navigate to [rubygems](https://rubygems.org/pages/download#formats) and get tgz and install rubygems by `ruby setup.rb`

## Regenerating Twitter or blogs

Call `__generators/generate.sh`.

Locally most likely you will get, don't freak out.

    [Thu Apr  9 12:58:22 CEST 2015] twitter-blog FAILED
    [Thu Apr  9 12:58:22 CEST 2015] twitter-home FAILED

To solve that locally just create the missing files
 
    touch _includes/generated/twitter-blog.html
    touch _includes/generated/twitter-home.html

### Pre-steps

1. Install PHP for command line. Package name is usually `php-cli`.
2. Go to `__generators/` and call `bundle`.

Most likely you may need imagemagick in `__generators/` for handling images.
1. `brew install ImageMagick`
2. `gem install rmagick -v '2.13.3'`

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

Call `bundle exec jekyll build` to generate the website in `_site`.

Call `__proxy/server.sh` to serve `_sites/` at [http://localhost:8000/](http://localhost:8000/).

### Pre-steps

1. Install Python 2.7.x.
2. `cp __generators/secrets-config.example.php __generators/secrets-config.php` and provide some API keys.

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

[example-blog]: https://github.com/softwaremill/jekyll-softwaremill/blob/master/_examples/2013-10-07-this-will-become-a-permalink-to-the-post.markdown
[markdown]: http://daringfireball.net/projects/markdown/syntax

## How to add presentation post?

Create a new file in `_posts/presentations/`. The filename should be `YYYY-MM-DD-permalink-to-the-post.markdown`.
This is what every new post needs to have on top:

    ---
    layout: simple_presentation
    title: Your conference talk topic
    abstract_fragment: Short abstract fragment to be displayed on post thumbnail
    keywords: list, of, several, most, important, words
    speaker: Name Surname
    speaker_login: login
    categories:
    - presentations
    ---

* login should be equal to the filaname of photo of person
* if there's no photo yet, clone `img/members/no-image.png` no-image.png into new file person_login.png and use it as a speaker-Login

If you remove a post from `presentation` category, the post will be available via a permalink only.
It won't appear on the blog. May be useful for testing.

Below the `---` you write a post in Markdown flavor. It's the same as on Github.
See an [example presentation post][example-presentation] and [Markdown documentation][markdown] for details.

You may use a plain HTML. Change the file extension to `html`.
You may also use Textile or whatever but you have to figure out yourself.

### Embedding slides

Slides should be embedded using size 427x356, check [example presentation post][example-presentation] for details

__IMPORTANT__: For embed code created by Slideshare you have to replace _http_ with _https_ in code snippet. Standard http won't work on softwaremill.com

For Slideshare you can also remove last text section below slides, something like "from <profileName>" as in most cases only presentation title is enough.

### Embedding video

Video from Youtube should be embedded with 429x241, again check [example presentation post][example-presentation] to see how it should be done.

[example-presentation]: https://github.com/softwaremill/jekyll-softwaremill/blob/master/_examples/2013-09-12-example-presentation-post.md
[markdown]: http://daringfireball.net/projects/markdown/syntax



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
