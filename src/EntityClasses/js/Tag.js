define(['Entity'], function() {
    // TAG ---------------------------------------------------------------------
    Tag = function (options) {
        Entity.apply(this,options);
    }
    Tag.prototype = new Entity();
    Tag.prototype.constructor = Tag;

    Tag.prototype.getName = function() {
        return this._entityObj.name;
    }

    Tag.prototype.updateHTML = function() {
        $('.Entity.Tag.'+this.getID()+' .name').text( this.getName() );
    };
});