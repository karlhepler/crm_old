<?php
                
class MySqlWrapper {
    
    // PRIVATE VARIABLES
    private $host = "localhost";
    private $user = "root";
    private $pass = "bitnami";
    private $link;
    private static $instance;
    
    // Constructor (private because of singleton)
    private function __construct() {
        // Open mysql connection
        $this->link = mysql_connect($this->host, $this->user, $this->pass)or die("MYSQL CONNECTION ERROR: ".mysql_error());
    }
    
    // Singleton method
    public static function newInstance() {
        if (!isset(self::$instance)) {
            $c = __CLASS__;
            self::$instance = new $c;
        }

        return self::$instance;
    }
    
    // Singleton anti-clone
    public function __clone()
    {
        trigger_error('Clone is not allowed.', E_USER_ERROR);
    }
    
    // Destructor
    public function __destruct() {
        // Close mysql connection
        mysql_close($this->link) or die("MYSQL DESTRUCTION ERROR: ".mysql_error($this->link));
    }
    
    // Connect to a specified database
    public function selectDB($db) {
        mysql_select_db($db,$this->link) or die("MYSQL SELECT DB ERROR: ".mysql_error($this->link));
    }
    
    // Returns the mysql result
    public function query($query) {
        $result = mysql_query($query, $this->link);
        if(!$result) die("MYSQL QUERY ERROR: ".mysql_error($this->link));
        return $result;
    }
    
    public function getLastInsertID() {
        return mysql_insert_id($this->link);// or die("MYSQL GET LAST INSERT ID ERROR: ".mysql_error($this->link));
    }
}

?>