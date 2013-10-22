<?php

/**
 *
 * @author     Les
 */
require_once(_ROOT . 'code/models/Core/Base/Api.php');

class Base extends Api {
	function clobHasEditor($lbl)
	{
		return true;
	}
    function getBaseForm($show_actions=true) {
        if ($_POST) {
            $this->getBasePost();
            if (!$this->isValid()) {
                echo 'Invalid';
                die();
            } else {
                $this->save();
                if(isset($_POST['submit_ajax'])){
                   die();
                }
                if ($_POST['submit']==getLabel('form_submit') || $_GET['action']=='create') {
                    $this->getBaseListRedirect();
                    die();
                } else {
                    $id = '';
                    foreach ($this->identifier() as $key => $val) {
                        $id.="&" . $key . "=" . $val;
                    }
                    $this->getBaseListRedirect('update', $id);
                    die();
                }
            }
        }
        $form = $this->getBaseFilterFormTag();
        $form->append($this->getBaseFormFields());
        if (count($this->identifier()) > 0) {
            $form->append($this->getBaseFormsSubmit('form_submit_stay'));
        }
        $form->append($this->getBaseFormsSubmit('form_submit'));
        return ($show_actions)?$this->getBaseActions() . $form:$form;
    }

    function getBaseFilterFormTag() {
        $form = html('form')
                ->action('')
                ->enctype('multipart/form-data')
                ->method('POST');
        return $form;
    }

    function getBaseFilterForm() {
        $obj = html('input')
                ->type('hidden')
                ->value(get_class($this))
                ->name('obj');
        $action = html('input')
                ->type('hidden')
                ->value('explore')
                ->name('action');
        if (isset($_GET['submit']) && $_GET['submit']=='Clear') {
            $_GET = array('obj' => get_class($this), 'action' => 'explore');
        }
        $div = html('div')
                ->class(BASE_FILTER_BUTTONS_DIV_CLASS)
                ->append($this->getBaseFormsSubmit('filter_list') . $this->getBaseFormsClear('clear_filter'));
        $form = html('form')
                ->method('GET')
                ->enctype('multipart/form-data')
                ->append($obj)
                ->append($action)
                ->append($div)
                ->append($this->getBaseFormFields(true));
        $div = html('div')
                ->class(BASE_FILTER_DIV_CLASS)
                ->append($form);
        return $div;
    }

    function getBaseFormColumnFields(&$fields, $columns, $is_filter=false) {
        foreach ($columns as $lbl => $data) {
            $id = $this->identifier();
            if (strpos($lbl, 'id')===false || ( strpos($lbl, '_id')===false && $is_filter)) {
                $typeSize = explode("(", trim($data['type'], ')'));
                $func = "getBaseForm" . ucfirst($typeSize[0]);
                if (method_exists($this, $func)) {
                    $fields->append($this->$func($lbl, ucfirst($typeSize[0]), $is_filter));
                } else {
                    $fields->append($this->getBaseFormInteger($lbl, ucfirst($typeSize[0]), $is_filter));
                }
            }
        }
    }

    function getBaseFormRelationFields(&$fields, $type, $is_filter=false) {
          
        if (isset($this->schema['relations'])) {
            foreach ($this->schema['relations'] as $relation => $options) {
				if (isset($this->schema['noBaseFormRelationship']) && in_array($relation,$this->schema['noBaseFormRelationship'])) {
					continue;
				}
                if (array_key_exists('type', $options) && $options['type']=='many') {
                    if (!$is_filter && count($this->identifier()) > 0) {
                        
                        $fields->append($this->getBaseFormCheckBoxSet($relation));
                        
                    }
                } else {
                    
                    $hay1 = (isset($this->schema['noList'])) ? $this->schema['noList'] : array();
                    $hay2 = (isset($this->schema['noBaseForm']) && $type!='list') ? $this->schema['noBaseForm'] : array();
                    if (!in_array($options['local'], $hay1) && ! in_array($options['local'], $hay2)) {
                        if ($this->schema['relations'][$relation]['class']=='CoreFile') {
                            $fields->append($this->getBaseFormFile($relation, $is_filter));
                        } else {
                           
                            $fields->append($this->getBaseFormSelect($relation, $is_filter));
                        }
                    }
                }
            }
        }
    }

