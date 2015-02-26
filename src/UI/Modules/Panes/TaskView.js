;(function(global,undefined) {
    
    TaskView = function() {
        this._html = $('<div />', { text: 'TASK VIEW' });
    }
    TaskView.prototype.constructor = TaskView;
    
    define(['Pane'], function() { return $.extend({},new TaskView(),new Pane()); });
}(this));