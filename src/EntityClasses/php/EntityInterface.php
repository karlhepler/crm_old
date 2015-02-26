<?php
require_once 'src/loaders/MySqlWrapper.php';
require_once 'src/helpers/helper.php';

interface EntityInterface {        
    // STATIC ------------------------------------------------------------------
    static function createTable();
}
?>