    function getBaseFormFile($relation, $is_filter=false) {
        $relation_row = $this->schema['relations'][$relation];
        $file_value = $this->{$relation_row['local']};

        if ($relation!='Trace') {
            $file_controls = '';
            if ($file_value) {

                $relation_class = $this->$relation;

				if (getVal('delete_file')==$relation) {
					$this->{$relation_row['local']}=null;
					$this->save();
					$relation_class->tryDelete(true);
					exit();
				}

                $file_controls = $relation_class->getFieldValue($relation,$this);
                //pr($relation_class->toArray());
            }
            $select = html('input')
                    ->type('file')
                    ->name($this->schema['relations'][$relation]['local'])->append($file_controls);

            $label = html('label')
                    ->append(getLabel($relation));
            $field = html('div')
                    ->class(BASE_FIELD_DIV_CLASS)
                    ->id(BASE_FIELD_DIV_ID . $relation)
                    ->append($label)
                    ->append(
                            html('div')
                            ->class('RightColumn')
                            ->append($select)
                    )
            ;
            return $field;
        }
    }

    function getBaseFormFields($is_filter=false) {
        $type = ($is_filter) ? 'list' : 'form';
        $columns = $this->getBaseColumnArray($type);
        $fields = html('div')
                ->class(BASE_FIELDS_DIV_CLASS)
                ->id(BASE_FIELDS_DIV_ID . get_class($this));
        $this->getBaseFormColumnFields($fields, $columns, $is_filter);
        $this->getBaseFormRelationFields($fields, $type, $is_filter);
        return $fields;
    }

    function getBaseFormInteger($lbl, $type, $is_filter=false) {
        $val = $this->$lbl;
        if ($is_filter) {
            if (isset($_GET[$lbl])) {
                $val = $_GET[$lbl];
            }
        }
        $input = html('input')
                ->type('text')
                ->value($val)
                ->name($lbl);
        $label = html('label')
                ->append($this->getFormLabel($lbl));
        $field = html('div')
                ->class(BASE_FIELD_DIV_CLASS . " " . $type)
                ->id(BASE_FIELD_DIV_ID . $lbl)
                ->append($label)
                ->append($input);
        return $field;
    }
    function getFormLabel($lbl){
     return getLabel($lbl);
    }
    function getBaseId(){
        $identifier=$this->identifier();
        $id='';
        if(is_array($identifier) && count($identifier)>0){
            $keys=array_keys($identifier);
            $id=$identifier[$keys[0]];
        }
        return $id;
    }
    function getBaseFormClob($lbl, $type, $is_filter=false) {
        if ($is_filter) {
            return $this->getBaseFormInteger($lbl, $is_filter);
        }
        $input = html('textarea')
                ->append($this->$lbl)
                ->name($lbl);

        $id=$this->getBaseId();
       	if ($this->clobHasEditor($lbl)) {
			$input->class('has_editor');
			$input->id($lbl.$id);
		}
        $label = html('label')
                ->append(getLabel($lbl));
        $field = html('div')
                ->class(BASE_FIELD_DIV_CLASS . " " . $type)
                ->id(BASE_FIELD_DIV_ID . $lbl)
                ->append($label)
                ->append($input);
        return $field;
    }

    function getBaseFormEnum($lbl, $type, $is_filter=false) {

        $input = html('select')
                ->append($this->$lbl)
                ->name($lbl);
        if ($is_filter) {
            $option = html('option')
                    ->append('-' . getLabel('select_any_option') . '-')
                    ->value('any');
            $input->append($option);
        }
        foreach ($this->schema['columns'][$lbl]['values'] as $key => $val) {
            $option = html('option')
                    ->value($val)
                    ->append(getLabel($val));
            if ($is_filter) {
                if (isset($_GET[$lbl])
                        && $_GET[$lbl]==$val) {
                    $option->selected(true);
                }
            } elseif ($val==$this[$lbl]) {
                $option->selected(true);
            }
            $input->append($option);
        }
        $label = html('label')
                ->append(getLabel($lbl));
        $field = html('div')
                ->class(BASE_FIELD_DIV_CLASS . " " . $type)
                ->id(BASE_FIELD_DIV_ID . $lbl)
                ->append($label)
                ->append($input);
        return $field;
    }

