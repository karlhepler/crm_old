<?php
require_once "EntityInterface.php";

abstract class Entity implements EntityInterface {
    
    private $mysql, $parents, $children;
    protected $entityObj;
    
    protected function __construct($entityObj) {
        $this->entityObj    = $entityObj;
    }
    
    // GET ---------------------------------------------------------------------
    public function getID() {
        return $this->entityObj->id;
    }
    
    public function __toString() {
        return json_encode(get_object_vars($this->entityObj));        
    }
    
    // UPDATE ------------------------------------------------------------------
    protected function updateField($field,$value) {
        // Sanitize
        $field = helper::sanitize($field);
        $value = helper::sanitize($value);
        $id    = $this->getID();
        $entity = self::getEntityName();
        
        // Update and return value upon success
        $success = $this->getMySql()->query("UPDATE `$entity` SET `$field`='$value' WHERE `id`=$id");
        
        if ( $success ) {
            $this->entityObj->$field = htmlspecialchars_decode($value, ENT_QUOTES);
            if ( !is_a($entity,'Log') && !is_a($this,'Organization') ) Log::addEntry('m', $this);
            return $success;
        }
        else {
            return false;
        }
    }

    public function check() {
        if ( $this->getEntityName() != 'User' && $this->getEntityName() != 'Organization' && $this->getEntityName() != 'Log' && $this->getEntityName() != 'Relationship' ) {
            if ( ($unChecked = Relationship::search(1, 0, array('parent' => EntityType::getID($this->getEntityName()), 'parentId' => $this->getID(), 'child' => EntityType::getID(User::get($_SESSION['User_id'])->getEntityName()), 'childId' => $_SESSION['User_id']), 'id', '=')) )
                return $unChecked->delete();
            else
                return false;
        }
    }
    
    public function unCheck() {
        if ( $this->getEntityName() != 'User' && $this->getEntityName() != 'Organization' && $this->getEntityName() != 'Log' && $this->getEntityName() != 'Relationship' ) {
            if ( Relationship::createNew($this, User::get($_SESSION['User_id'])) )
                return true;
            else
                return false;        
        }
    }
    
    public function isChecked() {
        if ( $this->getEntityName() != 'User' && $this->getEntityName() != 'Organization' && $this->getEntityName() != 'Log' && $this->getEntityName() != 'Relationship' ) {
            if ( Relationship::search(1, 0, array('parent' => EntityType::getID($this->getEntityName()), 'parentId' => $this->getID(), 'child' => EntityType::getID(User::get($_SESSION['User_id'])->getEntityName()), 'childId' => $_SESSION['User_id']), 'id', '=') == false )
                return true;
            else
                return false;
        }
    }
    
    protected function getMySql() {
        // Create new instance of mysql if it doesn't already exist
        if ( !is_a($this->mysql,"MySqlWrapper") ) {
            $this->mysql = MySqlWrapper::newInstance();
            $this->mysql->selectDB("test");
        }
        
        return $this->mysql;
    }

    // DELETE ------------------------------------------------------------------
    public function delete() {
        $id = $this->getID();
        $entity = self::getEntityName();
        
        // Prevent deletion of contacts that are assigned to users and accounts that assigned to organizations
        if ( $entity == 'contact' && User::search(1,0,array('contactId'=>$id),'id','=') ) return false;
        if ( $entity == 'account' && Organization::search(1,0,array('accountId'=>$id),'id','=') ) return false;
        
        // Get children
        $children = $this->getChildren();
        
        // First delete children and check result
        foreach ( $children as &$child ) {
            if ( $child->getEntity()->delete() == false ) {
                return false;
                break;
            }
        }
        
        if ( !is_a($entity,'Log') && !is_a($this,'Organization') ) Log::addEntry('d', $this);
        
        // Now delete this entity        
        return $this->getMySql()->query("DELETE FROM `$entity` WHERE `id`=$id");
    }        
    
    // GET PARENTS -------------------------------------------------------------
    protected function getParents() {
        if ( empty($this->parents) ) {
            $relationships = Relationship::search(0, 0, array("child" => EntityType::getID($this->getEntityName()), "childId" => $this->getID()));
            $this->parents = array();
            foreach ( $relationships as $relationship ) {
                $this->parents[]  = new RelatedEntity($relationship->getParent(),$relationship->getRole());
            }
        }
        
        return $this->parents;
    }
    
    // GET CHILDREN ------------------------------------------------------------
    protected function getChildren() {
        if ( empty($this->children) ) {
            $relationships = Relationship::search(0,0,array("parent" => EntityType::getID($this->getEntityName()), "parentId" => $this->getID()));            
            $this->children = array();
            foreach ( $relationships as $relationship ) {                
                $this->children[]  = new RelatedEntity($relationship->getChild(),$relationship->getRole());                
            }
        }
        
        return $this->children;
    }
    
