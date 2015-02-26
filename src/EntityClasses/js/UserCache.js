;(function (global,undefined) {
    
    // User CACHE ---------------------------------------------------------------
    UserCache = function () {    
        EntityCache.apply(this,[{
                entityType: 'User'
        }]);            
    }
    UserCache.prototype.constructor = UserCache;

    UserCache.prototype.get = function(id,callback) {
        this._get(id,function(userJSON) {
            if ( userJSON && $.isFunction(callback) ) {
                callback(new User(userJSON));
            }
        });
    }
    
    
    
    
    define(['EntityCache','User'], function() {
        if ( typeof global.Users === 'undefined' ) {            
            global.users = $.extend({},new UserCache(),new EntityCache());
        }
    });
}(this));