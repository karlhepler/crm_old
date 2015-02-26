;(function (global,undefined) {

    // TAG CACHE ---------------------------------------------------------------
    TagCache = function () {
        EntityCache.apply(this,[{
                entityType: 'Tag'
        }]);                
    }    
    TagCache.prototype.constructor = TagCache;

    TagCache.prototype.get = function(id,callback) {
        this._get(id,function(tagJSON) {
            if ( tagJSON && $.isFunction(callback) ) {
                callback(new Tag(tagJSON));
            }
        });
    }
    
    
    
    
    define(['EntityCache','Tag'], function() {
        if ( typeof global.tags === 'undefined' ) {
            global.tags = $.extend({},new TagCache(),new EntityCache());
        }
    });
}(this));