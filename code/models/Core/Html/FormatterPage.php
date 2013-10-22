<?php
class unformatter_page
{
	public $text;
	function unformatter_page($text)
	{
		$this->text=$text;
	}

	function unscape($text)
	{
		return html_entity_decode($text,ENT_COMPAT,'UTF-8');
	}
	function process()
	{
		
		$text=str_replace('<p class="long_p">&nbsp;</p>','<br />',$this->text);
		$text=explode("<br />",$text);

		foreach ($text as &$line) {
			//empty
			$line=str_replace(array("\r","\n"),'',$line);

			$line=strip_tags($line);
		}

		$text=implode("\r\n",$text);
		return $text;
	}
}
class formatter_page
{
	public $text;
	function formatter_page($text)
	{
		$this->text=$text;
	}
	function escape($text)
	{
		return htmlentities($text,ENT_COMPAT,'UTF-8');
	}
	function replace_tags($line,$tags=null)
	{
		$new_line=$line;

		//match any tags
		/*preg_match_all('/\[([^\[]*)\]/', $new_line, $all_matches, 0);

		if (count($all_matches)<=0) {
			return $new_line;
		}
		$all_matches=$all_matches[1];
		foreach ($all_matches as $match) {

				$explode=explode(':',$match);
				$tag=$explode[0];

				$original_match='['.$match.']';
				$new_match=sprintf('<span class="tag_%s tags">',$tag).$original_match.'</span>';
				//$new_match=$original_match;

				$new_line=str_replace($original_match,$new_match,$new_line);

		}*/
		$new_line=str_replace('[','<span class="tags">[',$new_line);
		$new_line=str_replace(']',']</span>',$new_line);



		return $new_line;
	}

	function replace_once($needle, $replace, $haystack) {

	   $pos = strpos($haystack, $needle);
	   if ($pos === false) {
		   // Nothing found
		   return $haystack;
	   }
	   return substr_replace($haystack, $replace, $pos, strlen($needle));
	}

	function process()
	{

		$text=explode("\n",str_replace("\r",'',$this->text));


		foreach ($text as &$line) {
			$line=$this->replace_tags($line);
			//$line=str_replace('{','[<span class="inner_bracket">',$line);
			//$line=str_replace('}','</span>]',$line);
		}

		$text=implode("<br />\r",$text);
		return $text;
	}
}