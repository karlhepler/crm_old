// ENTITY ----------------------------------------------------------------------
// Options = {
//              type, (entity type)
//              json  (entity JSON)
//           }
Entity = function (options) {    
    if ( arguments.length === 0 ) return;
    
    this._type = options.type;
    this._entityObj = options.json;
}

Entity.prototype.getID = function() {
    return this._entityObj.id;
}

Entity.prototype.getType = function() {
    return this._type;
}

Entity.prototype._getEachRelatedEntity = function(cacheInstance,listName,callback) {
    if ( this._entityObj.hasOwnProperty(listName) ) {
        $.each(this._entityObj[listName], function(index,entity) {
            if ( $.isFunction(callback) ) {
                var role = entity.role;
                cacheInstance.get(entity.id,function(entity) {
                    callback(entity,role);
                });
            }
        });
    }
};

Entity.prototype._updateField = function(field,value,func,arg) {
    var $this = this;
    
    // Set value in entity obj
    $this._entityObj[field] = value;
    
    // Then add this to the cache
    EntityCache._cache[$this.getType()+$this.getID()] = JSON.stringify($this._entityObj);
    
    // Ajax needs to be called for each
    ajax.post({
        se: $this.getType(),
        sf: 'get',
        sa: $this.getID(),
        'if': func,
        ia: $.type(arg) === 'undefined' ? null : arg
    });
}

Entity.prototype.getIcon = function() {
    return this._icon ? this._icon : 'icon-question-sign';
}

Entity.prototype.isChecked = function() {
    return this._entityObj.isChecked;
}

Entity.prototype.check = function() {
    this._updateField('isChecked',true,'check');
}

Entity.prototype.unCheck = function() {
    this._updateField('isChecked',false,'unCheck');
}

Entity.prototype.toggleChecked = function() {
    if ( this.isChecked() )
        this.unCheck();
    else
        this.check();
}

// Specify the arguments and it returns a span of the entity
Entity.prototype.getHTML = function() {
    if ( arguments.length > 0 ) {
        var $span = $('<span />').addClass('Entity').addClass(this.getType()).addClass(this.getID());

        for ( var i = 0; i < arguments.length; i++ ) {
            if ( arguments[i] === 'icon' ) {
                $('<i />').addClass(this.getIcon()).addClass('icon').appendTo($span);
            }
            else if ( arguments[i] === 'checkbox' ) {
                $('<input type="checkbox" />').prop('checked',this.isChecked()).addClass('checkbox').appendTo($('<label />').addClass('checkbox-label').appendTo($span));
            }
            else if ( arguments[i] === 'pic' ) {
                $('<img />', { src: 'src/unknown.png' }).addClass('pic').appendTo($span);
            }
            else {
                $('<span />', { text: this['get'+helper.capitalizeFirstLetter(arguments[i])]() }).addClass(arguments[i]).appendTo($span);
            }
        }

        return $span;
    }
};