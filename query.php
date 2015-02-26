<?php
session_start();
// TODO: Need to make console msg class with error, warning, and success

error_reporting(E_ALL);
ini_set('display_errors', '1');

require_once 'src/EntityClasses/php/Relationship.php';

Organization::createTable();

// se = Static Entity
// sf = Static Function
// sa = Static Argument (can be array of multiple arguments)
// if = Instance Function
// ia = Instance Argument (can be array of multiple arguments)
// sa_isArray = static argument is array
// ia_isArray = instance argument is array

if ( !empty($_REQUEST) ) {    
    $request = helper::cleanURI($_REQUEST);
    
    if ( !empty($request['se']) && !empty($request['sf']) ) {
        if ( empty($request['sa']) ) {
            $instance = $request['se']::$request['sf']();
        }
        else {
            if ( is_array($request['sa']) && (empty($request['sa_isArray']) || $request['sa_isArray'] == false) )
                $instance = call_user_func_array(array($request['se'],$request['sf']), $request['sa']);
            else
                $instance = $request['se']::$request['sf']($request['sa']);
        }        
        
        if ( !empty($request['if']) ) {
            if ( empty($request['ia']) ) {
                $result = $instance->$request['if']();
            }
            else {
                if ( is_array($request['ia']) && (empty($request['ia_isArray']) || $request['ia_isArray'] == false) )
                    $result = call_user_func_array(array($instance,$request['if']), $request['ia']);
                else
                    $result = $instance->$request['if']($request['ia']);
            }
            
            if ( is_array($result) ) {
                $output = '[';
                foreach ( $result as $val ) {
                    $output .= $val.',';
                }
                $output = rtrim($output,',');
                $output .= ']';
                echo $output !== false ? $output : 'false';
            }
            else {
                echo $result !== false ? $result : 'false';
            }
        }
        else {
            if ( is_array($instance) ) {
                $output = '[';
                foreach ( $instance as $val ) {
                    $output .= $val.',';
                }
                $output = rtrim($output,',');
                $output .= ']';
                echo $output !== false ? $output : 'false';
            }
            else {
                echo $instance !== false ? $instance : 'false';
            }            
        }
    }
    
}
?>
