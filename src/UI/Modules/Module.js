Module = function(panes) {
    if ( arguments.length === 0 ) return;
    var $this = this;
    var span = 'span'+(12/arguments.length);

    $this._html = $('<div />').addClass('row-fluid');
    $this._panes = arguments;

    $.each($this._panes, function(index,pane) {            
        var $thisPane = $('<div />').appendTo($this._html);

        if ( pane.hasOwnProperty('isHider') && pane.isHider === true ) $thisPane.addClass('hidden-phone');

        $thisPane
        .addClass('pane')
        .addClass(span)
        .append( pane.pane.getHTML() );
    });        
}

Module.prototype.getPane = function(id) {
    return this._panes[id];
}

Module.prototype.getHTML = function() {
    return this._html;
}