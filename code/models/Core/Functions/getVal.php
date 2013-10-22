<?php
function getVal($name,$type=null,$default=null) {
	if ($type===null) {
		$check=array('POST','GET');
	}else{
		$check=is_array($type)?$type:array($type);
	}
	foreach ($check as $check_item) {
		$check_item=strtoupper($check_item);
		
		switch ($check_item) {
			//allowed globals
			case 'POST':
			case 'GET':
			case 'FILES':
			case 'COOKIE':
			case 'ENV':
			case 'SERVER':
			case 'REQUEST':
			case 'SESSION':
				break;
			default:
				die('Invalid param:'.$name. ' for getVal');
		}

		if (!isset($GLOBALS['_'.$check_item][$name])) {
			continue;
		}
		
		$result=$GLOBALS['_'.$check_item][$name];
		
		if (get_magic_quotes_gpc()) {
			return stripslashes($result);
		}

		return $result;
	}
	return $default;
}