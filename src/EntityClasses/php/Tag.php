<?php
require_once 'Relationship.php';

class Tag extends Entity {
    
    protected function __construct($tagObj) {
        parent::__construct($tagObj);
        
        $this->entityObj->name = htmlspecialchars_decode($this->entityObj->name, ENT_QUOTES);
    }
    
    // UPDATE ------------------------------------------------------------------
    public function updateName($name) {
        return parent::updateField('name', $name);
    }
    
    // GET ---------------------------------------------------------------------
    public function getName() {
        return $this->entityObj->name;
    }
    
    
    // STATIC ------------------------------------------------------------------
    public static function createTable() {
        return parent::helpCreateTable(
                    array(
                        "name" => "varchar(45) NOT NULL"
                    )
                );
    }
    
    public static function createNew($name) {
        if ( empty($name) ) return false;
        
        return parent::insertIfNew(
                    array(
                        'name' => $name
                    )
                );
    }
    
    public static function getAllTagNames() {
        $tagList = self::search();
        $tagNameArray = array();
        foreach ( $tagList as $tag ) {
            $tagNameArray[] = $tag->getName();
        }
        return json_encode($tagNameArray);
    }
}
?>