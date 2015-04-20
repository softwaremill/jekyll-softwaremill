---
layout: default
---

{% capture url %}{{ page.url | remove: '/' | remove: 'index.html' }}/{% endcapture %}
{% if url == '/' %}{% capture url %}{% endcapture %}{% endif %}

<div id="baner-contact">
  <div class="wrapper font-green">{{ page.title | escape }}</div>
</div>

<article id="post">
  <div class="block border">
    <div class="wrapper clearfix">
      <div class="post-content">
        <div class="post clearfix">
          <div class="post-header clearfix">
            <figure>
              <div class="image">
                <img src="/img/members/{{ page.author_login | escape }}.jpg" alt="{{ page.author | escape }}"/></div>
            </figure>
            <div class="title">
              {{ page.date | date: "%-d %B %Y" }} | <strong>{{ page.author | escape }}</strong>
              <br/><br/>
            </div>
          </div>
          <div class="post-rows">
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

