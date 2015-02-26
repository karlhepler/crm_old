define(['jquery','jquery.replaceWithPush'], function() {
    ;(function ( $, window, document, undefined ) {

        var pluginName = "transformer",
            defaults = {

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

                if ( $.type($this.options) === 'undefined' ) 
                    $.error('You must specify the transformed state');                        

                // Save a random number
                var unique = Math.floor(Math.random()*999);

                $this.parent = $elem.parent();

                // Setup before and after and save original state to both
                $this.before = $elem.clone(true).val('');
                    //$this.before.data('original',$elem.data('original'));
                    $this.before.attr('transformer',unique);
                    $this.before.removeClass('transformer');
                $this.after = $this.options;                
                    $this.after.data('original',$elem.data('original'));
                    $this.after.attr('transformer',unique);
                    $this.after.removeClass('transformer');

                // Set the toggle data
                $this.before.data('toggle',$this.after);
                $this.after.data('toggle',$this.before);

                // If there is a value in elem, then after needs to be filled with it
                if ( $elem.val() ) {
                    // Make a value array from the value in elem
                    var valArray = $elem.val().split('|');
                    valArray.pop();

                    // Replace elem with after
                    $elem.replaceWith( $this.after );

                    // Fill after with valueArray
                    $this.after.find(':input').each(function(i,e) {
                        $(e).val( valArray[i] );
                    });
                }
                else {
                    // Replace elem with before
                    $elem.replaceWith( $this.before );
                }

                $(document).on('focus', ':input', function() {
                    // Make sure lastfocused has been defined first
                    if ( $.type($this.lastFocusedTransformer) !== 'undefined' ) {

                        // Set the focused transformer - if there is none, then it will be empty array
                        var focusedTransformer = $(this).parents('[transformer]');

                        // If the last focused was a transformer...
                        if ( $this.lastFocusedTransformer.length > 0 ) {
                            // If the last focused is a different transformer than the current transformer...
                            if ( $this.lastFocusedTransformer.attr('transformer') !== focusedTransformer.attr('transformer') ) {
                                // If all inputs are empty
                                if ( $this.lastFocusedTransformer.find(':input:not(:blank)').length === 0 ) {
                                    // Replace with the toggle and set the new toggle
                                    $this.lastFocusedTransformer.replaceWithPush( $this.lastFocusedTransformer.data('toggle') )
                                                                .data('toggle',$this.lastFocusedTransformer);
                                }                            
                            }                        
                        }
                    }

                    // If this focused input is a transformer...
                    if ( $(this).attr('transformer') ) {
                        // Replace it with the after version, which is saved in toggle - then save new toggle
                        $(this).replaceWithPush( $(this).data('toggle') )                           
                            .data('toggle',$(this))
                            .find(':input:first').focus();
                    }
                });

                // On input blur, find the parent transformer and set it to lastfocused - if there isn't one, then it will be set to empty
                $(document).on('blur', ':input', function() {
                    $this.lastFocusedTransformer = $(this).parents('[transformer]');
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