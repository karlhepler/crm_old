define(['Entity'], function() {
    // USER ---------------------------------------------------------------------
    User = function (options) {
        this._icon = 'icon-eye-open';

        Entity.apply(this,options);
    }
    User.prototype = new Entity();
    User.prototype.constructor = User;

    User.prototype.getContact = function(callback) {
        contacts.get( this._entityObj.contactId, callback );
    };

    User.prototype.getAccess = function() {
        return this._entityObj.access;
    };
});