    function getBaseFormBoolean($lbl, $type, $is_filter=false) {
        $input = html('select')
                ->append($this->$lbl)
                ->name($lbl);
        if ($is_filter) {
            $option = html('option')
                    ->append('-' . getLabel('select_any_option') . '-')
                    ->value('any');
            $input->append($option);
        }
        $values = array(0 => 'false', 1 => 'true');
        foreach ($values as $key => $val) {
            $option = html('option')
                    ->value($key)
                    ->append(getLabel($val));
            if ($is_filter) {
                if (isset($_GET[$lbl])
                        && $_GET[$lbl]==$key) {
                    $option->selected(true);
                }
            } elseif ($key==$this[$lbl]) {
                $option->selected(true);
            }
            $input->append($option);
        }
        $label = html('label')
                ->append(getLabel($lbl));
        $field = html('div')
                ->class(BASE_FIELD_DIV_CLASS . " " . $type)
                ->id(BASE_FIELD_DIV_ID . $lbl)
                ->append($label)
                ->append($input);
        return $field;
    }

    public function getAllowedExtensions($file=null) {
        return array('jpg', 'gif', 'bmp', 'png');
    }

    //@todo check file size
    function handleFile($label) {
		ini_set('upload_max_filesize','200M');
		ini_set('post_max_size','200M');
        $file_id = $this->$label;
        if ($_FILES[$label]) {
            $file = $_FILES[$label];
            $file_name = substr($file['name'], 0, strrpos($file['name'], '.'));
            $extension = slug(substr($file['name'], strrpos($file['name'], '.') + 1));
            $allowed_extensions = $this->getAllowedExtensions();

            if (in_array($extension, $allowed_extensions)) {
                //now insert the file
                $files_table = Doctrine_Core::getTable('CoreFile');
                $new_file_row = $files_table->create(array(
                            'original_name' => $file_name,
                            'extension' => $extension,
                            'size' => $file['size']
                        ));

                do {
                    $random_file = randStr(8, 'abdef01234567890');
                    $save_location = ROOT_UPLOAD_URL . $new_file_row->getUploadFolder() . '/' . $random_file . '.' . $extension;
                } while (file_exists($save_location));
                $new_file_row->name = $random_file;

                if (!move_uploaded_file($file['tmp_name'], $save_location)) {
					pr($file);
                    die('Could not upload');
                }

                $new_file_row->save();
                $file_id = $new_file_row->id;
            }
        }
        return $file_id;
    }

    function getBasePost() {

        foreach ($this->schema['columns'] as $lbl => $data) {
            if (!isset($data['primary']) || $_GET['action']=='create') {

                //find relations
                $handled = false;
                if (isset($this->schema['relations'])) {
                    foreach ($this->schema['relations'] as $relation_name => $relation) {
                        if ($relation['local']==$lbl) {

                            switch ($relation['class']) {
                                case 'CoreFile':
                                    $handled = true;
                                    $new_value = $this->handleFile($lbl);

									$this->$lbl=$new_value;
                                    break;
                            }
                        }
                    }
                }
                if (isset($_POST[$lbl]) && ! $handled) {
                    if ($_POST[$lbl]=="NULL") {
                        $this->$lbl = NULL;
                    } else {
                        $this->$lbl = $_POST[$lbl];
                    }
                }
            }
        }
        if (count($this->identifier()) && isset($this->schema['relations'])) {
            foreach ($this->schema['relations'] as $relation => $options) {
				if (isset($this->schema['noBaseFormRelationship']) && in_array($relation,$this->schema['noBaseFormRelationship'])) {
					continue;
				}
                if (array_key_exists('type', $options) && $options['type']=='many') {
                    $remote_key = $options['remote'];
                    $local_key = $options['local'];

                    $q = Doctrine_Query::create()
                            ->delete($options['refClass'])
                            ->addWhere($local_key . ' = ?', $this->id);
                    $deleted = $q->execute();
                    if (isset($_POST[$remote_key]) && is_array($_POST[$remote_key])) {
                        foreach ($_POST[$remote_key] as $key => $id) {
                            $lookup = $options['refClass'];
                            $l = new $lookup();
                            $l->$local_key = $this->id;
                            $l->$remote_key = $id;
                            $l->save();
                        }
                    }
                }
            }
        }
    }

