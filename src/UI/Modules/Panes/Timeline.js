;(function(global,undefined) {
    
    Timeline = function() {
        var $this = this;
        $this._html = $('<ul />');        
        
        logs.sync(function(log) {
            log.getEntity(function(entity) {
                switch( entity.getType() ) {

                    case 'Account':
                    case 'Contact':

                        break;

                    case 'User':
                        
                        break;
                }
                
            });
        },null,[ 0, 0, {entityType: 4}, 'timestamp', '!=' ]);
    }
    Timeline.prototype.constructor = Timeline;
    
    define(['Pane','ContactCache','AccountCache','UdfCache','TagCache','LogCache','UserCache'], function() { return $.extend({},new Timeline(),new Pane()); });
}(this));