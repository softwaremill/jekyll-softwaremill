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
            <div class="text">
              {{ content }}
            </div>
            <div class="table-of-contents">
              <h1>Table of contents</h1>
              <ol>
                <li>Evaluating persistent, replicated message queues</li>
                <li>Intro</li>
                <ol>
                  <li>Version history</li>
                  <li>Tested queues</li>
                </ol>
                <li>Queue characteristics</li>
                <li>Testing methodology</li>
                <ol>
                  <li>Server setup</li>
                </ol>
                <li>Mongo</li>
                <li>SQS</li>
                <li>RabbitMQ</li>
                <li>HornetQ</li>
                <li>ActiveMQ</li>
                <li>Kafka</li>
                <li>Summary</li>
                <li>Comments</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</article>

<link rel="stylesheet" href="/res/pygments-github.css" />

