<?php
/* FORMATTER FUNCTIONS */
class formatter_frontend
{

	function formatter_frontend($text)
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
						$line_number=" " . $match[1].' ';
						break;
					case 'exit':
						$new_match='<span class="exit">{'.$match[1].'</span>';
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
						$new_match='<span class="'.$match[0].' number_end" data-name="'.$match[1].'" id="number_'.$match[2].'_end" data-rel="'.$match[2].'"></span>';
						break;
					case 'number1':
					case 'number2':
					case 'number3':
					case 'number4':
					case 'number5':
						$new_match='<span class="'.$match[0].' number_start" data-name="'.$match[1].'" id="number_'.$match[2].'_start" data-rel="'.$match[2].'"></span>';
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
				if (trim(str_replace('&nbsp;','',$started_character))) {
					$new_line='<span class="start_char"><span class="number2 number_start" data-name="Gregory" id="number_def0_start" data-rel="def0"></span>'.$started_character.'<span class="number2_end number_end" data-name="Gregory" id="number_def0_end" data-rel="def0"></span></span>'.$new_line;//chracter before wrap
				}else{
					$new_line='<span class="start_char">'.$started_character.'</span>'.$new_line;//chracter before wrap
				}
			}
			$new_line='<span class="line">'.$line_number.'</span>' . $new_line;//line numbers before wrap
		}
		return $new_line . '<span class="line_end">&nbsp;</span>';
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
		$wrapper=html('div')->class('textContainer');
		if (strpos($this->text,'[plain]')!==false) {
			$wrapper->addClass('plainContainer');
			return str_replace('[plain]', '', $this->text);
		}


		$text=explode("\n",str_replace("\r",'',$this->text));

		foreach ($text as &$line) {
			$line=$this->replace_tags($line,array('exit'));
			$line=$this->replace_tags($line);
			$line=str_replace('{','[',$line);
			$line=str_replace('}',']',$line);
		}

		$text=implode("<br />\r",$text);
		return $wrapper->append($text) . html('div')->class('PlayscriptClear');
	}
}