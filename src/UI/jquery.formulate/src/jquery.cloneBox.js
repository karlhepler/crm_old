define(['jquery','jquery.validate'], function() {
    ;(function ( $, window, document, undefined ) {

        var pluginName = "cloneBox",
            defaults = {
                udfSelectListData: null
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
                var $this = this, $cloneBox = $(this.element);

                // Make the clone the empty version of the first child of the cloneBox
                $this.clone = $cloneBox.children(':first').clone(true);
                $this.clone.find(':input').val('');
                $this.clone.find('select').children().remove().append('<option></option>');            

                // Append clone only if the last cloner is NOT blank
                if ( $cloneBox.children(':last').find(':input:last').is(':not(:blank)') ) {
                    $cloneBox.append( $this.clone.clone(true) );
                }            

                // Setup all children, including the clone
                $this.setupChildren();



                // EVENT HANDLING!!!! ----------------------------------------------

                // If user presses a key or pastes inside of an empty text box within a cloner container...
                $cloneBox.on('keypress', '.cloner input:text:blank:not(.select2-input)', function() {

                    // If ALL fields in the cloner are empty...
                    if ( $(this).parents('.cloner').find('input:text:not(:blank), select option:not(:blank):selected').length === 0) {

                        // Append the clone
                        $this.addClone();

                        // Show the remove icon and the movable icon on this
                        $(this).parents('.cloner').find('.icon-remove, .handle').show();

                        // Put some space between this and the next cloner
                        $(this).parents('.cloner').css('margin-bottom','5px');
                    }
                });

                // This is if a select is changed - append the clone
                var empty = true;
                $cloneBox.on('change', '.cloner select', function() {
                    if ( $(this).val() !== '' ) {
                        if ( empty && $(this).parents('.cloner').find('input:text:not(:blank)').length === 0 ) { 
                            empty = false;

                            // Append the clone
                            $this.addClone();

                            // Show the remove icon and the movable icon on this
                            $(this).parents('.cloner').find('.icon-remove, .handle').show();

                            // Put some space between this and the next cloner
                            $(this).parents('.cloner').css('margin-bottom','5px');
                        }            
                    }
                    else {
                        if ( $(this).parents('.cloner').find('input:text:not(:blank)').length === 0 ) {                        
                            empty = true;
                            cloneBox.removeInput($(this));
                        }                    
                    }
                });

                // If user blurs or keysup on an input text of any kind within cloner...
                $cloneBox.on('keyup blur', '.cloner input:text', function() {
                    cloneBox.removeInput($(this));
                });

                // If the user clicks on icon-remove, then remove this
                $cloneBox.on('click', '.icon-remove', function() {
                    $(this).parents('.cloner').remove();
                });

                $cloneBox.sortable({
                    axis: 'y',
                    items: '>:not(:last)',
                    containment: $cloneBox,
                    handle: '.handle'
                });

            },

            addClone: function(finished) {
                var $this = this, $cloneBox = $(this.element);

                var $newClone = $this.clone.clone(true);
                $cloneBox.append($newClone);

                if ( $.isFunction($this.options.setup) ) {
                    $this.options.setup($newClone, function(cloneBoxComplete) {

                    });
                }

                if ( $.isFunction(finished) ) {
                    // Call the callback
                    finished();
                }
            },

            // Now that the clone is setup, go through each cloner in the clonebox and set it up
            setupChildren: function(index,finished) {  
                var $this = this, $cloneBox = $(this.element);

                if ( arguments.length === 0 ) index = 0;

                if ( $.isFunction($this.options.setup) ) {                    
                    if ( $cloneBox.children().eq(index).length > 0 ) {

                        var newChild = $cloneBox.children().eq(index);

                        if ( $cloneBox.children().eq(index+1).length > 0 ) {
                            $cloneBox.children().eq(index)
                            .wrapInner(
                                $('<div />', {
                                        'class': 'span10'
                                    })
                                )
                                .prepend(
                                    $('<div />', {
                                        'class': 'span1',
                                        style: 'padding-top:1px'
                                    })
                                    .append(
                                        $('<span />', {
                                            'class': 'close handle',
                                            style: 'float:left;cursor:ns-resize;',
                                            'text': ':::'
                                        })
                                    )
                                )
                                .prepend(
                                    $('<div />', {
                                        'class': 'span1',
                                        style: 'padding-top:6px'
                                    })
                                    .append(
                                        $('<i />', {
                                            'class': 'icon-remove close'
                                        })
                                    )
                            );
                        }
                        else {
                            $cloneBox.children().eq(index)
                            .wrapInner(
                                $('<div />', {
                                        'class': 'span10'
                                    })
                                )
                                .prepend(
                                    $('<div />', {
                                        'class': 'span1',
                                        style: 'padding-top:1px'
                                    })
                                    .append(
                                        $('<span />', {
                                            'class': 'close handle',
                                            style: 'float:left;cursor:ns-resize;',
                                            'text': ':::'
                                        })
                                        .hide()
                                    )
                                )
                                .prepend(
                                    $('<div />', {
                                        'class': 'span1',
                                        style: 'padding-top:6px'
                                    })
                                    .append(
                                        $('<i />', {
                                            'class': 'icon-remove close'
                                        })
                                        .hide()
                                    )
                            );
                        }
                        index++;

                        $this.options.setup(newChild, function(cloneBoxComplete) {
                                $this.setupChildren(index,cloneBoxComplete);
                        });
                    }
                    else {                                                
                        // IT'S FINISHED!!!
                        if ( $.isFunction(finished) ) {
                            // Wrap the cloner in its new body
                            $this.clone.wrapInner(
                                $('<div />', {
                                        'class': 'span10'
                                    })
                                )
                                .prepend(
                                    $('<div />', {
                                        'class': 'span1',
                                        style: 'padding-top:1px'
                                    })
                                    .append(
                                        $('<span />', {
                                            'class': 'close handle',
                                            style: 'float:left;cursor:ns-resize;',
                                            'text': ':::'
                                        })
                                        .hide()
                                    )
                                )
                                .prepend(
                                    $('<div />', {
                                        'class': 'span1',
                                        style: 'padding-top:6px'
                                    })
                                    .append(
                                        $('<i />', {
                                            'class': 'icon-remove close'
                                        })
                                        .hide()
                                    )
                            );

                            // Call the callback
                            finished();
                        }
                    }
                }
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


    // MORE EVENT HANDLING!
    window.cloneBox = {
        // This is a hack for the account field, or any field that uses typeahead, since that plugin steals the keyup event, it has to
        // be called manually with this function
        removeInput: function($this) {
            // If there is absolutely nothing inside cloner that has a value...
            if ( $this.parents('.cloner').find('input:text:not(:blank), select option:not(:blank):selected').length === 0 ) {

                // If the next element is a cloner with info in it, then remove THIS one
                if ( $this.parents('.cloner').next('.cloner').find('input:text:not(:blank)').length > 0 ) {
                    // Focus on the next cloner                
                    $this.parents('.cloner').next('.cloner').find('input:text:eq(1)').focus();

                    // Remove this cloner
                    $this.parents('.cloner').remove();
                }
                // Else if there is no info in the next cloner, then remove it instead
                else {
                    // Otherwise, remove the next cloner
                    $this.parents('.cloner').next('.cloner').remove();

                    // Hide the remove button from this one
                    $this.parents('.cloner').find('.icon-remove, .handle').hide();

                    // Take the extra space between this and the next cloner away
                    $this.parents('.cloner').css('margin-bottom','0px');
                }
            }
        }
    };
});