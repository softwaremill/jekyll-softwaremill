---
layout: default
---

{% capture url %}{{ page.url | remove: '/' | remove: 'index.html' }}/{% endcapture %}
{% if url == '/' %}{% capture url %}{% endcapture %}{% endif %}

<div id="baner-contact">
  <div class="wrapper font-green">{{ page.title | escape }}</div>
</div>

<article id="post">
  <div class="block">
    <div class="wrapper clearfix">
      <div class="post-content">
        <div class="post clearfix">
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

<script src="/res/toc.min.js"></script>
<script src="/res/toc_custom.js"></script>