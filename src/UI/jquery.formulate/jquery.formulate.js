// 1.) Build the form
//     - Data Store:
//       * original = contains original finalized version of element without value and class "needs_setup"
//       * value = contains the value to be set
//       * setup = this is a function that sets up the element. ALL MUST HAVE CALLBACKS and remove needs_setup class

// 2.) Setup all clone boxes

// 3.) Setup the rest of the elements
define([
    'jquery',
    'bootstrap',
    'jquery-ui',
    'AjaxBuffer',
    'jquery.validate',
    'jquery.serializeObject',
    'jquery.cloneBox',
    'jquery.udfSelect',
    'jquery.transformer',
    'jquery.phonemask',
    'jquery.select2'
    ], function() {
    
    ;(function ( $, window, document, undefined ) {

        var pluginName = "formulate",
            defaults = {
                entity:     null,   // This can be account, contact, etc.
                func:       null,   // This can be insert, update, etc.
                submitBtn:  null,   // This can be any clickable thing
                fields:     null,   // This has to be structured json
                created:    null,   // Callback once formulate has finished setting up the form
                submitted:  null    // Callback once form has been submitted
            };

        function Plugin( element, options ) {
            this.element = element;

            this.options = $.extend( {}, defaults, options );

            this._defaults = defaults;
            this._name = pluginName;

            this.init();
        }

        Plugin.prototype = {

            init: function() {            
                var $this = this, $elem = $(this.element);

                // Error if entity, func, or fields is missing
                if ( !$this.options.entity ) $.error('Need to specify entity');
                else if ( !$this.options.func ) $.error('Need to specify func');
                else if ( !$this.options.fields ) $.error('Needs to specify fields');

                // Create the form
                $this.form = $elem.addClass('row-fluid');

                // Build the form
                $this.buildForm();

                // Setup the clone boxes!
                $this.setupCloneBoxes(function() {

                    // Setup the rest of the elements!
                    $this.setupElements(function() {

                        // Setup validation
                        $this.setupValidation();

                        // Setup Submit button
                        if ( !$this.options.submitBtn ) {
                            // Create the Submit Button
                            $this.options.submitBtn = $('<button />', {                                                        
                                                            text: 'Save and Close',
                                                            'class': 'btn btn-primary'
                                                        });
                            // Append it
                            $this.form.append($this.options.submitBtn);
                        }

                        // Setup submit button's action
                        $this.options.submitBtn.click(function(e) {

                            e.preventDefault();

                            // If the form is valid, then submit it!
                            if ( $this.validator.form() ) {
                                $this.form.submit();
                            }
                        });

                        // Call finished callback
                        if ( $.isFunction($this.options.created) ) {
                            $this.options.created();
                        }
                    });
                });





                // -----------------------------------
                // THIS IS THE BIG SUBMIT FUNCTION!!!!
                // -----------------------------------
                $this.form.submit(function() {

                    // Iterate the fields (all fields must be wrapped in a sub-fieldset)
                    $this.iterateFields();

                    // Serialize the fields and remove the empties
                    var submitObj = $this.removeEmptyFields( $elem.serializeObject() );

                    //console.log( $this.options.entity, $this.options.func, submitObj );

                    // Submit the form!
                    //$.post('query.php', {
                    ajax.post({
                        se: $this.options.entity,

                        sf: $this.options.func,

                        sa: submitObj,

                        sa_isArray: true

                    },

                    // Do something with the php response!
                    function(response) {
                        // Call callback once form has been submitted
                        if ( $.isFunction($this.options.submitted) ) $this.options.submitted(submitObj,response);
                    });                

                    return false;

                });
            },

            buildForm: function(obj,parent) {
                var $this = this, $elem = $(this.element);

                // If there are no arguments, then this is the first time it is running
                if ( arguments.length === 0 ) {
                    // Set the fields and parent
                    obj = $this.options.fields;
                    parent = $this.form;
                }

                // If this is an array, then go into it...
                if ( $.isArray(obj) ) {
                    // Step through each element of the array
                    $.each(obj, function(key,val) {

                        // Setup new parent as a new row
                        var newParent = $('<div />', {'class':'controls controls-row control-group'});

                        // If the current parent is a controls-row or if it is a cloneBox...
                        if ( parent.hasClass('controls-row') || parent.hasClass('cloneBox') ) {

                            // Recurse with the val and the current parent
                            $this.buildForm( val, parent );
                        }
                        // Else if the current parent is NOT controls-row
                        else {

                            // Append newParent to current parent
                            parent.append(newParent);

                            // If the current parent is a fieldset, then it needs to be changed to the first child
                            if ( parent.is('fieldset') ) parent = parent.children().eq(0);

                            // Recurse with newParent
                            $this.buildForm( val, newParent );
                        }
                    });
                }
                // If this is an object, then do something with it...
                else if ( $.isPlainObject(obj) ) {                                
                    // Set defaults if properties are not defined
                    if ( $.type(obj.span)        === 'undefined' ) obj.span       = 12;
                    if ( $.type(obj.type)        === 'undefined' ) obj.type       = 'group';
                    if ( $.type(obj.cloneBox)    === 'undefined' ) obj.cloneBox   = false;
                    if ( $.type(obj.value)       === 'undefined' ) obj.value      = null;
                    if ( $.type(obj.entity)      === 'undefined' ) obj.entity     = null;
                    if ( $.type(obj.placeholder) === 'undefined' ) obj.placeholder= null;
                    if ( $.type(obj.required)    === 'undefined' ) obj.required   = false;

                    // Instantiate newParent
                    var newParent;

                    // If it's a group, a cloner, or a label, then it doesn't need the full setup
                    if ( obj.type === 'group' ) {
                        newParent = $('<div />', {
                            'class': 'span'+obj.span
                        });
                        parent.append(newParent);
                        $this.buildForm(obj.value,newParent);
                    }
                    else if ( obj.type === 'cloner' ) {
                        newParent = $('<div />', {
                            'class': 'controls controls-row control-group cloner'
                        });
                        parent.append(newParent);
                        $this.buildForm(obj.value,newParent);
                    }
                    else if ( obj.type === 'label' ) {
                        newParent = $('<span />', {
                            'class': 'span'+obj.span + ' label',
                            text: obj.value
                        });

                        parent.append(newParent);
                    }
                    // Otherwise, it needs a full setup
                    else {

                        // Setup each different type of field
                        switch ( obj.type ) {

                            // FIELDSET ------------------------------------------------
                            case 'fieldset':
                                newParent = $('<fieldset />');
                                newParent.data('entity',obj.entity);
                                break;

                            // TYPEAHEAD -----------------------------------------------
                            case 'typeahead':
                                newParent = $('<input type="text" />')
                                            .attr('onkeyup','cloneBox.removeInput($(this));$(this).parents(".control-group").eq(0).removeClass("success");');
                                newParent.addClass('needs_setup');
                                newParent.data('setup', function(element,finished) {
                                    element.removeClass('needs_setup');

                                    element.typeahead({                                    
                                        source: function (query, process) {
                                            var elem = this.$element;

                                            elem.parents('.control-group').eq(0).addClass('success') ;

                                            // Make a cache
                                            if ( $.type(elem.data('cache')) === 'undefined' || elem.val().length === 1 ) {

                                                ajax.get({

                                                    se: 'Account',

                                                    sf: 'searchAccountNames',

                                                    sa: query

                                                },

                                                function(data) {
                                                    if ( $.type(data.error) !== 'undefined' ) $.error(data.error);

                                                    elem.data('cache', data);
                                                    process(data);
                                                });
                                            }
                                            else {
                                                return elem.data('cache');
                                            }
                                        },

                                        matcher: function(item) {
                                            var elem = this.$element;

                                            // If the query matches the item....
                                            if ( item.toUpperCase().indexOf(this.query.toUpperCase()) >= 0 ) {
                                                elem.parents('.control-group').eq(0).removeClass('success');
                                                return true;
                                            }
                                            else {
                                                return false;
                                            }
                                        }
                                    });

                                    if ( $.isFunction(finished) ) {
                                        finished();
                                    }
                                });
                                break;

                            // TAGLIST -------------------------------------------------
                            case 'tagList':
                                newParent = $('<input type="text" />');                            
                                newParent.addClass('needs_setup');
                                newParent.data('setup', function(element,finished) {
                                    // @todo: Make this more like typeahead
                                    element.removeClass('needs_setup');

                                    // Fetch the tags
                                    ajax.get({

                                        se: 'Tag',

                                        sf: 'getAllTagNames'

                                    },
                                    function(tagList) {
                                        if ( $.type(tagList.error) !== 'undefined' ) $.error(tagList.error);

                                        // Setup the select2
                                        newParent.select2({

                                            placeholder: element.attr('placeholder'),

                                            tokenSeparators: [','],

                                            tags: tagList,

                                            formatNoMatches: function(term) {
                                                return 'Create New';
                                            }

                                        });

                                        if ( $.isFunction(finished) ) {
                                            finished();
                                        }
                                    });
                                });
                                break;

                            // TEXT ----------------------------------------------------
                            case 'text':
                                newParent = $('<input type="text" />');
                                break;

                            // PASSWORD -----------------------------------------------
                            case 'password':
                                newParent = $('<input type="password" />');
                                break;

                            // EMAIL ---------------------------------------------------
                            case 'email':
                                newParent = $('<input type="text" />');
                                break;

                            // PHONE ---------------------------------------------------
                            case 'phone':
                                newParent = $('<input type="text" />');
                                newParent.addClass('needs_setup');
                                newParent.data('setup', function(element,finished) {
                                    element.removeClass('needs_setup');

                                    element.mask('(999) 999-9999');

                                    if ( $.isFunction(finished) ) {
                                        finished();
                                    }
                                });
                                break;

                            // URL ---------------------------------------------------
                            case 'url':
                                newParent = $('<input type="text" />');
                                break;

                            // TRANSFORMER ---------------------------------------------
                            case 'transformer':
                                newParent = $('<input type="text" />');
                                newParent.addClass('needs_setup');
                                newParent.data('setup', function(element,finished) {
                                    element.removeClass('needs_setup');

                                    // Switch between the element's type
                                    switch ( element.attr('name').substr(0,element.attr('name').indexOf('[')) ) {

                                        case 'address':
                                            element.transformer(
                                                $('<div />', {
                                                        'class': element.attr('class')
                                                    })
                                                    .append(
                                                        $('<div />', {
                                                            'class':'controls controls-row control-group'
                                                        })
                                                        .append(
                                                            $('<input type="text" />')
                                                                .addClass('span9')
                                                                .addClass('address_street')
                                                                .attr('placeholder','Street')    
                                                                .attr('name','address[][street]')
                                                                .attr('style','margin-bottom:5px;')
                                                        )
                                                        .append(
                                                            $('<input type="text" />')
                                                                .addClass('span3')
                                                                .addClass('address_unit')
                                                                .attr('placeholder','Unit')    
                                                                .attr('name','address[][unit]')
                                                        )
                                                    )
                                                    .append(
                                                        $('<div />', {
                                                            'class':'controls controls-row control-group'
                                                        })
                                                        .append(
                                                            $('<input type="text" />')
                                                                .addClass('span6')
                                                                .addClass('address_city')
                                                                .attr('placeholder','City')    
                                                                .attr('name','address[][city]')
                                                        )
                                                        .append(
                                                            $('<select />', {
                                                                'class':'span3 address_state',
                                                                name:'address[][state]'
                                                            })
                                                            .append('\
                                                                <option value=""></option>\
                                                                <option value="AK">AK</option>\
                                                                <option value="AL">AL</option>\
                                                                <option value="AR">AR</option>\
                                                                <option value="AZ">AZ</option>\
                                                                <option value="CA">CA</option>\
                                                                <option value="CO">CO</option>\
                                                                <option value="CT">CT</option>\
                                                                <option value="DC">DC</option>\
                                                                <option value="DE">DE</option>\
                                                                <option value="FL">FL</option>\
                                                                <option value="GA">GA</option>\
                                                                <option value="HI">HI</option>\
                                                                <option value="IA">IA</option>\
                                                                <option value="ID">ID</option>\
                                                                <option value="IL">IL</option>\
                                                                <option value="IN">IN</option>\
                                                                <option value="KS">KS</option>\
                                                                <option value="KY">KY</option>\
                                                                <option value="LA">LA</option>\
                                                                <option value="MA">MA</option>\
                                                                <option value="MD">MD</option>\
                                                                <option value="ME">ME</option>\
                                                                <option value="MI">MI</option>\
                                                                <option value="MN">MN</option>\
                                                                <option value="MO">MO</option>\
                                                                <option value="MS">MS</option>\
                                                                <option value="MT">MT</option>\
                                                                <option value="NC">NC</option>\
                                                                <option value="ND">ND</option>\
                                                                <option value="NE">NE</option>\
                                                                <option value="NH">NH</option>\
                                                                <option value="NJ">NJ</option>\
                                                                <option value="NM">NM</option>\
                                                                <option value="NV">NV</option>\
                                                                <option value="NY">NY</option>\
                                                                <option value="OH">OH</option>\
                                                                <option value="OK">OK</option>\
                                                                <option value="OR">OR</option>\
                                                                <option value="PA">PA</option>\
                                                                <option value="RI">RI</option>\
                                                                <option value="SC">SC</option>\
                                                                <option value="SD">SD</option>\
                                                                <option value="TN">TN</option>\
                                                                <option value="TX">TX</option>\
                                                                <option value="UT">UT</option>\
                                                                <option value="VA">VA</option>\
                                                                <option value="VT">VT</option>\
                                                                <option value="WA">WA</option>\
                                                                <option value="WI">WI</option>\
                                                                <option value="WV">WV</option>\
                                                                <option value="WY">WY</option>\
                                                            ')
                                                        )                                        
                                                        .append(
                                                            $('<input type="text" />')
                                                                .addClass('span3')
                                                                .addClass('address_zip')
                                                                .attr('placeholder','Zip')    
                                                                .attr('name','address[][zip]')
                                                        )
                                                    )
                                            );
                                            break;

                                        default:
                                            $.error(element.attr('name').substr(0,element.attr('name').indexOf('[')) + ' is not a valid transformer entity');
                                            break;
                                    }

                                    if ( $.isFunction(finished) ) {
                                        finished();
                                    }
                                });
                                break;

                            // IMG -----------------------------------------------------
                            case 'img':
                                newParent = $('<img />', {
                                    'style': 'width:124px;height:124px;',
                                    'class': 'img-polaroid'
                                });
                                break;

                            // TEXTAREA ------------------------------------------------
                            case 'textarea':
                                newParent = $('<textarea />');
                                break;                                            

                            // UDFSELECT -----------------------------------------------
                            case 'udfSelect':
                                newParent = $('<select />', {
                                    'class': 'udfSelect'
                                })
                                .append($('<option />', {
                                    text: obj.value !== null ? obj.value : ''
                                }));

                                newParent.addClass('needs_setup');
                                newParent.data('setup', function(element,finished,cloneBox) {                                

                                    element.removeClass('needs_setup');

                                    element.udfSelect({

                                        listData: cloneBox.udfSelectListData,

                                        change: function() {
                                            cloneBox.udfSelectListData = this.listData;
                                        },

                                        finished: function() {

                                            if ( $.isFunction(finished) ) {
                                                finished();
                                            }
                                        }
                                    });
                                });
                                break;

                            // DEFAULT -------------------------------------------------
                            default:
                                $.error(obj.type + ' is not a valid type!');
                                break;                    
                        }

                        // Append the new parent
                        parent.append( newParent );

                        // Set the basic properties of the newParent
                        newParent.addClass('span'+obj.span);

                        // Add the class to all things not fieldsets, otherwise recurse
                        if ( newParent.is('fieldset') ) {
                            // Add the cloneBox class if it is a cloneBox
                            if ( obj.cloneBox ) {
                                newParent.addClass('cloneBox');
                            }
                            // Recurse!
                            $this.buildForm( obj.value, newParent );
                        }
                        else {
                            var parentEntity = parent.data('entity') ? parent.data('entity') : parent.parents('fieldset').data('entity');

                            // Add the placeholder if there is one - otherwise, make it the entity
                            if ( obj.placeholder ) {
                                newParent.attr('placeholder',obj.placeholder);
                            }
                            else {
                                newParent.attr('placeholder',obj.entity);
                            }

                            newParent.addClass( parentEntity + '_' + obj.entity );
                            newParent.attr('name', parentEntity + '[]['+obj.entity+']');

                            if ( obj.required ) newParent.addClass('required');

                            // Set the value
                            newParent.val( obj.value );

                            // Save the original state if there is a value                    
                            if ( newParent.parents('.cloneBox').length > 0 || obj.type === 'transformer' ) {
                                newParent.data( 'original', newParent.clone() );
                            }
                        }
                    }
                }
            },

            setupElements: function(finished,parent,cloneBox) {            
                var $this = this, $elem = $(this.element);

                if ( $.type(parent) === 'undefined' ) parent = $this.form;

                if ( parent.find('.needs_setup').length > 0 ) {                
                    parent.find('.needs_setup').eq(0).data('setup')(parent.find('.needs_setup').eq(0),function() {
                        $this.setupElements(null,parent,cloneBox); 
                        if ( $.isFunction(finished) ) {
                            finished();
                        }
                    },cloneBox);
                }
                else {
                    if ( $.isFunction(finished) ) {
                        finished();
                    } 
                }                       
            },

            setupCloneBoxes: function(finished,index) {
                var $this = this, $elem = $(this.element);

                if ( $.type(index) === 'undefined' ) index = 0;

                if ( $this.form.find('.cloneBox').length > 0 ) {

                    $this.form.find('.cloneBox').eq(index++).cloneBox({

                        // One element has been added and is ready to be set up
                        setup: function(cloner,callback) {                        

                            // Call setup elements - the parent is the cloner (specified at the end)
                            $this.setupElements(function() {
                                // Call the callback, going back into cloneBox
                                if ( $.isFunction(callback) ) {
                                    callback(function() {
                                        if ( $this.form.find('.cloneBox').eq(index).length === 0 ) {
                                            // It is finished!!!!!
                                            if ( $.isFunction(finished) ) {
                                                finished();
                                            }
                                        }
                                    });
                                }

                                // Recurse this function with the increased index
                                $this.setupCloneBoxes(finished,index);
                            }, cloner, this);
                        }

                    });
                }
                else {
                    if ( $.isFunction(finished) ) finished();
                }

            },

            iterateFields: function() {
                var $this = this, $elem = $(this.element);

                $elem.find('fieldset').each(function() {

                    // If there are any children inputs, then change the name attr
                    // to have a 0
                    $(this).children(':input').each(function() {
                        $(this).attr('name',$(this).attr('name').replace('\[\]','\[0\]'));
                    });

                    // If there are "controls controls-row" children, then there are no
                    // input children and these serve as the container for inputs
                    $(this).children().each(function(i) {
                        // Find the inputs inside that are named and edit the name attr
                        $(this).find(':input[name*="[]"]').each(function() {
                            $(this).attr('name',$(this).attr('name').replace('\[\]','\['+i+'\]'));
                        });
                    });

                });
            },

            removeEmptyFields: function(obj) {
                var $this = this, $elem = $(this.element);

                $.each(obj, function(bigIndex) {
                        var count = 0;
                        var lastIndex = 0;
                        var contentsEmpty = true;

                        $.each(obj[bigIndex], function(littleIndex) {
                            count++;

                            $.each(obj[bigIndex][littleIndex], function(tinyIndex,val) {
                                if ( tinyIndex !== 'subtype' && val !== '' ) {
                                    contentsEmpty = false;
                                }
                            });
                        });                            

                        if ( contentsEmpty === true ) {                                
                            delete obj[bigIndex];
                        }
                        else if ( count > 1 ) {                                
                            delete obj[bigIndex][count-1];                                
                        }
                    });

                return obj;
            },

            setupValidation: function() {
                var $this = this, $elem = $(this.element);

                $.validator.setDefaults({
                    // If there is an error....
                    errorPlacement: function(error,element) {                            
                        var errorText = error.text();
                        var controlGroup = element.parents('.control-group').eq(0);

                        if ( !controlGroup.hasClass('error') ) {
                            controlGroup.tooltip({
                                title: errorText,
                                placement: 'bottom'                                    
                            });

                            controlGroup.addClass('error');
                        }
                    },

                    // If the error is fixed....
                    success: function(label,element) {  
                        element = $(element);
                        var controlGroup = element.parents('.control-group').eq(0);

                        if ( controlGroup.hasClass('error') ) {
                            controlGroup.tooltip('destroy');
                            controlGroup.removeClass('error');
                        }
                    },

                    // If there is nothing in the input, then call success on this element
                    showErrors: function(errorMap, errorList) {
                        var obj = this;
                        this.defaultShowErrors();

                        $(this.currentElements).each(function() {                                
                            if ( $(this).is(':blank') && $(this).hasClass('valid') ) {
                                obj.settings.success('valid',$(this));
                            }
                        });
                    }
                });

                // Set validator defaults    
                $.validator.addMethod('isNewAccount', function(value,elem,params) {                
                    var cache = $(elem).data('cache');
                    var isNewAccount = true;

                    if ( params === true ) {                                        

                        if ( $.type(cache) !== 'undefined' ) {
                            $.each(cache, function(key,val) {
                                if ( val === value ) {
                                    isNewAccount = false;
                                    return;
                                }
                            });
                        }

                    }

                    return isNewAccount;

                }, 'This account already exists!');  

                // Instatiate the validator
                $this.validator = $elem.validate({
                    rules: {
                        'contact[][firstName]': {
                            required: function(elem) {
                                switch ( $this.options.entity ) {

                                    case 'Contact':
                                    case 'Organization':
                                        if ( $(elem).parent().children('.contact_firstName').val() ) {
                                            return false;
                                        }
                                        else {
                                            return true;
                                        }
                                        break;

                                    case 'Account':
                                        if ( $(elem).parent().children('.contact_role').val() ) {
                                            if ( $(elem).parent().children('.contact_lastName').val() ) {
                                                return false;
                                            }
                                            else {
                                                return true;
                                            }
                                        }
                                        else {
                                            return false;
                                        }
                                        break;

                                    default:
                                        $.error('Unable to validate '+$this.options.entity);
                                        break;
                                }                    
                            }
                        },

                        'contact[][lastName]': {
                            required: function(elem) {
                                switch ( $this.options.entity ) {

                                    case 'Contact':
                                    case 'Organization':
                                        if ( $(elem).parent().children('.contact_firstName').val() ) {
                                            return false;
                                        }
                                        else {
                                            return true;
                                        }
                                        break;

                                    case 'Account':
                                        if ( $(elem).parent().children('.contact_role').val() ) {
                                            if ( $(elem).parent().children('.contact_firstName').val() ) {
                                                return false;
                                            }
                                            else {
                                                return true;
                                            }
                                        }
                                        else {
                                            return false;
                                        }
                                        break;

                                    default:
                                        $.error('Unable to validate '+$this.options.entity);
                                        break;
                                }
                            }
                        },

                        'account[][name]': {
                            required: function(elem) {
                                switch ( $this.options.entity ) {

                                    case 'Contact':
                                        if ( $(elem).parent().parent().children('.account_role').val() ) {
                                            return true;
                                        }
                                        else {
                                            return false;
                                        }
                                        break;

                                    case 'Account':
                                        return true;
                                        break;

                                    default:
                                        $.error('Unable to validate '+$this.options.entity);
                                        break;
                                }
                            },

                            isNewAccount: function(elem) {
                                switch ( $this.options.entity ) {

                                    case 'Contact':
                                        return false;
                                        break;

                                    case 'Account':
                                        return true;
                                        break;

                                    default:
                                        $.error('Unable to validate '+$this.options.entity);
                                        break;
                                }
                            }
                        },

                        'email[][address]': {
                            email: true
                        },

                        'phone[][num]': {
                            minlength: 14
                        },

                        'website[][url]': {
                            url: true
                        }
                    }
                });
            }
        };

        $.fn[pluginName] = function ( options ) {
            return this.each(function () {
                if (!$.data(this, "plugin_" + pluginName)) {
                    $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
                }
            });
        };

    })( jQuery, window, document );
});