    // CREATE TABLE HELPER -----------------------------------------------------
    // FieldArray is setup like this: array( "name" => "varchar(45) NOT NULL" )
    protected static function helpCreateTable($fieldArray) {
        // Connect to mysql database
        $mysql = MySqlWrapper::newInstance();
        $mysql->selectDB("test");
        
        // create field string from field array
        $fieldString = "`id` int(4) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY";
        while ( current($fieldArray) ) {
            
            $fieldString .= ", `".key($fieldArray)."` ".current($fieldArray);
            
            next($fieldArray);
        }
        
        // Return result of create table
        $result = $mysql->query("CREATE TABLE IF NOT EXISTS `".self::getEntityName()."` (".$fieldString.") ENGINE=MyISAM AUTO_INCREMENT=1");
        
        if ( $result != false )
            return self::getEntityName();
        else
            return false;
    }
    
    // REMEMBER THE % SYMBOL IS WILD CARD
    public static function search($limit=0,$offset=0,$fieldQueryArray=array('id'=>'%'),$orderBy='id',$operator="LIKE") {
        // Sanitize
        $limit   = helper::sanitize($limit);
        $offset  = helper::sanitize($offset);
        
        // Sanitize and build query
        $query = "`".helper::sanitize(key($fieldQueryArray))."` $operator '".helper::sanitize(current($fieldQueryArray))."'";
        next($fieldQueryArray);
        while ( current($fieldQueryArray) ) {
            $query .= " AND `".helper::sanitize(key($fieldQueryArray))."` $operator '".helper::sanitize(current($fieldQueryArray))."'";
            next($fieldQueryArray);
        }
        
        $orderBy = helper::sanitize($orderBy);
        $entity = self::getEntityName();
        
        // Connect to mysql database
        $mysql = MySqlWrapper::newInstance();
        $mysql->selectDB("test");                
        //print_r( "SELECT * FROM `$entity` WHERE $query ORDER BY `$orderBy`".($limit > 0 ? " LIMIT $limit OFFSET $offset" :"") );
        // Search
        $result = $mysql->query("SELECT * FROM `$entity` WHERE $query ORDER BY `$orderBy`".($limit > 0 ? " LIMIT $limit OFFSET $offset" :""));
        
        // Create the output and return
        $output = array();

        while ( $entityObj = mysql_fetch_object($result) ) {
            if ( $entityObj == false )  {
                return false;
                break;
            }
            $output[] = new static($entityObj);
        }

        return $limit == 1 && count($output) == 1 ? $output[0] : $output;

    }
    
    public static function get($id) {
        // Sanitize
        $id = helper::sanitize($id);
        $entity = self::getEntityName();
        
        // Connect to mysql database
        $mysql = MySqlWrapper::newInstance();
        $mysql->selectDB("test");
        
        // Get
        $result = mysql_fetch_object($mysql->query("SELECT * FROM `$entity` WHERE `id`=$id LIMIT 1"));
        
        // Test result and return
        if ( $result != false ) {       
            return new static($result);
        }
        else {
            return false;
        }
    }
    
    protected static function getEntityName() {
        return (!empty($_SESSION['Organization_id']) && get_called_class() != 'Organization' ? $_SESSION['Organization_id'].'_' : '').get_called_class();
    }
    
    protected static function insert($fieldValueArray) {
        
        // Sanitize and build query at same time
        $fields = "`".helper::sanitize(key($fieldValueArray))."`";
        $values = "'".helper::sanitize(current($fieldValueArray))."'";
        next($fieldValueArray);
        while ( current($fieldValueArray) !== false ) {
            $fields .= ",`".helper::sanitize(key($fieldValueArray))."`";
            $values .= ",'".helper::sanitize(current($fieldValueArray))."'";
            next($fieldValueArray);
        }
        
        $entity = static::getEntityName();

        // Connect to mysql database
        $mysql = MySqlWrapper::newInstance();
        $mysql->selectDB("test");

        // Insert
        $success = $mysql->query("INSERT INTO `$entity` ($fields) VALUES ($values)");

        // Return Contact object on success
        if ( $success ) {
            // Log the event
            $entity = self::get( $mysql->getLastInsertID() );
            if ( !is_a($entity,'Log') && !is_a($entity,'Organization') ) Log::addEntry('c', $entity);
            
            return $entity;
        }
        else {
            return false;
        }
    }
    
    protected static function insertIfNew($fieldValueArray) {
        $searchArray = $fieldValueArray;
        
        // Prevents matching from bio
        if ( !empty($searchArray['biography']) ) unset($searchArray['biography']);
        
        return ($result = static::search(1,0,$searchArray,'id','=')) ? $result : static::insert($fieldValueArray);
    }
}

class EntityType {
    private static $types = array(
        'Account',
        'Contact',
        'Log',
        'Organization',
        'Relationship',
        'Tag',
        'Udf',
        'UdfType',
        'UdfSubType',
        'User'
    );
    
    public static function getName($id) {
        return self::$types[$id];
    }
    
    public static function getID($name) {
        $name = strstr($name, '_');
        $name = substr($name,1);

        return array_search( $name, self::$types );
    }
}
?>