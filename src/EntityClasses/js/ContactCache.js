;(function (global,undefined) {

    // CONTACT CACHE ---------------------------------------------------------------
    ContactCache = function () {
        EntityCache.apply(this,[{
                entityType: 'Contact',
                sortBy:     'firstName'
        }]);
    }    
    ContactCache.prototype.constructor = ContactCache;

    ContactCache.prototype.get = function(id,callback) {
        this._get(id,function(contactJSON) {
            if ( contactJSON && $.isFunction(callback) ) {
                callback(new Contact(contactJSON));
            }
        });
    }
    
    
    
    
    define(['EntityCache','Contact'], function() {
        if ( typeof global.contacts === 'undefined' ) {
            global.contacts = $.extend({},new ContactCache(),new EntityCache());
        }
    });
}(this));