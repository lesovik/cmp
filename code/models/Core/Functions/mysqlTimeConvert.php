<?php
function mysqlTimeConvert($mysql_timestamp){
	if (preg_match('/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/', $mysql_timestamp, $pieces)
		|| preg_match('/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/', $mysql_timestamp, $pieces)) {
			$unix_time = mktime($pieces[4], $pieces[5], $pieces[6], $pieces[2], $pieces[3], $pieces[1]);
	} elseif (preg_match('/\d{4}\-\d{2}\-\d{2} \d{2}:\d{2}:\d{2}/', $mysql_timestamp)
		|| preg_match('/\d{2}\-\d{2}\-\d{2} \d{2}:\d{2}:\d{2}/', $mysql_timestamp)
		|| preg_match('/\d{4}\-\d{2}\-\d{2}/', $mysql_timestamp)
		|| preg_match('/\d{2}\-\d{2}\-\d{2}/', $mysql_timestamp)) {
			$unix_time = strtotime($mysql_timestamp);
	} elseif (preg_match('/(\d{4})(\d{2})(\d{2})/', $mysql_timestamp, $pieces)
		|| preg_match('/(\d{2})(\d{2})(\d{2})/', $mysql_timestamp, $pieces)) {
			$unix_time = mktime(0, 0, 0, $pieces[2], $pieces[3], $pieces[1]);
	}
  return $unix_time;
}