    function getBaseFormsSubmit($lbl) {
        $input = html('input')
                ->type('submit')
                ->value(getLabel($lbl))
                ->name('submit');
        $field = html('div')
                ->class(BASE_FIELD_DIV_BUTTON_CLASS . " " . $lbl)
                ->id(BASE_FIELD_DIV_BUTTON_ID . $lbl)
                ->append($input);
        return $field;
    }

    function getBaseFormsClear($lbl) {
        if (!empty($_GET['submit'])) {
            $input = html('input')
                    ->type('submit')
                    ->value(getLabel($lbl))
                    ->name('submit');
            $field = html('div')
                    ->class(BASE_FIELD_DIV_BUTTON_CLASS . " " . $lbl)
                    ->id(BASE_FIELD_DIV_BUTTON_ID . $lbl)
                    ->append($input);
            return $field;
        }
    }

    function getBaseRelationLabel() {
        if ($this->contains('name')) {
            $name = $this->name;
        } else {
            $name = pr($this->identifier(), 1);
        }
        $name = (isset($this->schema['relationLabelColumn']) ? $this[$this->schema['relationLabelColumn']] : $name);
        return $name;
    }

    function getBaseFormOptions($lbl, $is_filter=false) {
         
//        $table = $this->getTable();
//        $all = $table->findAll();
        $query = Doctrine_Query::create()
                    ->from(get_class($this));
        $all=$query->execute();
        
        $options = array();
        $this_id=$this->getBaseId();
       
        foreach ($all as $one) {
            $one_id=$one->getBaseId();
            $option = html('option')
                    ->value($one_id)
                    ->append($one->getBaseRelationLabel());
            if ($is_filter) {
                if (isset($_GET[$lbl])
                        && $_GET[$lbl]==$one_id) {
                    $option->selected(true);
                }
            } elseif ($one_id==$this_id) {
                $option->selected(true);
            }
            $options[]=$option;
        }
        return $options;
    }

    function getBaseFormCheckboxes($collection, $remote) {
        $table = $this->getTable();
        $all = $table->findAll();
        $options = ``;
        $ids = array();
        foreach ($collection as $key => $object) {
            $ids[] = $object->identifier();
        }
        foreach ($all as $one) {
            $id = $one->identifier();
            if (count($id)==1) {
                $val = $id['id'];
                $postName = $remote . "[]";
            } else {
                $val = '';
                $postName = '';
            }
            $input = html('input')
                    ->type('checkbox')
                    ->name($postName)
                    ->value($val);
            if (in_array($one->identifier(), $ids)) {
                $input->checked(true);
            };

            $name = $one->getBaseRelationLabel();
            $label = html('label')
                    ->append($name);
            $field = html('div')
                    ->class(BASE_BOX_DIV_CLASS)
                    ->id(BASE_BOX_DIV_ID . $val)
                    ->append($input)
                    ->append($label);
            $options.=$field;
        }
        return $options;
    }

	function getBaseFormSelectOptions($relation,$is_filter,&$select)
	{
		$results=$this[$relation]->getBaseFormOptions($this->schema['relations'][$relation]['local'], $is_filter);
		return $results;
	}
    function getBaseFormSelect($relation, $is_filter=false) {
        if ($relation!='Trace') {
            $select = html('select')
                    ->type('text')
                    ->name($this->schema['relations'][$relation]['local']);
            if ($is_filter) {
                $option = html('option')
                        ->append('-' . getLabel('select_any_option') . '-')
                        ->value('any');
                $select->append($option);
            } elseif (!isset($this->schema['columns'][$this->schema['relations'][$relation]['local']]['notnull'])
                    || $this->schema['columns'][$this->schema['relations'][$relation]['local']]['notnull']===false) {
                $option = html('option')
                        ->append('-' . getLabel('empty') . '-')
                        ->value("NULL");
                $select->append($option);
            }

			$options=$this->getBaseFormSelectOptions($relation,$is_filter,$select);
			if ($options) {
				foreach ($options as $option) {
					$select->append($option);
				}
			}
            
            $label = html('label')
                    ->append(getLabel($relation));
            $field = html('div')
                    ->class(BASE_FIELD_DIV_CLASS)
                    ->id(BASE_FIELD_DIV_ID . $relation)
                    ->append($label)
                    ->append($select);
            return $field;
        }
    }

