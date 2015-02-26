define(['Entity'], function() {
    // ACCOUNT ---------------------------------------------------------------------
    Account = function (options) {
        this._icon = 'icon-briefcase';
        
        Entity.apply(this,options);        
    }
    Account.prototype = new Entity();
    Account.prototype.constructor = Account;

    Account.prototype.getName = function() {
        return this._entityObj.name;
    }

    Account.prototype.getBiography = function() {
        return this._entityObj.biography;
    }

    Account.prototype.getEachTag = function(callback) {
        this._getEachRelatedEntity(tags,'tagList',callback);
    };

    Account.prototype.getEachUdf = function(callback) {
        this._getEachRelatedEntity(udfs,'udfList',callback);
    };

    Account.prototype.getEachContact = function(callback) {
        this._getEachRelatedEntity(contacts,'contactList',callback);
    }

    Account.prototype.updateHTML = function() {
        $('.Entity.Account.'+this.getID()+' .name').text( this.getName() );
        $('.Entity.Account.'+this.getID()+' .biography').text( this.getBiography() ); 
    };
});