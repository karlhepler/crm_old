<?php
require_once 'Relationship.php';

class Udf extends Entity {
    
    private $type, $subType;
    
    protected function __construct($entityObj) {
        parent::__construct($entityObj);
    }
    
    public function getValue() {
        return unserialize($this->entityObj->value);
    }
    
    public function updateValue($value) {
        if ( is_array($value) ) serialize($value);
        
        return parent::updateField("value",$value);
    }
    
    public function getType() {
        if ( empty($this->type) ) $this->type = UdfType::get($this->entityObj->typeId);
        
        return $this->type;
    }
    
    public function getSubType() {
        if ( empty($this->subType) ) $this->subType = UdfSubType::get($this->entityObj->subTypeId);
        
        return $this->subType;
    }
    
    public static function createTable() {
        
        if ( !($result = UdfType::createTable()) ) return $result;
        if ( !($result = UdfSubType::createTable()) ) return $result;
        
        return parent::helpCreateTable(
                    array(
                        "typeId"    => "int(4) unsigned NOT NULL",
                        "subTypeId" => "int(4) unsigned NOT NULL",
                        "value"     => "BLOB NOT NULL"
                    )
                );
    }
    
    public static function createNew($typeName,$subTypeName,$value) {
        if ( empty($value) ) return false;
        $value = serialize($value);
        if ( !($type = UdfType::createNew($typeName)) ) return false;
        if ( !($subType = UdfSubType::createNew($type->getID(),$subTypeName)) ) return false;
        
        return parent::insertIfNew(
                    array(
                        "typeId"    => $type->getID(),
                        "subTypeId" => $subType->getID(),
                        "value"     => $value
                    )
                );
    }
    
    public function __toString() {
        return json_encode(
                    array(
                        "id"        => $this->getID(),
                        "type"      => $this->getType()->getName(),
                        "subType"   => $this->getSubType()->getName(),
                        "value"     => $this->getValue()
                    )
                );
    }
    
    public static function getFormattedSubTypes($typeName='') {
        // Being given type name - must convert this to id
        $udfType = UdfType::search(1,0,array('name'=>$typeName));

        if ( empty($udfType) ) {
            $udfSubTypeList = array('id'=>'Other','text'=>'Other');
        }
        else {
            $udfSubTypeList = UdfSubType::search(0,0,array('parentTypeId'=>$udfType->getID()),'name','=');
            $i = 0;
            foreach ( $udfSubTypeList as $udfSubType ) {                            
                $udfSubTypeList[$i++] = array(
                    'id'    => $udfSubType->getName(),
                    'text'  => $udfSubType->getName()
                );
            }
        }

        return json_encode($udfSubTypeList);
    }
}

class UdfType extends Entity {
    
    protected function __construct($entityObj) {
        parent::__construct($entityObj);
        
        $this->entityObj->name = htmlspecialchars_decode($this->entityObj->name, ENT_QUOTES);
    }
    
    public static function createTable() {
        return parent::helpCreateTable(
                    array(
                        "name" => "varchar(45) NOT NULL"
                    )
                );
    }
    
    public function getName() {
        return $this->entityObj->name;
    }
    
    public function updateName($name) {
        return parent::updateField("name",$name);
    }
    
    public static function createNew($name) {
        if ( empty($name) ) return false;
        return parent::insertIfNew(array("name"=>$name));
    }
}

class UdfSubType extends Entity {
    
    private $parentType;
    
    protected function __construct($entityObj) {
        parent::__construct($entityObj);
        
        $this->entityObj->name = htmlspecialchars_decode($this->entityObj->name, ENT_QUOTES);
    }
    
    public function getName() {
        return $this->entityObj->name;
    }
    
    public function updateName($name) {
        return parent::updateField("name",$name);
    }
    
    public function getParentType() {
        if ( empty($this->parentType) ) $this->parentType = UdfType::get($this->entityObj->parentTypeId);
        
        return $this->parentType;
    }
    
    public static function createTable() {
        return parent::helpCreateTable(
                    array(
                        "parentTypeId"  => "int(4) unsigned NOT NULL",
                        "name"          => "varchar(45) NOT NULL"
                    )
                );
    }
    
    public static function createNew($parentTypeId,$name) {
        if ( empty($name) && empty($parentTypeId) ) return false;
        
        return parent::insertIfNew(
                    array(
                        "parentTypeId"  => $parentTypeId,
                        "name"          => $name
                        )
                );
    }   
}

?>