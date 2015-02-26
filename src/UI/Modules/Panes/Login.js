;(function(global,undefined) {
    
    Login = function() {
        this._html = $('<form />').formulate({
            entity: 'User',
            func: 'login',
            fields: [
                {
                    type: 'fieldset',
                    entity: 'organization',
                    value: {
                        type: 'text',
                        entity: 'name',
                        placeholder: 'Organization Name',
                        required: true,
                        value: 'Old-Time Guitar Guy'
                    }
                },
                {
                    type: 'fieldset',
                    entity: 'email',
                    value: {
                        type: 'email',
                        entity: 'address',
                        placeholder: 'example@example.com',
                        required: true,
                        value: 'karl.hepler@gmail.com'
                    }
                },
                {
                    type: 'fieldset',
                    entity: 'password',
                    value: {
                        type: 'password',
                        entity: 'password',
                        placeholder: 'Password',
                        required: true,
                        value: 'kamikazo'
                    }
                }
            ],

            submitted: function(submitObj,response) {
                location.reload();
            }
        });
    }
    Login.prototype.constructor = Login;
    
    define(['Pane','jquery.formulate'], function() { return $.extend({},new Login(),new Pane()); });
}(this));