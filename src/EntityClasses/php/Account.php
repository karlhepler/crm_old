<?php
require_once 'Relationship.php';

class Account extends Entity {
    
    private $tagList, $contactList, $udfList;
    
    protected function __construct($accountObj) {
        parent::__construct($accountObj);
        
        $this->entityObj->name = htmlspecialchars_decode($this->entityObj->name, ENT_QUOTES);
        $this->entityObj->biography = htmlspecialchars_decode($this->entityObj->biography, ENT_QUOTES);
    }
    
    // UPDATE ------------------------------------------------------------------
    public function updateName($name) {
        return parent::updateField("name",$name);
    }
    public function updateBiography($biography) {
        return parent::updateField("biography",$biography);
    }
    
    public function addTag($newTag,$order=0) {
        if ( !is_a($newTag,"Tag") ) return false;
        
        $tagList = $this->getTagList();        
        foreach ( $tagList as $tag ) {
            if ( $tag->getEntity()->getID() == $newTag->getID() ) {
                return false;
                break;
            }            
        }
        
        // Add the new parent account to the parent account list
        if ( !array_push($this->tagList, new RelatedEntity($newTag,'')) ) return false;

        // Insert the new relationship
        if ( Relationship::createNew($this, $newTag, $order) == false ) return false;
        
        return $newTag;
    }
    
    public function addUdf($newUdf,$order=0) {
        if ( !is_a($newUdf,"Udf") ) return false;
        
        $udfList = $this->getUdfList();
        foreach ( $udfList as $udf ) {
            if ( $udf->getEntity()->getID() == $newUdf->getID() ) {
                return false;
                break;
            }            
        }
        
        // Add the new udf account to the udf list
        if ( !array_push($this->udfList, new RelatedEntity($newUdf,"")) ) return false;
        
        // Insert the new relationship
        if ( Relationship::createNew($this, $newUdf, $order) == false ) return false;
        
        return $newUdf;
    }
    
    public function addContact($newContact,$role="",$order=0) {
        if ( !is_a($newContact,"Contact") ) return false;
        
        $contactList = $this->getContactList();
        foreach ( $contactList as $contact ) {
            if ( $contact->getEntity()->getID() == $newContact->getID() ) {
                return false;
                break;
            }            
        }
        
        // Add the new parent account to the parent account list
        if ( !array_push($this->contactList, new RelatedEntity($newContact,$role)) ) return false;
        
        // Insert the new relationship
        if ( Relationship::createNew($this, $newContact, $order, $role) == false ) return false;
        
        return $newContact;
    }
    
    // GET ---------------------------------------------------------------------
    
    public function getName() {
        return $this->entityObj->name;
    }
    
    public function getBiography() {
        return $this->entityObj->biography;
    }
    
    public function getTagList() {
        if ( empty($this->tagList) ) {
            // Build the array
            $this->tagList = array();
            foreach ( $this->getChildren() as $child ) {
                if ( is_a($child->getEntity(), "Tag") ) {
                    $this->tagList[] = $child;
                }
            }                        
        }
        
        return $this->tagList;
    }
    
    public function getUdfList() {
        if ( empty($this->udfList) ) {
            // Build the array
            $this->udfList = array();
            foreach ( $this->getChildren() as $child ) {                
                if ( is_a($child->getEntity(), "Udf") ) {
                    $this->udfList[] = $child;
                }
            }
        }
        
        return $this->udfList;
    }
    
    public function getContactList() {
        if ( empty($this->contactList) ) {
            // Build the array
            $this->contactList = array();
            foreach ( $this->getChildren() as $child ) {                
                if ( is_a($child->getEntity(), "Contact") ) {
                    $this->contactList[] = $child;
                }
            }
        }
        
        return $this->contactList;
    }
    
    
    // STATIC ------------------------------------------------------------------
    public static function createTable() {
        return parent::helpCreateTable(
                    array(
                        "name"      => "varchar(45) NOT NULL UNIQUE",
                        "biography" => "TEXT"
                    )
                );
    }
    
    public static function register($assocArray) {
        
        // Make sure there is at least an account name
        if ( empty($assocArray['account']) ) return false;
        
        // Add the account
        $account = self::createNew($assocArray['account'][0]['name']);
        unset( $assocArray['account'] );

        while ( ($fieldArray = current($assocArray)) !== false ) {
            
            switch ( key($assocArray) ) {
            
                case "biography":
                    foreach ( $fieldArray as $field ) {
                        $account->updateBiography($field['text']);
                    }
                    break;
                
                case "tag":
                    $i = 0;
                    foreach ( $fieldArray as $field ) {
                        $tagArray = explode(",",$field['list']);
                        foreach ( $tagArray as $tag ) {
                            // Prevent duplicate tags
                            $account->addTag( Tag::createNew($tag), $i++ );
                        }
                    }
                    break;
                
                case "contact":
                    $i = 0;
                    foreach ( $fieldArray as $field ) {
                        // @todo: Need to make warning about this instead of full prevention
                        $account->addContact(Contact::createNew($field['firstName'],$field['lastName']), $field['role'], $i++);
                    }
                    break;
                
                // Defaults are udf
                default:                    
                    $i = 0;
                    $type = key($assocArray);
                    foreach ( $fieldArray as $field ) {                        
                        $subType = $field['subtype'];
                        unset($field['subtype']);
                        
                        $account->addUdf(Udf::createNew($type,$subType,$field));
                    }
                    break;
            }
            
            next($assocArray);
        }

        return $account;
    }
    
    public static function createNew($name,$biography="") {
        if ( empty($name) ) return false;
        
        return parent::insertIfNew(
                    array(
                        "name"      => $name,
                        "biography" => $biography
                    )
                );
    }
    
    public static function searchAccountNames($query) {
        $arg = array('name'=>$query.'%');
        
        $accountList = self::search(0,0,$arg);
        $accountNameArray = array();
        foreach ( $accountList as $account ) {
            $accountNameArray[] = $account->getName();
        }
        return json_encode($accountNameArray);
    }
    
    public function __toString() {
        $result = get_object_vars($this->entityObj);
        $result['isChecked'] = $this->isChecked();

        // Build tag list ids
        $tagList = array();
        foreach ( $this->getTagList() as $tag ) {
            $tagList[] = array( 'id' => $tag->getEntity()->getID(), 'role' => $tag->getRole() );
        }
        if ( !empty($tagList) ) $result['tagList'] = $List;

        // Build UDF list ids
        $udfList = array();
        foreach ( $this->getUdfList() as $udf ) {
            $udfList[] = array( 'id' => $udf->getEntity()->getID(), 'role' => $udf->getRole() );
        }
        if ( !empty($udfList) ) $result['udfList'] = $udfList;

        // Get contact list
        $contactList = array();
        foreach ( $this->getContactList() as $contact ) {
            $contactList[] = array( 'id' => $contact->getEntity()->getID(), 'role' => $contact->getRole() );
        }
        if ( !empty($contactList) ) $result['contactList'] = $contactList;

        return json_encode($result);
    }
    
}
?>