define(['Entity'], function() {
    // UDF -------------------------------------------------------------------------
    Udf = function (options) {
        Entity.apply(this,options);            
    }
    Udf.prototype = new Entity();
    Udf.prototype.constructor = Udf;

    Udf.prototype.getType = function() {
        return this._entityObj.type;
    }

    Udf.prototype.getSubType = function() {
        return this._entityObj.subType;
    }

    Udf.prototype.getValue = function() {
        return this._entityObj.value;
    }

    Udf.prototype.updateHTML = function() {
        $('.Entity.Udf.'+this.getID()+' .type').text( this.getType() );
        $('.Entity.Udf.'+this.getID()+' .subType').text( this.getSubType() );
        $.each(this.getValue(),function(className,value) {
            $('.Entity.Udf.'+this.getID()+' .value .'+className).text( value );
        });
    };
});