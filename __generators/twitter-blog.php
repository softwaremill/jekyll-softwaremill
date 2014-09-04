<?php

require('twitter.inc.php');

// Adapted: wp-content/themes/softwaremill/page-templates/blog.php

$team = require('team-config.php');
$from = '';
foreach($team as $i=>$member){
  $username = $member['twitter'];
  if ($username !== NULL) {
    if ($from !== '') {
      $from .= '+OR+';
    }
    $from .= 'from:'.$username;
  }
}
$tweetsUrl = 'https://api.twitter.com/1.1/search/tweets.json?q=%23freebandnames&since_id=24012619984051000&max_id=250126199840518145&result_type=mixed&count=4';


$item = 0;
$tweetsArray = callTwitter('https://api.twitter.com/1.1/search/tweets.json', array(
  'q'     => $from,
  'count' => 100
));

if ($tweetsArray){
  foreach($tweetsArray as $i => $tweet_person){
    foreach($tweet_person as $i => $tweet){
      if (is_object($tweet) AND $tweet->retweeted == FALSE){
        $tweets[$item] = array();
        $tweets[$item]['name'] = $tweet->user->name;
        $tweets[$item]['screen_name'] = $tweet->user->screen_name;
        $tweets[$item]['image'] = $tweet->user->profile_image_url_https;
        $tweets[$item]['created'] = explode(' ', $tweet->created_at);
        $tweets[$item]['date'] = strtotime($tweet->created_at);
        $tweets[$item]['text'] = twitterify($tweet->text);
        $item++;
      }
    }
  }
}

usort($tweets, function($a, $b){
   return ($a['date'] > $b['date']) ? -1 : 1;
});

foreach ($tweets as $key => $value) {
  if (!isset($value['name'])) {
    unset($tweets[$key]);
  }
}

if (count($tweets) < 2){
  echo '<div class="tweet-box">';
    echo '<div class="item clearfix">';
      echo '<div class="text">';
        echo 'Sorry, but twitter stream is currently unavailable.';
      echo '</div>';
    echo '</div>';
  echo '</div>';
  exit(1);
}else{
  for($i = 0; $i < count($tweets)-count($tweets)%5; $i++){
    if ( $i%5 == 0){
      echo '<div class="tweet-box">';
    }
    echo '<div class="item clearfix">';
      echo '<figure><img src="'.$tweets[$i]['image'].'" alt="'.$tweets[$i]['name'].'"/></figure>';
      echo '<div class="text">';
        echo '<h6 class="clearfix"><span>'.$tweets[$i]['name'].'</span> <a href="http://twitter.com/'.$tweets[$i]['screen_name'].'" target="_blank">@'.$tweets[$i]['screen_name'].'</a> <span class="date">'.$tweets[$i]['created'][1].' '.$tweets[$i]['created'][2].'</span></h6>';
        echo $tweets[$i]['text'];
      echo '</div>';
    echo '</div>';
    if ( $i%5 == 4){
      echo '</div>';
    }
  }
}