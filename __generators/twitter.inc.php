<?php

date_default_timezone_set('Europe/Warsaw');

// wp-content/themes/softwaremill/functions.php

function buildBaseString($baseURI, $method, $params) {
  $r = array();
  ksort($params);
  foreach($params as $key=>$value){
      $r[] = "$key=" . rawurlencode($value);
  }
  return $method."&" . rawurlencode($baseURI) . '&' . rawurlencode(implode('&', $r));
}

function buildAuthorizationHeader($oauth) {
  $r = 'Authorization: OAuth ';
  $values = array();
  foreach($oauth as $key=>$value)
      $values[] = "$key=\"" . rawurlencode($value) . "\"";
  $r .= implode(', ', $values);
  return $r;
}

function callTwitter($url, $query) {
  $oauth_access_token        = "***REMOVED***";
  $oauth_access_token_secret = "***REMOVED***";
  $consumer_key              = "***REMOVED***";
  $consumer_secret           = "***REMOVED***";

  $oauth = array(
    'oauth_consumer_key'     => $consumer_key,
    'oauth_nonce'            => time(),
    'oauth_signature_method' => 'HMAC-SHA1',
    'oauth_token'            => $oauth_access_token,
    'oauth_timestamp'        => time(),
    'oauth_version'          => '1.0'
  );
  $oauth = array_merge($oauth, $query);

  $base_info = buildBaseString($url, 'GET', $oauth);
  $composite_key = rawurlencode($consumer_secret) . '&' . rawurlencode($oauth_access_token_secret);
  $oauth_signature = base64_encode(hash_hmac('sha1', $base_info, $composite_key, true));
  $oauth['oauth_signature'] = $oauth_signature;

  // Make Requests
  $header = array(buildAuthorizationHeader($oauth), 'Expect:');
  $options = array(
    CURLOPT_HTTPHEADER     => $header,
    CURLOPT_HEADER         => false,
    CURLOPT_URL            => $url.'?'.http_build_query($query),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_SSL_VERIFYPEER => false
  );

  $feed = curl_init();
  curl_setopt_array($feed, $options);
  $json = curl_exec($feed);
  curl_close($feed);

  return json_decode($json);
}

// wp-content/themes/softwaremill/page-templates/blog.php

function twitterify($ret) {
  $ret = trim($ret);
  while ($ret != stripslashes($ret)) { $ret = stripslashes($ret); }
  $ret = strip_tags($ret,"<b><i><u>");
  $ret = preg_replace("/(?<!http:\/\/)www\./","http://www.",$ret);
  $ret = preg_replace( "/((http|ftp)+(s)?:\/\/[^<>\s]+)/i", "<a href=\"\\0\" target=\"_blank\">\\0</a>",$ret);
  $ret = preg_replace("/@(\w+)/", "<a href=\"http://www.twitter.com/\\1\" target=\"_blank\">@\\1</a>", $ret);
  $ret = preg_replace("/#(\w+)/", "<a href=\"http://twitter.com/search?q=\\1\" target=\"_blank\">#\\1</a>", $ret);
  return $ret;
}

