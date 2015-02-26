define(['Win','jquery.formulate'], function() {
    // CONTACT ---------------------------------------------------------------------
    ContactWin = function(type,id,created,shown,hidden,destroyed) {
        
        this._id = typeof id === 'undefined' ? $.error('ID is undefined') : id;
        this._type = typeof type === 'undefined' ? $.error('Type is undefined') : type;
        
        var options = [{   
                            id:         this._id,
                            title:      (this._type === 'setup' ? 'New' : helper.capitalize(this._type)) + ' Contact',
                            icon:       'icon-user',
                            content:    $('<form />'),
                            destroyed:  destroyed,
                            hidden:     hidden,
                            shown:      shown,
                            created:    created
                      }];
        
        // Call the parent constructor
        Win.apply(this, options);
        
        var _this = this;
        
        // Formulate the form!
        this._content.formulate({
            entity:     'Contact',
            func:       this._type,
            submitBtn:  this._$saveBtn,
            created:    function() {
                            _this.showCreated();
                        },
            submitted:  function() {
                            _this.destroy();
                        },
            fields:     [
                            // Profile Pic | First/Last - TagList - Biography
                            [
                                // Profile pic
                                {
                                    span: 3,
                                    value: {
                                        type: 'fieldset',
                                        entity: 'profile',
                                        value: {
                                            type: 'img',
                                            entity: 'pic'
                                        }
                                    }
                                },

                                // Name, tags, bio
                                {
                                    span: 9,
                                    value: [
                                        // Name
                                        {                            
                                            type: 'fieldset',
                                            entity: 'contact',
                                            value: [
                                                {
                                                    span: 6,
                                                    type: 'text',
                                                    entity: 'firstName',
                                                    placeholder: 'First'
                                                },
                                                {
                                                    span: 6,
                                                    type: 'text',
                                                    entity: 'lastName',
                                                    placeholder: 'Last'
                                                }
                                            ]
                                        },
                                        // Tags
                                        {
                                            type: 'fieldset',
                                            entity: 'tag',
                                            value: {
                                                type: 'tagList',
                                                entity: 'list',
                                                placeholder: 'Add a Tag'
                                            }
                                        },
                                        // Biography
                                        {
                                            type: 'fieldset',
                                            entity: 'biography',
                                            value: {
                                                type: 'textarea',
                                                entity: 'text',
                                                placeholder: 'Biography'
                                            }
                                        }
                                    ]
                                }
                            ],
                            // Account and role cloners
                            [
                                //Label
                                {
                                    span: 2,
                                    type: 'label',
                                    value: 'Account'
                                },
                                // Account and role fieldset
                                {
                                    span: 10,
                                    type: 'fieldset',
                                    entity: 'account',
                                    cloneBox: true,
                                    value: {
                                        type: 'cloner',
                                        value: [
                                            // Account
                                            {
                                                span: 8,
                                                value: {
                                                    type: 'typeahead',
                                                    entity: 'name',
                                                    placeholder: 'Account'
                                                }
                                            },
                                            // Role
                                            {
                                                span: 4,
                                                type: 'text',
                                                entity: 'role',
                                                placeholder: 'Role'
                                            }
                                        ]
                                    }                        
                                }
                            ],
                            // Email cloner
                            [
                                // Label
                                {
                                    span: 2,
                                    type: 'label',
                                    value: 'Email'
                                },
                                // UdfSelect & Email
                                {
                                    span: 10,
                                    type: 'fieldset',
                                    entity: 'email',
                                    cloneBox: true,
                                    value: {
                                        type: 'cloner',
                                        value: [
                                            // UDF SELECT
                                            {
                                                span: 3,
                                                type: 'udfSelect',
                                                entity: 'subtype'
                                            },
                                            // EMAIL INPUT
                                            {
                                                span: 9,
                                                type: 'email',
                                                entity: 'address',
                                                placeholder: 'email@example.com'
                                            }
                                        ]
                                    }                        
                                }
                            ],
                            // Phone Cloner
                            [
                                // Label
                                {
                                    span: 2,
                                    type: 'label',
                                    value: 'Phone'
                                },
                                // UdfSelect & Phone
                                {
                                    span: 10,
                                    type: 'fieldset',
                                    entity: 'phone',
                                    cloneBox: true,
                                    value: {
                                        type: 'cloner',
                                        value: [
                                            // UDF SELECT
                                            {
                                                span: 3,
                                                type: 'udfSelect',
                                                entity: 'subtype'
                                            },
                                            // PHONE INPUT
                                            {
                                                span: 7,
                                                type: 'phone',
                                                entity: 'num',
                                                placeholder: '(###) ###-####'
                                            },
                                            // EXT INPUT
                                            {
                                                span: 2,
                                                type: 'text',
                                                entity: 'ext',
                                                placeholder: 'Ext.'
                                            }
                                        ]
                                    }

                                }
                            ],
                            // Website cloner
                            [
                                // Label
                                {
                                    span: 2,
                                    type: 'label',
                                    value: 'Website'
                                },
                                // UdfSelect & Website
                                {
                                    span: 10,
                                    type: 'fieldset',
                                    entity: 'website',
                                    cloneBox: true,
                                    value: {
                                        type: 'cloner',
                                        value: [
                                            // UDF SELECT
                                            {
                                                span: 3,
                                                type: 'udfSelect',
                                                entity: 'subtype'
                                            },
                                            // URL INPUT
                                            {
                                                span: 9,
                                                type: 'url',
                                                entity: 'url',
                                                placeholder: 'http://www.example.com/'
                                            }
                                        ]
                                    }                        
                                }
                            ],
                            // Address cloner
                            [
                                // Label
                                {
                                    span: 2,
                                    type: 'label',
                                    value: 'Address'
                                },
                                // UdfSelect & Website
                                {
                                    span: 10,
                                    type: 'fieldset',
                                    entity: 'address',
                                    cloneBox: true,
                                    value: {
                                            type: 'cloner',
                                            value: [
                                                {
                                                    span: 3,
                                                    type: 'udfSelect',
                                                    entity: 'subtype'
                                                },
                                                {
                                                    span: 9,
                                                    type: 'transformer',
                                                    entity: 'address',
                                                    placeholder: 'Address'
                                                }
                                            ]
                                        }
                                }
                            ]
                        ]
        });
    }

    // Inherit Win
    ContactWin.prototype = new Win();
    ContactWin.prototype.constructor = ContactWin;
});