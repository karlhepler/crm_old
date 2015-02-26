<?php
require_once 'Relationship.php';

class User extends Entity {
    private $contact;
    
    protected function __construct($userObj) {        
        parent::__construct($userObj);
    }
    
    public function getContact() {
        if ( empty($contact) ) {
            $contact = Contact::get( $this->entityObj->contactId );
        }
        return $contact;
    }
    
    public function changeContact($contact) {
        if ( !is_a($contact,"Contact") ) return false;
        
        return parent::updateField('contactId', $contact->getID());
    }
    
    public function getAccess() {
        return $this->entityObj->access;
    }
    
    public function updatePassword($password) {
        return parent::updateField('password', md5($password));
    }
    
    public function updateAccess($access) {
        return parent::updateField('access', $access);
    }
    
    public static function createNew($password,$access=0) {
        return parent::insertIfNew(
                    array(
                        'password'  => md5($password),
                        'access'    => $access
                    )
                );
    }
    
    public static function createTable() {
        return parent::helpCreateTable(
                    array(
                        'password'  => 'varchar(32) NOT NULL',
                        'contactId' => 'int(4) UNIQUE',
                        'access'    => 'int(4) NOT NULL DEFAULT 0'
                    )
                );
    }
    
    public static function register($assocArray) {
        if ( empty($assocArray['contact']) || empty($assocArray['email']) || empty($assocArray['password']) ) return false;
        if ( !isset($_SESSION['Organization_id']) ) return false;
        if ( !isset($_SESSION['User_id']) ) return false;
        
        // Create new user
        $user = User::createNew( $assocArray['password'][0]['password'] );
        if ( empty($user) ) return false;
        
        // Create contact for user and attach to user
        $contact = Contact::createNew($assocArray['contact'][0]['firstName'], $assocArray['contact'][0]['lastName']);
        if ( empty($contact) ) return false;
        
        // Attach contact to user
        $user->changeContact($contact);
        
        // Add the email to the contact
        $udf = Udf::createNew( 'email', 'Other', array('address' => $assocArray['email'][0]['address'])) ;
        if ( empty($udf) ) return false;
        $contact->addUdf( $udf );
        
        // Add the contact as a contact to the organization's account
        $account = Organization::get($_SESSION['Organization_id'])->getAccount();
        if ( empty($account) ) return false;
        $account->addContact($contact);
        
        return $user;
    }
    
    public static function login($organization,$email='',$password='') {
        if ( empty($organization) ) return false;
        if ( is_array($organization) ) {
            $email        = $organization['email'][0]['address'];
            $password     = $organization['password'][0]['password'];
            $organization = $organization['organization'][0]['name'];                        
        }
        if ( empty($email) || empty($password) ) return false;
        
        // Find the organization in question
        $org = Organization::search(1, 0, array('name'=>$organization), 'name', '=');
        if ( empty($org) ) return false;

        // Set the session org id
        $_SESSION['Organization_id'] = $org->getID();

        // Search the users for the password
        $user = User::search(1, 0, array('password'=>md5($password)), 'password', '=');
        if ( empty($user) ) return false;

        // Cycle through each udf of the contact of the user
        foreach ( $user->getContact()->getUdfList() as $udf ) {
            if ( $udf->getEntity()->getValue()['address'] == $email ) {
                // Set the user id                    
                $_SESSION['User_id']                  = $user->getID();
                $_SESSION['User_access']              = $user->getAccess();
                $_SESSION['User_ContactId']           = $user->getContact()->getID();
                $_SESSION['User_ContactName']         = $user->getContact()->getName();
                $_SESSION['Organization_AccountId']   = $org->getAccount()->getID();
                $_SESSION['Organization_AccountName'] = $org->getAccount()->getName();

                // Log it
                Log::addEntry('i', $user);
                
                return $user;
            }                    
        }

        return false;
    }
    
    public static function logout() {
        // Log it
        Log::addEntry('o', User::get($_SESSION['User_id']));
        
        return session_destroy();
    }
    
    public static function isLoggedIn() {
        session_start();
        
        return isset($_SESSION['User_id']);
    }
    
    public function __toString() {
        $result = get_object_vars($this->entityObj);
        unset($result['password']);
        return json_encode($result);        
    }
}
?>