    function getBaseFormCheckBoxSet($relation) {

        $body = html('div')
                ->class(BASE_FIELD_SET_BODY_CLASS);
        $related = new $this->schema['relations'][$relation]['class'];
        $body->append($related->getBaseFormCheckboxes($this[$relation], $this->schema['relations'][$relation]['remote']));
        $head = html('div')
                ->class(BASE_FIELD_SET_HEAD_CLASS)
                ->append(getLabel($relation));
        $field = html('div')
                ->class(BASE_FIELD_DIV_CLASS . " " . BASE_FIELD_SET_CLASS)
                ->id(BASE_FIELD_DIV_ID . $relation)
                ->append($head)
                ->append($body);
        return $field->__toString();
    }

    function getBaseListRedirect($action='explore', $id='') {
        header("Location: ?obj=" . get_class($this) . "&action=" . $action . $id);
    }

    function getBaseColumnArray($type='list') {
        $listArr = array();
        if ($type=='list' && isset($this->schema['listColumns'])) {
            foreach ($this->schema['listColumns'] as $column) {
                if (!isset($this->schema['noList'])
                        || ! in_array($column, $this->schema['noList'])) {
                    $listArr[$column] = $this->schema['columns'][$column];
                }
            }
        } else {
            if (!isset($this->schema['noList']) && ! isset($this->schema['noBaseForm'])) {
                $listArr = $this->schema['columns'];
            } else {
                $hay1 = (isset($this->schema['noList'])) ? $this->schema['noList'] : array();
                $hay2 = (isset($this->schema['noBaseForm']) && $type!='list') ? $this->schema['noBaseForm'] : array();
                foreach ($this->schema['columns'] as $column => $params) {
                    if (!in_array($column, $hay1) && ! in_array($column, $hay2)) {
                        $listArr[$column] = $this->schema['columns'][$column];
                    }
                }
            }
        }
        return $listArr;
    }

    function getBaseListTableHeader() {
        $tr = html('tr')->class(BASE_LIST_TH_CLASS);
        $listArr = $this->getBaseColumnArray();
        foreach ($listArr as $column => $params) {
            $rel = false;

            if (array_key_exists('relations', $this->schema)) {
                foreach ($this->schema['relations'] as $relation => $prms) {
                    if (!array_key_exists('type', $prms) && $relation!='Trace' && $column==$prms['local']) {
                        $rel = $relation;
                        
//						if (isset($this->schema['noBaseFormRelationship']) && in_array($rel,$this->schema['noBaseFormRelationship'])) {
//							$rel=false;
//							break;
//						}
                    }
                }
            }
			
            if (strpos($column, 'trace_id')===false) {
                $td = html('th');
                if (isset($_GET['order_by'])) {
                    if ($_GET['order_by']==$column && isset($_GET['dir'])) {
                        $dir = ($_GET['dir']=='asc') ? 'desc' : 'asc';
                        $td->class(
                                ($dir=='asc') ?
                                        BASE_LIST_TH_DOWN_CLASS :
                                        BASE_LIST_TH_UP_CLASS
                        );
                    } else {
                        $dir = 'asc';
                    }
                } else {
                    $dir = 'asc';
                }
                $getstring = replaceGetString(
                                array(
                                    'order_by' => $column,
                                    'dir' => $dir
                                )
                );
                $val = ($rel) ? $rel : $column;
                $a = html('a')
                        ->href($getstring)
                        ->append(getLabel($val));
                $td->append($a);
                $tr->append($td);
            }
        }

        $td = html('th')
                ->append(getLabel('options'));
        $tr->append($td);
        return $tr;
    }

