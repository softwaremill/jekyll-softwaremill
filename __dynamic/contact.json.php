<?php

foreach(['name', 'email', 'message', 'url'] as $env) {
  $_POST[$env] = getenv($env);
}

// wp-content/themes/softwaremill/contact.json.php

$to = 'hello@softwaremill.com';
$from = 'notifications@softwaremill.pl';

$subject     = 'Contact from SoftwareMill website';
$name        = trim(@$_POST['name']);
$email       = trim(@$_POST['email']);
$message     = trim(@$_POST['message']);
$trollissimo = trim(@$_POST['url']); # Previously 'trolissimo'

if (!$email || !strpos($email, '@') || !$message || $trollissimo) {
    echo json_encode(false);
    exit;
}

$subject = '=?UTF-8?B?'.$subject.'?=';
$message_all = "from: SoftwareMill Website <".$from.">\n-----------------------------\n";
$message_all = "Reply-To: ".$name." <".$email.">\n-----------------------------\n";
$message_all .= wordwrap($message, 70);
$headers = "MIME-Version: 1.0\r\nContent-type: text/plain; charset=UTF-8\r\n";
$headers.= 'From: '. $to . "\r\n" .
    'Reply-To: ' .$email. "\r\n" .
    'X-Mailer: PHP/' . phpversion();

echo json_encode(mail($to, $subject, $message_all, $headers));
