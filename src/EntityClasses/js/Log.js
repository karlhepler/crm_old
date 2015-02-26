define(['Entity'], function() {
    // LOG ---------------------------------------------------------------------
    Log = function (options) {
        Entity.apply(this,options);            
    }
    Log.prototype = new Entity();
    Log.prototype.constructor = Log;

    Log.prototype.getUser = function(callback) {
        
    }

    Log.prototype.getEntity = function(callback) {
        switch ( this._entityObj.entityType ) {
            
            case 'Account':
                accounts.get(this._entityObj.entityId,callback);
                break;
                
            case 'Contact':
                contacts.get(this._entityObj.entityId,callback);
                break;

            case 'User':
                users.get(this._entityObj.entityId,callback);
                break;
                
            default:
                callback({getName:function() {return 'unknown';},getType:function(){return 'unknown'}});
                break;
        }
    }
    
    Log.prototype.getAction = function() {
        return this._entityObj.action;
    }
    
    Log.prototype.getTimestamp = function() {
        return this._entityObj.timestamp;
    }
    
    Log.prototype.getRelativeTime = function() {
        return this._entityObj.relativeTime;
    }

    Log.prototype.updateHTML = function() {
        $('.Entity.Log.'+this.getID()+' .action').text( this.getAction() );
        $('.Entity.Log.'+this.getID()+' .timestamp').text( this.getTimestamp() );
        $('.Entity.Log.'+this.getID()+' .relativeTime').text( this.getRelativeTime() );
    };
});