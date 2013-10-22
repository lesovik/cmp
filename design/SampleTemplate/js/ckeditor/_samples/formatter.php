<?php
class unformatter
{
	public $text;
	function unformatter($text)
	{
		$this->text=$text;
	}

	function unscape($text)
	{
		return html_entity_decode($text,ENT_COMPAT,'UTF-8');
	}
	function replace_tags($line,$tags=null)
	{
		$line=$this->unscape($line);

		$has_stage=false;
		$has_continue=false;
		$has_quote=false;
		$has_center=false;

		$i=0;
		while (true) {
			$i++;
			if ($i>5000) {
				die('INFINITE LOOP:' . $line . ' Tags: ' . ($tags?'Y':'N'));
			}
			$found=false;


			/*//replace character text (OLD NUMBERS)
			for ($i=1;$i<=5;$i++) {
				preg_match('/<span class="number'.$i.'">(.*?)<\/span>/', $line, $matches, 0);
				if ($matches) {//CHARR
					$line=str_replace($matches[0], '[number'.$i.':' . $matches[1] . ']', $line);$found=true;
				}
			}*/



			//replace character text
			do {
				preg_match('/<span class="char">(.*?)<\/span>/', $line, $matches, 0);
				if ($matches) {//CHARR
					$matches[1]=explode('/',$matches[1]);
					if (count($matches[1])>1) {
						$matches[1]=$matches[1][0].':'.$matches[1][1];
					}else{
						$matches[1]=$matches[1][0];
					}
					$line=str_replace($matches[0], '[char:' . $matches[1] . ']', $line);$found=true;
				}
			}while ($matches);

			do {
				//replace new numbers
				for ($i=1;$i<=5;$i++) {
					preg_match('/<img class="number'.$i.'" dname="(.*?)"(.*?)rel="(.*?)"(.*?)\/>/', $line, $matches, 0);
					if ($matches) {//CHARR

						$line=str_replace($matches[0], '[number'.$i.':' . $matches[1].':' . $matches[3] . ']', $line);$found=true;
					}
				}
			}while ($matches);

			do {
				//replace new numbers
				for ($i=1;$i<=5;$i++) {
					preg_match('/<img class="number'.$i.'_end" dname="(.*?)"(.*?)rel="(.*?)"(.*?)\/>/', $line, $matches, 0);
					if ($matches) {//CHARR

						$line=str_replace($matches[0], '[number'.$i.'_end:' . $matches[1].':' . $matches[3] . ']', $line);$found=true;
					}
				}
			}while ($matches);

			//replace inner brackets
			preg_match('/<span class="inner_bracket">(.*?)<\/span>/', $line, $matches, 0);
			if ($matches) {
				$line=str_replace($matches[0], $matches[1], $line);$found=true;

			}

			//replace exit
			preg_match('/<span class="exit">\{(.*)\}<\/span>/', $line, $matches, 0);
			if ($matches) {

				$line=str_replace($matches[0], '[exit:' . $matches[1] . ']', $line);$found=true;
			}

			//replace lines back
			preg_match('/<span class="line">(.*?)<\/span>/', $line, $matches, 0);
			if ($matches) {
				$line=str_replace($matches[0], '[line:' . $matches[1] . ']', $line);$found=true;
			}

			//replace stage
			preg_match('/<span class="equote">(.*?)<\/span>/', $line, $matches, 0);
			if ($matches) {

				$line=str_replace($matches[0], (!$has_stage?'[quote]' . $matches[1]:''), $line);$found=true;
				$has_quote=true;
			}
			//replace stage
			preg_match('/<span class="ecenter">(.*?)<\/span>/', $line, $matches, 0);
			if ($matches) {

				$line=str_replace($matches[0], (!$has_stage?'[center]' . $matches[1]:''), $line);$found=true;
				$has_center=true;
			}

			//replace chorus
			preg_match('/<span class="chorus">(.*?)<\/span>/', $line, $matches, 0);
			if ($matches) {
				$line=str_replace($matches[0], '[chorus]' . $matches[1], $line);$found=true;
			}

			//replace stage
			preg_match('/<span class="stage">(.*?)<\/span>/', $line, $matches, 0);
			if ($matches) {

				$line=str_replace($matches[0], (!$has_stage?'[stage]' . $matches[1]:''), $line);$found=true;
				$has_stage=true;
			}






			//replace inner brackets
			preg_match('/<span class="continue">(.*?)<\/span>/', $line, $matches, 0);
			if ($matches) {

				$line=str_replace($matches[0], (!$has_continue?'[continue]' . $matches[1]:''), $line);$found=true;
				$has_continue=true;
			}


			//replace normal text

				preg_match('/<span class="normal">(.*?)<\/span>/', $line, $matches, 0);
				if ($matches) {
					$line=str_replace($matches[0], $matches[1], $line);$found=true;
				}


			//replace start character text
			preg_match('/<span class="start_char">(.*?)<\/span>/', $line, $matches, 0);
			if ($matches) {
				$line=str_replace($matches[0], $matches[1], $line);$found=true;
			}









			if (!$found) {
				break;
			}
		}

		$line=trim($line);

		return $line;
	}

