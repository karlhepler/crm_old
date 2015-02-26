<?php

class helper {
    
    public static function sanitize(/*either one or multiple comma separated strings*/) {
        if (func_num_args() == 1 ) {
            return mysql_real_escape_string(func_get_arg(0));            
        }
        else {
            $stringList = func_get_args();
            for ( $i = 0; $i < func_num_args(); $i++ ) {
                $stringList[$i] = mysql_real_escape_string($stringList[$i]);
            }
            return $stringList;
        }
    }
    
    public static function cleanURI($elem) 
    { 
        if(!is_array($elem)) 
            $elem = htmlentities($elem,ENT_QUOTES,"UTF-8"); 
        else 
            foreach ($elem as $key => $value) 
                $elem[$key] = helper::cleanURI($value); 
        
        return $elem; 
    }
    
}

?>
