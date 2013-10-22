<?php

/**
 * Base
 * @author     Les
 */
class Api extends Doctrine_Record {
    public $schema;
    public function __construct($table = null, $isNewEntry = false,$id=null,$refreshRelated=true) {
        $this->schema=getSchema(get_class($this),_SCHEMA_YML_REFRESH);
        parent::__construct($table,$isNewEntry);
        if($id) {
            $this->assignIdentifier($id);
            $this->load();
            if($refreshRelated) {
                $this->refreshRelated();
            }
        }
    }

    public function setTableDefinition() {
        $this->setTableName($this->schema['tableName']);
        foreach($this->schema['columns'] as $name=>$content) {
            $typeSize=explode("(",trim($content['type'],')'));
            if(!array_key_exists(1, $typeSize)){
                $typeSize[1]=null;
            }
            $this->hasColumn(
                    $name,
                    $typeSize[0],
                    $typeSize[1],
                    $content
            );
        }
    }
    public function setUp() {
        parent::setUp();
        if(array_key_exists('relations',$this->schema)) {            
            foreach($this->schema['relations'] as $name=>$content) {
                $alias=(array_key_exists('class',$content))?"{$content['class']} as {$name}":$name;
                $call=(array_key_exists('type', $content) && $content['type']=='many')?'hasMany':'hasOne';
                $this->$call(
                            $alias,
                            $content
                    );
            }
        }
    }
}