	function process()
	{
		$text=explode("<br />",$this->text);

		foreach ($text as &$line) {
			//empty
			$line=str_replace(array("\r","\n"),'',$line);
			$line=str_replace(array('<p>','</p>'),'',$line);
			$line=str_replace('<span class="line">&nbsp;</span>','',$line);
			$line=str_replace('<span class="start_char">&nbsp;</span>','',$line);


			$line=$this->replace_tags($line);
		}

		$text=implode("\r\n",$text);
		return $text;
	}
}

class formatter
{
	public $text;
	function formatter($text)
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
		$line_type='normal';
		$line_number='&nbsp;';
		$started_character='&nbsp;';
		$hide_character=false;
		$i=0;


		$current_tag=0;

		while (true) {

			if (!$tags) {
				//match any tags
				preg_match('/\[([^\[]*)\]/', $new_line, $matches, 0);

				$matches=count($matches)>0?array($matches[1]):$matches;
			}else{
				//these tags are matched first to make sure that there is no conflict
				$line_prefix=$tags[$current_tag];
				preg_match('/\[('.$line_prefix.'.*)\]/', $new_line, $matches, 0);

				$matches=count($matches)>0?array($matches[1]):$matches;


				if (count($matches)==0) {
					$current_tag++;
				}
				if ($current_tag>=count($tags)) {
					break;
				}

			}


			$i++;
			if ($i>5000) {
				print_r($tags);
				print_r($matches);
				die('INFINITE LOOP:' . $new_line);
			}



			foreach ($matches as $match) {
				$original_match='['.$match.']';
				if (!$tags) {
					$match=explode(':',$match);
				}else{
					$match=array(substr($match, 0, strpos($match, ':')),substr($match, strpos($match, ':')+1));
				}


				$new_match=null;
				switch ($match[0]) {
					case 'char':
						$character_text=count($match)>2?$match[2]:$match[1];

						if (strpos($new_line,$original_match)===0 && !$hide_character) {

							//for character line in beginning
							$new_match='';///CHARR
							$started_character=sprintf('<span class="char">%s</span>',$this->escape($match[1]) . ($character_text && $character_text!=$match[1]?'/'.$character_text:''));
						}else{
							//for all characters inside///CHARR
							$new_match=sprintf('<span class="char">%s</span>',$this->escape($match[1]) . ($character_text && $character_text!=$match[1]?'/'.$character_text:''));
						}
						break;
					case 'chorus':
						$new_match='';
						$line_type='chorus';
						$hide_character=true;
						break;
					case 'quote':
						$new_match='';
						$line_type='equote';
						$hide_character=true;
						break;
					case 'center':
						$new_match='';
						$line_type='ecenter';
						$hide_character=true;
						break;
					case 'stage':
						$line_type='stage';
						$new_match='';
						$hide_character=true;
						break;

					case 'line':
						$new_match='';
						$line_number=$match[1];
						break;
					case 'exit':
						$new_match='<span class="exit">{'.$match[1].'}</span>';
						break;
					case 'continue':
						$new_match='';
						$new_line='<span class="continue">' . $new_line . '</span>';
						break;
					case 'number1_end':
					case 'number2_end':
					case 'number3_end':
					case 'number4_end':
					case 'number5_end':
						$new_match='<img class="'.$match[0].'" dname="'.htmlentities($match[1],ENT_QUOTES,'UTF-8').'" rel="'.$match[2].'" src="/cmp_editor_test/plugins/oxford_anchor/images/'.$match[0].'.gif">';
						break;
					case 'number1':
					case 'number2':
					case 'number3':
					case 'number4':
					case 'number5':
						$new_match='<img class="'.$match[0].'" dname="'.htmlentities($match[1],ENT_QUOTES,'UTF-8').'" rel="'.$match[2].'" src="/cmp_editor_test/plugins/oxford_anchor/images/'.$match[0].'.gif" />';
						break;
					default:
						$new_match='';
						echo('NO MATCH FOR:'.$match[0] . ' line:'. $new_line);
				}
				if ($new_match!==null) {
					$new_line=$this->replace_once($original_match,$new_match,$new_line);
				}

			}
			if (count($matches)<=0 && !$tags || !$matches && !$tags) {
				break;
			}

		}


		if (!$tags) {
			$new_line='<span class="'.$line_type.'">'.$new_line.'</span>';//line type wrap
			if (!$hide_character) {
				$new_line='<span class="start_char">'.$started_character.'</span>'.$new_line;//chracter before wrap
			}
			$new_line='<span class="line">'.$line_number.'</span>' . $new_line;//line numbers before wrap
		}
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
			$line=$this->replace_tags($line,array('exit'));
			$line=$this->replace_tags($line);
			//$line=str_replace('{','[<span class="inner_bracket">',$line);
			//$line=str_replace('}','</span>]',$line);
		}

		$text=implode("<br />\r",$text);
		return $text;
	}
}