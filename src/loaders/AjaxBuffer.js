;(function (global,undefined) {
    
    var AjaxBuffer = function(buffer) {
        var $this = this;

        $this._queue = new Array();
        $this._buffer = ($.type(buffer) === 'undefined' ? 100 : buffer);
        $this._todo = 0;
    }

    AjaxBuffer.prototype.get = function(query,success,error) {
        this._todo++;

        // Add the query to the end of the queue
        this._queue.push({type:'get',query:query,success:success,error:error});

        this._buf();
    }

    AjaxBuffer.prototype.post = function(query,success,error) {
        this._todo++;

        // Add the query to the end of the queue
        this._queue.push({type:'post',query:query,success:success,error:error});

        this._buf();
    }

    AjaxBuffer.prototype._run = function() {
        var $this = this;

        if ( $this._queue.length < $this._buffer ) {        
            try {
                var entry = $this._queue.shift();

                $.ajax({
                    type: entry.type,
                    url: 'query.php',
                    data: entry.query,
                    dataType: 'json',
                    success: function(json) {
                        if ( ($.isArray(json) && json.length === 0) || json === false ) {
                            alertify.error(entry.type + ' request returned empty');
                            if ( $.isFunction(entry.error) ) entry.error();
                        }
                        else {
                            alertify.success(entry.type + ' success');
                            if ( $.isFunction(entry.success) ) entry.success(json);
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        alertify.log(jqXHR.responseText,'error',0);
                        if ( $.isFunction(entry.error) ) entry.error(jqXHR, textStatus, errorThrown);
                    },
                    complete: function(jqXHR, textStatus) {
                        $this._todo--;
                        $this._buf();
                    }
                });
            }
            catch(e) {
                alertify.error(e);
            }
        }
    }

    AjaxBuffer.prototype._buf = function() {
        if ( this._queue.length > 0 ) {
            this._run();
        }
        else if ( this._todo === 0 ) {
            if ( $.isFunction(this.finished) ) this.finished();
        }
    }
    
    define(['alertify'], function() {
        if ( typeof global.ajax === 'undefined' ) global.ajax = new AjaxBuffer();
    });
}(this));