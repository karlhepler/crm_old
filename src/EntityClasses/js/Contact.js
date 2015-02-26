define(['Entity'], function() {
    // CONTACT ---------------------------------------------------------------------
    Contact = function (options) {
        this._icon = 'icon-user';
        
        Entity.apply(this,options);            
    }
    Contact.prototype = new Entity();
    Contact.prototype.constructor = Contact;

    Contact.prototype.getFirstName = function() {
        return this._entityObj.firstName;
    }

    Contact.prototype.getLastName = function() {
        return this._entityObj.lastName;
    }

    Contact.prototype.getBiography = function() {
        return this._entityObj.biography;
    }

    Contact.prototype.getName = function() {
        return this.getFirstName() + ' ' + this.getLastName();
    }

    Contact.prototype.getEachTag = function(callback) {
        this._getEachRelatedEntity(tags,'tagList',callback);
    };

    Contact.prototype.getEachUdf = function(callback) {
        this._getEachRelatedEntity(udfs,'udfList',callback);
    };

    Contact.prototype.getEachParentAccount = function(callback) {
        this._getEachRelatedEntity(accounts,'parentAccountList',callback);
    }

    Contact.prototype.updateHTML = function() {
        $('.Entity.Contact.'+this.getID()+' .name').text( this.getName() );
        $('.Entity.Contact.'+this.getID()+' .firstName').text( this.getFirstName() );
        $('.Entity.Contact.'+this.getID()+' .lastName').text( this.getLastName() );
        $('.Entity.Contact.'+this.getID()+' .biography').text( this.getBiography() );
    };
});