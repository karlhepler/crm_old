<?php
// @todo - this needs to be set in user settings
date_default_timezone_set('America/New_York');
//------------------------------------------------------------------------------
// id | userId | action  | entityType | entityId | timestamp
//------------------------------------------------------------------------------
// 0  | 3      | u       | c          | 4        | 56:56:56
//------------------------------------------------------------------------------
require_once 'Relationship.php';

class Log extends Entity {
    
    private $entity, $user, $action;
    
    protected function __construct($logObj) {
        parent::__construct($logObj);
    }
    
    public function getUser() {
        if ( empty($this->user) ) {
            $this->user = User::get($this->entityObj->userId);
        }
        
        return $this->user;
    }
    
    public function getAction() {
        if ( empty($this->action) ) {
            switch ( $this->entityObj->action ) {

                // Created
                case 'c':
                    $this->action = 'Created';
                    break;

                // Modified
                case 'm':
                    $this->action = 'Modified';
                    break;

                // Deleted
                case 'd':
                    $this->action = 'Deleted';
                    break;
                
                // Logged In
                case 'i':
                    $this->action = 'Logged In';
                    break;
                
                // Logged Out
                case 'o':
                    $this->action = 'Logged Out';
                    break;
                
                default:
                    return false;
                    break;
            }
        }
        
        return $this->action;
    }
    
    public function getEntity() {
        if ( empty($this->entity) ) {
            $name = EntityType::getName($this->entityObj->entityType);
            $this->entity = $name::get($this->entityObj->entityId);
        }
        
        return $this->entity;
    }
    
    public static function addEntry($action,$entity) {        
        parent::insert(
                    array(
                        'userId'    => $_SESSION['User_id'],
                        'action'    => strtolower($action),
                        'entityType'=> EntityType::getID( $entity->getEntityName() ),
                        'entityId'  => $entity->getID()
                    )
                );
    }
    
    public static function createTable() {
        return parent::helpCreateTable(
                    array(
                        'userId'    => 'int(4) NOT NULL',
                        'action'    => 'char(1) NOT NULL',
                        'entityType'=> 'int(4) NOT NULL',
                        'entityId'  => 'int(4) NOT NULL',
                        'timestamp' => 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
                    )
                );
    }
    
    private function time2str($ts)
    {
        if(!ctype_digit($ts))
            $ts = strtotime($ts);

        $diff = time() - $ts;
        if($diff == 0)
            return 'now';
        elseif($diff > 0)
        {
            $day_diff = floor($diff / 86400);
            if($day_diff == 0)
            {
                if($diff < 60) return 'just now';
                if($diff < 120) return '1 minute ago';
                if($diff < 3600) return floor($diff / 60) . ' minutes ago';
                if($diff < 7200) return '1 hour ago';
                if($diff < 86400) return floor($diff / 3600) . ' hours ago';
            }
            if($day_diff == 1) return 'Yesterday';
            if($day_diff < 7) return $day_diff . ' days ago';
            if($day_diff < 31) return ceil($day_diff / 7) . ' weeks ago';
            if($day_diff < 60) return 'last month';
            return date('F Y', $ts);
        }
        else
        {
            $diff = abs($diff);
            $day_diff = floor($diff / 86400);
            if($day_diff == 0)
            {
                if($diff < 120) return 'in a minute';
                if($diff < 3600) return 'in ' . floor($diff / 60) . ' minutes';
                if($diff < 7200) return 'in an hour';
                if($diff < 86400) return 'in ' . floor($diff / 3600) . ' hours';
            }
            if($day_diff == 1) return 'Tomorrow';
            if($day_diff < 4) return date('l', $ts);
            if($day_diff < 7 + (7 - date('w'))) return 'next week';
            if(ceil($day_diff / 7) < 4) return 'in ' . ceil($day_diff / 7) . ' weeks';
            if(date('n', $ts) == date('n') + 1) return 'next month';
            return date('F Y', $ts);
        }
    }
    
    public function __toString() {
        $result = $this->entityObj;
        $result->action = $this->getAction();
        $result->entityType = EntityType::getName($this->entityObj->entityType);                
        $result->relativeTime = $this->time2str($this->entityObj->timestamp);
        
        return json_encode($result);
    }
}
?>
