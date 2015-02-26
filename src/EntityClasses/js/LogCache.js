;(function (global,undefined) {
    
    // ACCOUNT CACHE ---------------------------------------------------------------
    LogCache = function () {    
        EntityCache.apply(this,[{
                entityType: 'Log',
                sortBy:     'timestamp'
        }]);            
    }
    LogCache.prototype.constructor = LogCache;

    LogCache.prototype.get = function(id,callback) {
        this._get(id,function(logJSON) {
            if ( logJSON && $.isFunction(callback) ) {
                callback(new Log(logJSON));
            }
        });
    }
    
    
    
    
    define(['EntityCache','Log'], function() {
        
        if ( typeof global.logs === 'undefined' ) {            
            global.logs = $.extend({},new LogCache(),new EntityCache());
        }
    });
}(this));