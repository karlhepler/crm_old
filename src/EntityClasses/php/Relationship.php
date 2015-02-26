<?php
require_once 'Entity.php';
require_once 'Contact.php';
require_once 'Account.php';
require_once 'Tag.php';
require_once 'Udf.php';
require_once 'User.php';
require_once 'Log.php';
require_once 'Organization.php';

class Relationship extends Entity {
    
    private $parent, $child;
    
    protected function __construct($relationshipObj) {
        parent::__construct($relationshipObj);
        
        // Fix role text
        $this->entityObj->role = htmlspecialchars_decode($this->entityObj->role, ENT_QUOTES);
    }
    
    
    // GET ---------------------------------------------------------------------
    public function getRole() {
        return $this->entityObj->role;
    }
    
    public function getParent() {
        if ( empty($this->parent) ) {            
            $name = EntityType::getName($this->entityObj->parent);
            $this->parent = $name::get($this->entityObj->parentId);
        }
        
        return $this->parent;
    }
    
    public function getChild() {
        if ( empty($this->child) ) {
            $name = EntityType::getName($this->entityObj->child);
            $this->child = $name::get($this->entityObj->childId);
        }
        
        return $this->child;
    }
    
    public function getOrder() {
        return $this->entityObj->order;
    }
    
    
    // STATIC ------------------------------------------------------------------
    public static function createTable() {
        return parent::helpCreateTable(
                    array(
                        "parent"    => "int(4) NOT NULL",
                        "parentId"  => "int(4) NOT NULL",
                        "child"     => "int(4) NOT NULL",
                        "childId"   => "int(4) NOT NULL",
                        "order"     => "int(4) DEFAULT 0",
                        "role"      => "varchar(45)"
                    )
                );
    }
    
    public static function createNew($parent,$child,$order=0,$role='') {
        return parent::insertIfNew(
                    array(
                        "parent"    => EntityType::getID( $parent->getEntityName() ),
                        "parentId"  => $parent->getID(),
                        "child"     => EntityType::getID( $child->getEntityName() ),
                        "childId"   => $child->getID(),
                        "order"     => $order,
                        "role"      => $role
                    )
                );
    }
}

class RelatedEntity {
    private $entity, $role;
    
    public function __construct($entity,$role) {
        $this->entity = $entity;
        $this->role = $role;
    }
    
    public function getEntity() {
        return $this->entity;
    }
    public function getRole() {
        return $this->role;
    }
    
    public function __toString() {
        return json_encode(
                    array(
                        'entity'    => json_decode($this->getEntity()->__toString()),
                        'role'      => $this->getRole()
                    )
                );
    }
}
?>