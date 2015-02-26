;(function(global,undefined) {
    
    Register = function() {
        this._html = $('<form />').formulate({
            entity: 'Organization',
            func:   'register',
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
                    entity: 'contact',
                    value: [
                        {
                            span: 6,
                            type: 'text',
                            entity: 'firstName',
                            placeholder: 'First Name',
                            value: 'Karl'
                        },
                        {
                            span: 6,
                            type: 'text',
                            entity: 'lastName',
                            placeholder: 'Last Name',
                            value: 'Hepler'
                        }
                    ]
                },
                {
                    type: 'fieldset',
                    entity: 'email',
                    value: {
                        type: 'email',
                        entity: 'address',
                        placeholder: 'Email Address',
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
                        placeholder: 'Choose a Password',
                        required: true,
                        value: 'kamikazo'
                    }
                }
            ],

            submitted: function(submitObj,response) {
                location.reload;
            }
        });
    }
    Register.prototype.constructor = Register;
    
    define(['Pane','jquery.formulate'], function() { return $.extend({},new Register(),new Pane()); });
}(this));