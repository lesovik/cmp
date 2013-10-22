<?php
class Html_Object
{
    private $_tag;
    public $_is_empty=true;
    private $_args;
    private $_contents;
    private $_short_tags=array('img','link');
    /**
     *
     * @param string $tag
     * @return html_object
     */
    public function __construct($tag) {
        $this->_tag = $tag;
        $this->_contents=array();
        $this->_args=array();
    }

    public function __toString() {
        return $this->_buildHtml();
    }
   
    /**
     *
     * @param string $func
     * @param array $args
     * @return html_object
     */
    public function __call($func, $args)
    {
        if (count($args)>0) {
            $this->_args[$func]=$args[0];
            return $this;
        }else{
            return $this->_args[$func];
        }
    }
    public function __get($name) {
        return $this->_args[$name];
    }
    public function __set($name, $value) {
        $this->_args[$name]=$value;
    }
    /**
     *
     * @param html_object $tag
     */
    public function append($tag)
    {
        $this->_contents[]=$tag;
        $this->_is_empty=false;
        return $this;
    }

    /**
     *
     * @param html_object $tag
     */
    public function prepend($tag)
    {
        array_unshift($this->_contents,$tag);
        $this->_is_empty=false;
        return $this;
    }
	
    public function remove($tag,$type='tag')
    {
        if ($type=='arg') {
            unset($this->_args[$tag]);
        }else{
            foreach ($this->_contents as $key=>$content) {
                if ($content==$tag) {
                    unset($this->_contents[$key]);
                    break;
                }
            }
        }

        return $this;
    }

    /**
     *
     * @param string $new_tag
     * @return html_object
     */
    public function changeTag($new_tag)
    {
        $this->_tag=$new_tag;
        return $this;
    }

    private function _buildHtml()
    {
        $string='<'.$this->_tag;
        if ($this->_args) {
            foreach ($this->_args as $name=>$value) {
                $string.=sprintf(' %s="%s"',$name,$value);
            }
        }

        if (in_array($this->_tag,$this->_short_tags)) {
            return $string.=' />';
        }
        $string.='>';
        foreach ($this->_contents as $content) {
            $string.=(string)$content;
        }
        $string.='</' . $this->_tag . '>' . "\n";
        return $string;
    }
	public function data($data,$value)
	{
		$this->_args['data-'.$data]=($value);
		return $this;
	}
}

//Usage Examples
//
//
//$a_tag=html('a')->href('hello.com')->changeTag('b')->append('test')->prepend(html('span')->class('bullet'));
//
//
//echo $a_tag . "\n";
//echo 'href test: '  . $a_tag->href() . "\n";
//echo 'href test 2: '  . $a_tag->href . "\n";
//echo 'href test 3: '  . ($a_tag->href='google.ca') . ' = ' . $a_tag->href() . "\n";
//
//$span_tag=html('span')->alt('this tag should not display');
//
//$a_tag
//    ->append(    html('img')->src('hello')->alt('should not display')->remove('alt','arg'))
//    ->append(    'some normal text')
//    ->prepend(    html('span')->class('bullet')->append($span_tag)->remove($span_tag));
//echo $a_tag . "\n";
//
////some usage examples, ul li dl dt dd
//$ul_tag=html('ul');
//
//for ($i=0;$i<10;$i++) {
//    $li_tag=html('li');
//    $dl_tag=$li_tag->append(html('dl'));
//    $dl_tag->append(html('dt')->append('Something #'.$i.':'));
//    $dl_tag->append(html('dd')->append('Value!'));
//
//    $ul_tag->append($li_tag);
//
//    //OR
//    //$li_tag->append(html('dl')->append(html('dt'))->append(html('dd')));
//}
