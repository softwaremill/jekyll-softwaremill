---
layout: default
---

{% capture url %}{{ page.url | remove: '/' | remove: 'index.html' }}/{% endcapture %}
{% if url == '/' %}{% capture url %}{% endcapture %}{% endif %}

<link type="text/css" rel="stylesheet" href="jquery.tocify.css" />
<script src="jquery.tocify.js"></script>

<div id="baner-contact">
  <div class="wrapper font-green">{{ page.title | escape }}</div>
</div>

<article id="post">
  <div class="block">
    <div class="wrapper clearfix">
      <div class="post-content">
        <div class="post clearfix">
          <!-- <div class="post-header clearfix">
            <figure>
              <div class="image">
                <img src="/img/members/{{ page.author_login | escape }}.jpg" alt="{{ page.author | escape }}"/></div>
            </figure>
            <div class="title">
              {{ page.date | date: "%-d %B %Y" }} | <strong>{{ page.author | escape }}</strong>
              <br/><br/>
            </div>
          </div> -->
          <div class="post-rows">
            <div id="toc">
              <h1>Table of contents</h1>
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
  $(function() {
    $("#toc").tocify({context: '.text', highlightOnScroll: true, history: false, showAndHideOnScroll: true});
  })
</script>

<script>
  $(function() {
    
  })
</script>

<script>
  $(document).on("scroll", function() {
    var x = $('.header').height()+$('#banner-contact').height()+$('article#post').height()-$('#toc').height();
    console.log(x);
    if ($(this).scrollTop() < $('.text').offset().top) {
      $('#toc').removeClass('sticked-to-top').addClass('sticked');
    } else if ($(this).scrollTop() > $('.text').offset().top) {
      $('#toc').removeClass('sticked').addClass('sticked-to-top');
    } else if ($(this).scrollTop() > x) {
      console.log('!');
    }
  })
</script>