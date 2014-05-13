<?php

require('twitter.inc.php');

// Adapted: wp-content/themes/softwaremill/page-templates/home.php

$tweets = callTwitter('https://api.twitter.com/1.1/statuses/user_timeline.json', array(
  'screen_name'      => 'softwaremill',
  'include_rts'      => true,
  'include_entities' => true,
  'count'            => 20
));

if (count($tweets) < 2) {
  exit(1);
}

foreach($tweets as $i => $tweet){

  if ($tweet->retweeted === TRUE){
    $name = $tweet->retweeted_status->user->name;
    $screen_name = $tweet->retweeted_status->user->screen_name;
    $image = $tweet->retweeted_status->user->profile_image_url;
  }else{
    $name = $tweet->user->name;
    $screen_name = $tweet->user->screen_name;
    $image = $tweet->user->profile_image_url;
  }

  ?>

  <div class="tweet clearfix">
    <figure><a href="http://twitter.com/softwaremill" target="_blank">
      <img src="/img/twitter-logo01.png" alt="SoftwareMill's twitter" class="sm-logo" />
      <img src="/img/twitter-logo02.png" alt="SoftwareMill's twitter" class="tw-logo"/>
    </a>
    </figure>
    <div class="entry">
      <h6><a href="http://twitter.com/softwaremill" target="_blank">@<?php echo $screen_name; ?></a></h6>
      <p><?php echo twitterify($tweet->text); ?></p>
    </div>
  </div>

  <?php
}
