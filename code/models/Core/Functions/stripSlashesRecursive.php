<?php
function strip_slashes_recursive( $variable )
{
    if ( is_string( $variable ) )
        return stripslashes( $variable ) ;
    if ( is_array( $variable ) )
        foreach( $variable as $i => $value )
            $variable[ $i ] = strip_slashes_recursive( $value ) ;

    return $variable ;
}

if (get_magic_quotes_gpc()) {
		if(
		(  function_exists("get_magic_quotes_gpc") && get_magic_quotes_gpc()  )
		 || (  ini_get('magic_quotes_sybase') && ( strtolower(ini_get('magic_quotes_sybase')) != "off" )  )
	   ){
		$_GET=strip_slashes_recursive($_GET);
		$_POST=strip_slashes_recursive($_POST);
		$_COOKIE=strip_slashes_recursive($_COOKIE);
	}

}
