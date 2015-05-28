---
layout: default
---

{% capture url %}{{ page.url | remove: '/' | remove: 'index.html' }}/{% endcapture %}
{% if url == '/' %}{% capture url %}{% endcapture %}{% endif %}

<script src="toc.min.js"></script>

<div id="baner-contact">
  <div class="wrapper font-green">What we've been up to</div>
</div>

<article id="post">
  <div class="block">
    <div class="wrapper clearfix">
      <div class="post-content">
        <div class="post clearfix">
          <div class="post-header clearfix">
            <figure>
              <div class="image">
                <img src="/img/members/{{ page.author_login | escape }}.jpg" alt="{{ page.author | escape }}"/></div>
            </figure>
            <div class="title">
              <h2 class="font-dark-blue font-normal">{{ page.title | escape }}</h2>
              {{ page.date | date: "%-d %B %Y" }} | <strong>{{ page.author | escape }}</strong>
              <br/><br/>
            </div>
          </div>
          <div class="post-rows">
            <div class="toc">
              <h1>Table of contents</h1>
              <div id="toc"></div>
            </div>
            <div class="text">
              {{ content }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</article>

<link rel="stylesheet" href="/res/pygments-github.css" />

<script>
  $('#toc').toc({
    'selectors': 'h1', //elements to use as headings
    'container': '.text', //element to find all selectors in
    'smoothScrolling': true, //enable or disable smooth scrolling on click
    'prefix': 'toc', //prefix for anchor tags and class names
    'highlightOnScroll': true, //add class to heading that is currently in focus
    'highlightOffset': 100 //offset to trigger the next headline
  });
</script>

<script>
  $(function() {
    if ($(window).scrollTop() > ($('.text').offset().top + $('.text').outerHeight() - $('.toc').outerHeight()) ) {
      $('.toc').addClass('stick-bottom');
    } else if ($(window).scrollTop() > $('.text').offset().top) {
      $('.toc').addClass('fixed');
    } else {
      $('.toc').addClass('stick-top');
    }

    $(document).on("scroll", function() {
      if ($(window).scrollTop() > ($('.text').offset().top + $('.text').outerHeight() - $('.toc').outerHeight()) ) {
        $('.toc').removeClass('stick-top').removeClass('fixed').addClass('stick-bottom');
      } else if ($(window).scrollTop() > $('.text').offset().top) {
        $('.toc').removeClass('stick-top').removeClass('stick-bottom').addClass('fixed');
      } else {
        $('.toc').removeClass('stick-bottom').removeClass('fixed').addClass('stick-top');
      }
    });
  })
</script>