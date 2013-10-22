<?php
function slug($text)
{
	$text=str_replace('&','and',$text);
	return strtolower(str_replace(array(' ','-'),"_",preg_replace("/[^a-zA-Z0-9 _-]/","",$text)));
}