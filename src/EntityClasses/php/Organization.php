<?php
require_once 'Relationship.php';

class Organization extends Entity {    
    
    private $account;
    
    protected function __construct($organizationObj) {
        parent::__construct($organizationObj);
        
        $this->entityObj->name = htmlspecialchars_decode($this->entityObj->name, ENT_QUOTES);
    }
    
    public static function createTable() {
        return parent::helpCreateTable(array(
            'name'      => 'varchar(45) NOT NULL UNIQUE',
            'accountId' => 'int(4)',
            'timestamp' => 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
        ));
    }
    
    public function getName() {
        return $this->entityObj->name;
    }
    
    public function getAccount() {
        return Account::get($this->entityObj->accountId);
    }
    
    public function changeName($name) {
        return parent::updateField('name', $name);
    }
    
    public function changeAccount($account) {
        if ( !is_a($account,'Account') ) return false;
        
        return parent::updateField('accountId', $account->getID());
    }
    
    public static function createNew($name) {
        return self::insertIfNew(array('name'=>$name));
    }
    
    public static function register($assocArray) {
        if ( empty($assocArray['organization']) || empty($assocArray['contact']) || empty($assocArray['email']) || empty($assocArray['password']) ) return false;
        
        // Search for this organization name - if it exists, then return false
        if ( self::search(1, 0, array('name'=>$assocArray['organization'][0]['name']), 'name', '=') ) return false;
        
        // Create the organization
        $org = self::createNew($assocArray['organization'][0]['name']);
        
        // Store the id in session
        $_SESSION['Organization_id'] = $org->getID();
        
        // Create false user_id
        $_SESSION['User_id'] = 0;
        
        // Create the tables for this organization
        Log::createTable();
        User::createTable();
        Account::createTable();
        Contact::createTable();
        Tag::createTable();
        Udf::createTable();
        Relationship::createTable();
        
        // Create account from Organization name
        $account = Account::createNew($assocArray['organization'][0]['name']);
        if ( empty($account) ) return false;
        
        // Attach account to organization
        $org->changeAccount($account);
        
        // Remove the organization from the assocArray
        unset($assocArray['organization']);
        
        // Register the user
        $user = User::register($assocArray);
        if ( empty($user) ) return false;
        
        // Login
        return User::login($org->getName(), $assocArray['email'][0]['address'], $assocArray['password'][0]['password']);
    }
}
?>