    function getBaseListTable() {
        $table = html('table')
                ->class(BASE_LIST_TABLE_CLASS)
                ->id(BASE_LIST_TABLE_ID . $this->schema['tableName']);
        $table->append($this->getBaseListTableHeader());
        $pager = $this->getBasePager();
        $items = $pager[0]->execute();
        $ruler = $this->getBasePaginationRuler($pager[0], $pager[1]);
        foreach ($items as $key => $item) {
            if ($key % 2==0) {
                $alterClass = 'Even';
            } else {
                $alterClass = 'Odd';
            }
            $table->append($item->getBaseListTableRow($alterClass));
        }
        return $ruler . $table;
    }

    function getBaseList() {;
  
       $filter = $this->getBaseFilterForm();

        $create = $this->getBaseCreateLink();

        $table = $this->getBaseListTable();
        return $filter . $create . $table;
    }

	function getBaseCreateLinkAnchor()
	{
		return html('a')
				->href('?obj=' . get_class($this) . '&action=create')
				->append(getLabel('create_new_' . get_class($this)));
	}
    function getBaseCreateLink() {
        $new = '';
        if (isAllowed($_SESSION['user_id'], get_class($this), 'create')) {
            $a = $this->getBaseCreateLinkAnchor();
            $new = html('div')
                    ->class(BASE_CREATE_DIV_CLASS)
                    ->id(BASE_CREATE_DIV_CLASS . get_class($this))
                    ->append($a);
        }
        return $new;
    }

    function getBasePager() {
        $currentPage = (isset($_GET['page'])) ? (int) $_GET['page'] : 1;
        $resultsPerPage = BASE_RESULTS_PER_PAGE;
        $query = Doctrine_Query::create()
                ->from(get_class($this));
        if (isset($_GET['order_by'])) {
            $dir = (isset($_GET['dir'])) ? $_GET['dir'] : 'asc';
            $query->orderBy($_GET['order_by'] . " " . $dir);
        }
        foreach ($this->schema['columns'] as $lbl => $data) {
            if (!empty($_GET[$lbl]) && $_GET[$lbl]!='any') {
                $typeSize = explode("(", trim($data['type'], ')'));
                switch ($typeSize[0]) {
                    case 'string':
                    case 'clob':
                    case 'timestamp':
                        $query->andWhere($lbl . ' LIKE :label', array(':label' => '%' . $_GET[$lbl] . '%'));
                        break;
                    default:
                    case 'integer':
                        $query->andWhere($lbl . '=?', $_GET[$lbl]);
                        break;
                }
            }
        }
        $pager = new Doctrine_Pager(
                        $query,
                        $currentPage,
                        $resultsPerPage
        );
        $arr = array($pager, $currentPage);
        return $arr;
    }

    function getBasePaginationRuler($pager, $current) {
        $pagerRange = new Doctrine_Pager_Range_Sliding(array('chunk' => 5), $pager);
        $pages = $pagerRange->rangeAroundPage();
        $ruler = html('div')
                ->class(BASE_LIST_RULER_CLASS);
        if ($pager->haveToPaginate()) {
            $ul = html('ul');
            $a = html('a')
                    ->href(replaceGetString(array(
                                'page' => $pager->getFirstPage()
                            )))
                    ->append(1);
            $li = html('li')
                    ->class(BASE_LIST_RULER_FIRST_LI_CLASS)
                    ->append($a);
            $ul->append($li);
            $a = html('a')
                    ->href(replaceGetString(array(
                                'page' => $pager->getPreviousPage()
                            )))
                    ->append($pager->getPreviousPage());
            $li = html('li')
                    ->class(BASE_LIST_RULER_PREVIOUS_LI_CLASS)
                    ->append($a);
            $ul->append($li);
            foreach ($pages as $page) {
                $a = html('a')
                        ->href(replaceGetString(array(
                                    'page' => $page
                                )))
                        ->append($page);

                $li = html('li')
                        ->append($a);
                if ($page==$current) {
                    $li->class(BASE_LIST_RULER_CURRENT_LI_CLASS);
                }
                $ul->append($li);
            }
            $a = html('a')
                    ->href(replaceGetString(array(
                                'page' => $pager->getNextPage()
                            )))
                    ->append($pager->getNextPage());
            $li = html('li')
                    ->class(BASE_LIST_RULER_NEXT_LI_CLASS)
                    ->append($a);
            $ul->append($li);
            $a = html('a')
                    ->href(replaceGetString(array(
                                'page' => $pager->getLastPage()
                            )))
                    ->append($pager->getLastPage());
            $li = html('li')
                    ->class(BASE_LIST_RULER_LAST_LI_CLASS)
                    ->append($a);
            $ul->append($li);
            $ruler->append($ul);
        }
        $info = html('div')
                ->class(BASE_LIST_RULER_INFO_CLASS)
                ->append(getLabel('paginator_total') . " " . $pager->getNumResults() . " " . getLabel('paginator_showing') . " " . $pager->getResultsInPage() . " " . getLabel('paginator_onpage') . " " . $pager->getPage());
        $ruler->append($info);
        return $ruler;
    }

