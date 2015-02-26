define(['jquery','jquery.select2','jquery.styleAttributeToObject'], function() {
    ;(function ( $, window, document, undefined ) {

        var pluginName = "udfSelect",
            defaults = {
                listData: null,
                change: null
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
                var $this = this, elem = $(this.element);

                // Grab all information stored in tag and create the hidden input
                var input = $('<input type="hidden" />')
                            .addClass(elem.attr('class'))
                            .attr('name',elem.attr('name'))
                            .data('original',elem.data('original'));

                // Replace the elem with a hidden input
                elem.replaceWith(input);

                // Set the input value if there is one
                input.val( elem.val() );

                if ( $this.options.listData === null ) {

                    // Ajax get the udfs in question
                    ajax.get({

                        se: 'Udf',

                        sf: 'getFormattedSubTypes',

                        sa: input.attr('name').split('[')[0]

                    },

                    // And fill the select with the answers, at the same time converting it to select2
                    function(json) {                    
                        if ( $.type(json.error) !== 'undefined' ) $.error(json.error);

                        // Setup the listData object
                        $this.options.listData = {results:[]};

                        if ( input.val() ) $this.options.listData.results = $this.options.listData.results.concat({id:input.val(), text:input.val()});
                        $this.options.listData.results = $this.options.listData.results.concat(json);

                        // Call change function upon completion of this initial ajax call, which is technically the first change: from nothing to something
                        if ( $.isFunction($this.options.change) ) {
                            $this.options.change();
                        }

                        input.select2({
                            placeholder: 'Type',

                            query: function (query) {
                                // Make the query object
                                var queryObj = {results:[]};

                                // If there is a query...
                                if ( query.term.length > 0 ) {

                                    // Go through each listdata result and match it up with the query
                                    $.each($this.options.listData.results, function(key,value) {
                                        var listItem = value.text.toUpperCase();
                                        var queryItem = query.term.toUpperCase();                                                                        

                                        // If the query is inside of the listitem
                                        if ( listItem.indexOf(queryItem) === 0 ) {
                                            // Add this list item to the query object
                                            queryObj.results = queryObj.results.concat(this);
                                        }
                                    });

                                    // After all of that, if there are no new queryobj results,
                                    // then that means nothing matched up, which in turn means
                                    // that this is a new thing, so add the query to the queryobj
                                    if ( queryObj.results.length === 0 ) {
                                        queryObj.results.push({id:query.term,text:query.term});                                    
                                    }
                                }
                                // If there is no query yet, that means there is no search,
                                // so just show the listdata as it is
                                else {
                                    queryObj.results = $this.options.listData.results;
                                }


                                // Push the callback through
                                query.callback( queryObj );
                            },

                            formatNoMatches: function(term) {
                                return 'Create New';
                            },

                            containerCss: function() {
                                return elem.styleAttributeToObject();
                            },

                            initSelection: function(element,callback) {                        
                                var data = {id:element.val(), text:element.val()};

                                callback( data );                        
                            }
                        });

                        // Remove the udfSelect class from the hidden input
                        input.removeClass('udfSelect');

                        // Set the default value to "Other" if there is no other value selected
                        if ( !input.val() ) {
                            input.select2('val','Other');                    
                        }

                        // When the user changes the input to a new value....
                        input.change(function(elem) {                        
                            // Check to see if the value of the elem is inside listData
                            var exists = false;

                            $.each($this.options.listData.results, function(key,value) {
                                var listItem = value.text.toUpperCase();
                                var queryItem = elem.val.toUpperCase();

                                if ( queryItem === listItem ) {
                                    // It DOES exist
                                    exists = true;

                                    // Break out of the loop
                                    return false;
                                }
                            });

                            // If it doesn't exist, add it to list data
                            if ( exists === false ) {
                                $this.options.listData.results.push({id:elem.val,text:elem.val});
                            }
                        });

                        // Callback
                        if ( $.isFunction($this.options.finished) ) {
                            $this.options.finished();
                        }
                    });
                }
                else {
                    if ( input.val() )  {
                        // Check to see if the value of the elem is inside listData
                        var exists = false;

                        $.each($this.options.listData.results, function(key,value) {
                            var listItem = value.text.toUpperCase();
                            var queryItem = input.val().toUpperCase();

                            if ( queryItem === listItem ) {
                                // It DOES exist
                                exists = true;

                                // Break out of the loop
                                return false;
                            }
                        });

                        // If it doesn't exist, add it to list data
                        if ( exists === false ) {
                            $this.options.listData.results.push({id:input.val(),text:input.val()});
                        }
                    }

                    input.select2({
                        placeholder: 'Type',

                        query: function (query) {
                            // Make the query object
                            var queryObj = {results:[]};

                            // If there is a query...
                            if ( query.term.length > 0 ) {

                                // Go through each listdata result and match it up with the query
                                $.each($this.options.listData.results, function(key,value) {
                                    var listItem = value.text.toUpperCase();
                                    var queryItem = query.term.toUpperCase();                                                                        

                                    // If the query is inside of the listitem
                                    if ( listItem.indexOf(queryItem) === 0 ) {
                                        // Add this list item to the query object
                                        queryObj.results = queryObj.results.concat(this);
                                    }
                                });

                                // After all of that, if there are no new queryobj results,
                                // then that means nothing matched up, which in turn means
                                // that this is a new thing, so add the query to the queryobj
                                if ( queryObj.results.length === 0 ) {
                                    queryObj.results.push({id:query.term,text:query.term});                                    
                                }
                            }
                            // If there is no query yet, that means there is no search,
                            // so just show the listdata as it is
                            else {
                                queryObj.results = $this.options.listData.results;
                            }


                            // Push the callback through
                            query.callback( queryObj );
                        },

                        formatNoMatches: function(term) {
                            return 'Create New';
                        },

                        containerCss: function() {
                            return elem.styleAttributeToObject();
                        },

                        initSelection: function(element,callback) {                        
                            var data = {id:element.val(), text:element.val()};

                            callback( data );                        
                        }
                    });

                    // Remove the udfSelect class from the hidden input
                    input.removeClass('udfSelect');

                    // Set the default value to "Other" if there is no other value selected
                    if ( !input.val() ) {
                        input.select2('val','Other');                    
                    }

                    // When the user changes the input to a new value....
                    input.change(function(elem) {
                        // Check to see if the value of the elem is inside listData
                        var exists = false;

                        $.each($this.options.listData.results, function(key,value) {
                            var listItem = value.text.toUpperCase();
                            var queryItem = elem.val.toUpperCase();

                            if ( queryItem === listItem ) {
                                // It DOES exist
                                exists = true;

                                // Break out of the loop
                                return false;
                            }
                        });

                        // If it doesn't exist, add it to list data
                        if ( exists === false ) {
                            $this.options.listData.results.push({id:elem.val,text:elem.val});
                        }
                    });

                    // Callback
                    if ( $.isFunction($this.options.finished) ) {
                        $this.options.finished();
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

    $(document).ready(function($) {

        // This fixes a problem with tabbing after something has been selected
        $(this).on('blur', '.udfSelect', function() {
            if ( $(this).children().hasClass('select2-default') === false ) {
                $(this).find('[tabindex]').removeAttr('tabindex');
            }
        });

    });
});