<?php

foreach(['email', 'lang'] as $env) {
  $_POST[$env] = getenv($env);
}

// wp-content/themes/softwaremill/newsletter.json.php

// MailChimp API Key
$apiKey = '***REMOVED***';

// MailChimp list unique IDs
$lists = array(
	'en' => 'e06444253f'
);

/* ------------------------------------------------------------------------- */

require_once 'lib/MCAPI.class.php';

$api = new MCAPI($apiKey);

$email = @$_POST['email'];
$lang  = @$_POST['lang'];

$retval = $api->listSubscribe(@$lists[$lang], $email, array(
	'MC_LANGUAGE' => $lang,
	'EMAIL'       => $email
));

if ($api->errorCode) {
	$result = array(
		'result'    => false,
		'errorCode' => $api->errorCode,
		'message'   => $api->errorMessage
	);
} else {
    $result = array(
    	'result'  => true,
    	'message' => 'Thank you for subscribing.'
    );
}

header('Content-Type: application/json');
echo json_encode($result);
