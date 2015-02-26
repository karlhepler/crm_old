define(['AjaxBuffer'], function() {
    // ENTITY EntityCache._cache ----------------------------------------------------------------
    // Options = {
    //              entityType,       (Entity name)
    //              sortBy       (sort the mysql request)
    //           }
    EntityCache = function (options) {
        // If no arguments, then return
        if ( arguments.length === 0 ) return;    
        var $this = this;

        // Set class variables
        $this._entityType = options.entityType;
        $this._sortBy = options.sortBy;
    }
    EntityCache._cache = (function() {
        // Make localStorage the cache - otherwise, just make an object
        if ( $.type(window.localStorage) === 'undefined' )
            return {};
        else
            return window.localStorage;
    })(this);

    EntityCache.prototype._get = function(id,callback) {
        var $this = this;

        // Try to get it from cache first
        if ( EntityCache._cache[this._entityType+id] ) {
            if ( $.isFunction(callback) ) callback( [{type:this._entityType,json: JSON.parse(EntityCache._cache[this._entityType+id])}] );
        }
        // If it's not in cache, then get it from server
        else {
            // Get the data from the server
            ajax.get({
                se: $this._entityType,
                sf: 'get',
                sa: id
            },
            // Success
            function(entityJSON) {
                // Store the entity in the cache and call the callback
                EntityCache._cache[$this._entityType+entityJSON.id] = JSON.stringify(entityJSON);

                // Return the entity json object
                if ( $.isFunction(callback) ) callback( [{type:$this._entityType,json: entityJSON}] );
            },
            // Failure
            function() {
                if ( $.isFunction(callback) ) callback(false);
            });
        }
    }

    EntityCache.prototype.getEach = function(each) {
        var $this = this;

        $.each(EntityCache._cache, function(index,entity) {
            if ( index.indexOf($this._entityType) !== -1 )
                if ( $.isFunction(each) ) {
                    $this.get(JSON.parse(entity).id, function(entity) {
                        each(entity);
                    });
                }
        });
    }

    EntityCache.prototype.sync = function(each,finished,customSearch) {
        var $this = this;
        
        ajax.get({
            se: $this._entityType,
            sf: 'search',
            sa: $.type(customSearch) !== 'undefined' ? customSearch : [ 0, 0, {id:'%'}, $this._sortBy ]
        },
        // Success
        function(entityList) {

            var entityElemsToUpdate = new Array();

            $.each(entityList, function(index,entity) {
                // Add each to the cache
                EntityCache._cache[$this._entityType+entity.id] = JSON.stringify(entity);

                // Call the callback
                if ( $.isFunction(each) ) {
                    $this.get(entity.id, function(entity) {

                        entityElemsToUpdate[entity.getType()+entity.getID()] = entity;
                        
                        each(entity);
                    });
                }
            });

            // @todo: DELETE THE ELEMS AND JSON THAT DIDN'T GET RETURNED

            // UPDATE THE CONTENT OF ALL ELEMS WITH NEW JSON DATA
            $.each(entityElemsToUpdate, function(index,entity) {
                entity.updateHTML();
            });

            if ( $.isFunction(finished) ) finished();
        },
        // Failure - probably a connection error
        function() {
            if ( $.isFunction(finished) ) finished();
        });
    }
});