    function getBaseListTableRow($alterClass='Even') {
        $tr = html('tr')->class(BASE_LIST_TR_CLASS . " " . $alterClass);
        $listArr = $this->getBaseColumnArray();
        foreach ($listArr as $column => $params) {

            $rel = false;
            if (array_key_exists('relations', $this->schema)) {
                foreach ($this->schema['relations'] as $relation => $prms) {
                    if (!array_key_exists('type', $prms) && $relation!='Trace' && $column==$prms['local']) {
                        $rel = $relation;

//						if (isset($this->schema['noBaseFormRelationship']) && in_array($rel,$this->schema['noBaseFormRelationship'])) {
//							$rel=false;
//							break;
//						}
                    }
                }
            }
            if (strpos($column, 'trace_id')===false) {

                if ($rel) {
                    $val = $this->$rel->getBaseRelationLabel();
                    $type = 'Relation';
                } else {
                    $typeSize = explode("(", trim($params['type'], ')'));
                    $type = ucfirst($typeSize[0]);
                    if (!array_key_exists(1, $typeSize)) {
                        $typeSize[1] = null;
                    }
                    if ($typeSize[1] > 255 || $typeSize[0]=='clob') {
                        $val = getLabel('long_clob_value');
                        $val = substr($this->$column, 0, 255);
                    } elseif ($typeSize[0]=='boolean') {
                        $val = ($this->$column) ? getLabel('true') : getLabel('false');
                    } else {
                        $val = $this->$column;
                    }
                }
                $td = html('td')
                        ->class(BASE_LIST_TD_CLASS . " " . BASE_LIST_TD_CLASS . ucfirst($column) . " " . $type)
                        ->id(BASE_LIST_TD_ID . $column)
                        ->append($val);
                $tr->append($td);
            }
        }
        $td = html('td')
                ->class(BASE_LIST_TD_CLASS . " " . BASE_LIST_OPTIONS_TD_CLASS)
                ->append($this->getBaseActions());
        $tr->append($td);
        return $tr;
    }

    function getBaseActionsCrudeArray() {
        return array('create', 'read', 'update', 'delete', 'explore');
    }
    function getBaseActionLink($action,$id)
    {
        return '?obj=' . get_class($this) . '&action=' . $action . $id;
    }
    function getBaseActions() {
        $current_action = $_GET['action'];
        $crude_all = $this->getBaseActionsCrudeArray();
        foreach ($crude_all as $action) {
            if (($current_action!=$action
                    && ! (($current_action=='explore' || $current_action=='read' || $current_action=='update' ) && $action=='create')
                    && ! (($action=='delete' || $action=='read' || $action=='update' ) && $current_action=='create'))
                    || ( $_GET['obj']!=get_class($this) && $action=='read')) {
                $crude[] = $action;
            }
        }

        $ul = html('ul');
        $id = '';
        $identifier = $this->identifier();
        foreach ($identifier as $key => $val) {
            $id.="&" . $key . "=" . $val;
        }
        foreach ($crude as $action) {
            if (isAllowed($_SESSION['user_id'], get_class($this), $action)) {

                if ($action=='explore') {
                    $id = '';
                }
                $a = html('a')
                        ->href($this->getBaseActionLink($action,$id))
                        ->append($this->getBaseActionName($action));
                $li = html('li')
                        ->append($a)
                        ->class($action . "Li");
                $ul->append($li);
            }
        }
        $div = html('div')
                ->class('Crude')
                ->append($ul);
        return $div;
    }

