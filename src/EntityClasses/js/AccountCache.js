;(function (global,undefined) {
    
    // ACCOUNT CACHE ---------------------------------------------------------------
    AccountCache = function () {    
        EntityCache.apply(this,[{
                entityType: 'Account',
                sortBy:     'name'
        }]);            
    }
    AccountCache.prototype.constructor = AccountCache;

    AccountCache.prototype.get = function(id,callback) {
        this._get(id,function(accountJSON) {
            if ( accountJSON && $.isFunction(callback) ) {
                callback(new Account(accountJSON));
            }
        });
    }
    
    
    
    
    define(['EntityCache','Account'], function() {
        if ( typeof global.accounts === 'undefined' ) {            
            global.accounts = $.extend({},new AccountCache(),new EntityCache());
        }
    });
}(this));