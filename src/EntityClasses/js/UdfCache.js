;(function (global,undefined) {

    // UDF CACHE ---------------------------------------------------------------
    UdfCache = function () {
        EntityCache.apply(this,[{
                entityType: 'Udf'
        }]);                
    }    
    UdfCache.prototype.constructor = UdfCache;

    UdfCache.prototype.get = function(id,callback) {
        this._get(id,function(udfJSON) {
            if ( udfJSON && $.isFunction(callback) ) {
                callback(new Udf(udfJSON));
            }
        });
    }
    
    
    
    
    define(['EntityCache','Udf'], function() {
        if ( typeof global.udfs === 'undefined' ) {
            global.udfs = $.extend({},new UdfCache(),new EntityCache());
        }
    });
}(this));