    function getBaseActionName($action) {
        return getLabel($action);
    }

    function BasePermissionError($action) {
        $body = html('div')
                ->class(BASE_ERROR_DIV_CLASS)
                ->append(getLabel("permission_error_" . $action . "_" . get_class($this)));

        return $body;
    }

    function getBaseRead() {
        $fields = html('div')
                ->class(BASE_READ_DIV_CLASS)
                ->id(BASE_READ_DIV_ID . get_class($this));
        foreach ($this->schema['columns'] as $lbl => $data) {
            $id = $this->identifier();
            if (strpos($lbl, '_id')===false && strpos($lbl, '_by')===false) {
                $fields->append($this->getBaseReadRecord($lbl));
            }
        }
        if (isset($this->schema['relations'])) {


            foreach ($this->schema['relations'] as $relation => $options) {
				
				if (getVal('delete_file')==$relation) {
					$relation_class = $this->$relation;
					$this->{$options['local']}=null;
					$this->save();
					$relation_class->tryDelete(true);
					exit();
				}
				if (isset($this->schema['noBaseFormRelationship']) && in_array($relation,$this->schema['noBaseFormRelationship'])) {
					continue;
				}
                if ($relation!='Trace') {
                    if (array_key_exists('type', $options) && $options['type']=='many') {
                        $fields->append($this->getBaseReadMany($relation));
                    } else {
                        $fields->append($this->getBaseReadOne($relation));
                    }
                }
            }
        }
        return $this->getBaseActions() . $fields;
    }

    function getBaseReadManyValue() {
        if (array_key_exists('name', $this->schema['columns'])) {
            $name = $this->name;
        } else {
            $name = print_r($this->identifier(), 1);
        }
        $value = html('div')
                ->append($name)
                ->class(BASE_READ_VALUE_DIV_CLASS);

        return $value;
    }

    function getBaseReadOne($relation) {
        if ($relation!='Trace') {
            $this->refreshRelated($relation);
            $value = html('div')
                    ->class(BASE_READ_VALUE_DIV_CLASS)
                    ->append($this[$relation]->name);

            $label = html('div')
                    ->class(BASE_READ_LABEL_DIV_CLASS)
                    ->append(getLabel($relation));
            $field = html('div')
                    ->class(BASE_READ_RECORD_DIV_CLASS)
                    ->id(BASE_READ_RECORD_DIV_ID . $relation)
                    ->append($label)
                    ->append($value);
            return $field;
        }
    }

    function getBaseHeader($action) {
        return html('h1')
        ->class(BASE_HEADER_CLASS)
        ->append(getLabel($action . '_' . $this->schema['tableName']));
    }

    function getBaseReadMany($relation) {
        $body = html('div')
                ->class(BASE_FIELD_SET_BODY_CLASS);
        foreach ($this->$relation as $related) {
            $body->append($related->getBaseReadManyValue());
        }
        $head = html('div')
                ->class(BASE_FIELD_SET_HEAD_CLASS)
                ->append(getLabel($relation));
        $field = html('div')
                ->class(BASE_FIELD_DIV_CLASS . " " . BASE_FIELD_SET_CLASS)
                ->id(BASE_FIELD_DIV_ID . $relation)
                ->append($head)
                ->append($body);
        return $field;
    }

    function getBaseReadRecord($lbl) {
        $typeSize = explode("(", trim($this->schema['columns'][$lbl]['type'], ')'));
        $val = $this->$lbl;
        if ($typeSize[0]=='clob') {
            $val = nl2br($val);
        } elseif ($typeSize[0]=='boolean') {
            $val = ($val) ? getLabel('true') : getLabel('false');
        }
        $value = html('div')
                ->append($val)
                ->class(BASE_READ_VALUE_DIV_CLASS);
        $label = html('div')
                ->class(BASE_READ_LABEL_DIV_CLASS)
                ->append(getLabel($lbl) . ":");
        $record = html('div')
                ->class(BASE_READ_RECORD_DIV_CLASS . " " . $typeSize[0])
                ->id(BASE_READ_RECORD_DIV_ID . $lbl)
                ->append($label)
                ->append($value);
        return $record;
    }

}

