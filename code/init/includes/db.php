<?php
switch ($_SERVER['HTTP_HOST']) {
	case 'mpdev.oxfordnext.com':
		$dsn = 'mysql:dbname=oxnext_mpdev;host=localhost';
		$database_name='oxnext_mpdev';
		$host='localhost';
		$user = 'oxnext_mpdev';
		$password = 'aygAu4mhtwRs';
		break;
	case 'cms.oxfordnext.com':
		$dsn = 'mysql:dbname=oxnext_cms;host=localhost';
		$database_name='oxnext_cms';
		$host='localhost';
		$user = 'oxnext_cms';
		$password = '8UOFAk7iU8xP';
		break;
	case 'oxfordnext.com':
	case 'www.oxfordnext.com':
		$dsn = 'mysql:dbname=oxnext_live;host=localhost';
		$database_name='oxnext_live';
		$host='localhost';
		$user = 'oxnext_live';
		$password = '0CED5Jc7lok2';
		break;
	case 'cmp.localhost':
		$dsn = 'mysql:dbname=cmp;host=localhost';
		$database_name='cmp';
		$host='localhost';
		$user = 'root';
		$password = '';
		break;
	case 'oxfordtest.mpserve1.com':
		$dsn = 'mysql:dbname=mpserve1_cmp;host=localhost';
		$database_name='mpserve1_cmp';
		$host='localhost';
		$user = 'mpserve1_cmp';
		$password = 'myub#3-F.aF{';
		break;	
	case 'cmpoxford.mpserve1.com':
		$dsn = 'mysql:dbname=mpserve1_cmpoxford;host=localhost';
		$database_name='mpserve1_cmpoxford';
		$host='localhost';
		$user = 'mpserve1_cmp';
		$password = 'myub#3-F.aF{';
		break;	
}
// myub#3-F.aF{