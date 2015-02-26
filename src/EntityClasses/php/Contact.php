<?php
require_once 'Relationship.php';

class Contact extends Entity {
    
    private $tagList, $parentAccountList, $udfList;
    
    protected function __construct($contactObj) {
        parent::__construct($contactObj);
        
        // Fix the first and last names
        $this->entityObj->firstName = htmlspecialchars_decode($this->entityObj->firstName, ENT_QUOTES);
        $this->entityObj->lastName = htmlspecialchars_decode($this->entityObj->lastName, ENT_QUOTES);
        $this->entityObj->biography = htmlspecialchars_decode($this->entityObj->biography, ENT_QUOTES);
    }
    
    // UPDATE ------------------------------------------------------------------
    public function updateName($firstName,$lastName) {
        if ( !$this->updateFirstName($firstName) ) return false;
        if ( !$this->updateLastName($lastName) ) return false;
        
        return true;
    }
    public function updateFirstName($firstName) {
        return parent::updateField("firstName",$firstName);
    }
    public function updateLastName($lastName) {
        return parent::updateField("lastName",$lastName);
    }
    public function updateBiography($biography) {
        return parent::updateField("biography",$biography);
    }
    public function addParentAccount($newParentAccount,$role="",$order=0) {
        if ( !is_a($newParentAccount,"Account") ) return false;
        
        // Test and see if parentAccount is already one of the parents
        $parentAccountList = $this->getParentAccountList();
        foreach ( $parentAccountList as $parentAccount ) {            
            if ( $parentAccount->getEntity()->getID() == $newParentAccount->getID() ) {
                return false;
                break;
            }            
        }        

        // Add the new parent account to the parent account list
        if ( !array_push($this->parentAccountList, new RelatedEntity($newParentAccount,$role)) ) return false;

        // Insert the new relationship
        if ( Relationship::createNew($newParentAccount, $this, $order, $role) == false ) return false;

        return $newParentAccount;
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
        
        // Add the new parent account to the parent account list
        if ( !array_push($this->udfList, new RelatedEntity($newUdf,'')) ) return false;
        
        // Insert the new relationship
        if ( Relationship::createNew($this, $newUdf, $order) == false ) return false;
        
        return $newUdf;
    }
    
    // GET ---------------------------------------------------------------------
    public function getName() {
        return $this->entityObj->firstName." ".$this->entityObj->lastName;
    }
    
    public function getFirstName() {
        return $this->entityObj->firstName;
    }
    
    public function getLastName() {
        return $this->entityObj->lastName;
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
    public function getParentAccountList() {
        if ( empty($this->parentAccountList) ) {
            // Build the array
            $this->parentAccountList = array();
            foreach ( $this->getParents() as $parent ) {
                if ( is_a($parent->getEntity(), "Account") ) {
                    $this->parentAccountList[] = $parent;
                }
            }                        
        }
        
        return $this->parentAccountList;
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
    
    public static function createNew($firstName="",$lastName="",$biography="") {
        if ( empty($firstName) && empty($lastName) ) return false;
        
        return parent::insertIfNew(
                    array(
                        "firstName" => $firstName,
                        "lastName"  => $lastName,
                        "biography" => $biography
                    )
                );
    }
    
    
    // STATIC ------------------------------------------------------------------
    public static function createTable() {
        return parent::helpCreateTable(
                    array(
                        "firstName" => "varchar(45)",
                        "lastName"  => "varchar(45)",
                        "biography" => "TEXT"
                    )
                );
    }
    
    // SETUP -------------------------------------------------------------------
    public static function register($assocArray) {
        
        // Make sure there is at least a first name or last name
        // @todo: Need to return warning about this
        if ( empty($assocArray['contact']) ) return false;
        if ( empty($assocArray['contact'][0]['firstName']) && empty($assocArray['contact'][0]['lastName']) ) return false;
        
        // Add the contact
        $contact = self::createNew($assocArray['contact'][0]['firstName'], $assocArray['contact'][0]['lastName']);        
        unset( $assocArray['contact'] );

        while ( ($fieldArray = current($assocArray)) !== false ) {
            
            switch ( key($assocArray) ) {
            
                case "biography":
                    foreach ( $fieldArray as $field ) {
                        $contact->updateBiography($field['text']);
                    }
                    break;
                
                case "tag":
                    $i = 0;
                    foreach ( $fieldArray as $field ) {
                        $tagArray = explode(",",$field['list']);
                        foreach ( $tagArray as $tag ) {
                            // Prevent duplicate tags
                            $contact->addTag( Tag::createNew($tag), $i++ );
                        }
                    }
                    break;
                
                case "account":
                    $i = 0;
                    foreach ( $fieldArray as $field ) {
                        // Prevent duplicate accounts
                        $contact->addParentAccount(Account::createNew($field['name']), $field['role'], $i++);
                    }
                    break;
                
                default:                    
                    $i = 0;
                    $type = key($assocArray);
                    foreach ( $fieldArray as $field ) {                        
                        $subType = $field['subtype'];
                        unset($field['subtype']);
                        
                        $contact->addUdf(Udf::createNew($type,$subType,$field));
                    }
                    break;
            }
            
            next($assocArray);
        }

        return $contact;
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

        // Build Parent Account List
        $parentAccountList = array();
        foreach ( $this->getParentAccountList() as $account ) {
            $parentAccountList[] = array( 'id' => $account->getEntity()->getID(), 'role' => $account->getRole() );
        }
        if ( !empty($parentAccountList) ) $result['parentAccountList'] = $parentAccountList;

        return json_encode($result);
    }
}
?>
