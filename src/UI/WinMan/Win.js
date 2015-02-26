define(['jquery','bootstrap'], function() {
	// Header and content are both elements or strings, buttons is an array of objects.
	// ex: [{text:'Save and Close',type:'btn-primary'}] - type can be blank
	Win = function(header,content,buttons) {
		var $this = this;

		// Set defaults
		if ( $.type(header)     === 'undefined' ) header  = 'This is a Window';
		if ( $.type(content)    === 'undefined' ) content = 'This is the Window\'s Content';
		if ( $.isArray(buttons) === false ) 	  buttons = [{text:'Close'}];

		// Define window components
		$this._hideBtn = $('<button />').addClass('hideBtn').addClass('close').append($('<i />',{'class': 'icon-chevron-down'}));
		$this._header  = $('<div />').addClass('modal-header').addClass('header')
						.append($this._hideBtn)
						.append(header);
		$this._content = $('<div />').addClass('modal-body').addClass('content')
						.append(content);
		$this._footer  = $('<div />').addClass('modal-footer').addClass('footer');

		$this._buttons = new Array();
		$.each(buttons, function(index,obj) {
			// Set defaults
			if ( obj.hasOwnProperty('text') === false ) obj['text'] = 'Button';
			if ( obj.hasOwnProperty('type') === false ) obj['type'] = '';

			// Add the button to the buttons array and append to footer
			$this._buttons.push( $('<button />', { text: obj.text }).addClass('btn').appendTo($this._footer) );
		});

		$this._html = $('<div />').addClass('modal').addClass('hide').addClass('fade').addClass('win')
					 .append( $this._header )
					 .append( $this._content )
					 .append( $this._footer );

        // Make this a modal!
        $this._html.modal({
        	keyboard: false,
        	backdrop: 'static'
        });
	}

	Win.prototype.getHeader = function() {
		return this._header;
	};

	Win.prototype.getContent = function() {
		return this._content;
	};

	Win.prototype.getButtons = function() {
		return this._buttons;
	};

	Win.prototype.getHideBtn = function() {
		return this._hideBtn;
	}

	Win.prototype.getHTML = function() {
		return this._html;
	};
});