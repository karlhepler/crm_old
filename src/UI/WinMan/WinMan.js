;(function(global,undefined) {
	WinMan = function() {
		var $this = this;

		$this._windows = new Array();
		$this._html = $('<ul />').addClass('navbar-inner').addClass('nav').addClass('nav-pills').addClass('win-man');

		// EVENTS ------------------------------------------------------------------------------ //

		// Hash Change History Default Controller
		window.hash_history = new Array();

		$(window).on('hashchange', function(e) {
			// If there is a hash...
			if ( window.location.hash.length > 0 ) {

				var isHistoric;
                
                // If the user is trying to go back...
                if ( window.location.hash === window.hash_history ) {
                	// First remove the #, then split by & (#get&Account&42). This also removes the last element from history
                	var hashArray = window.hash_history.pop().substr(1).split('&');  
                	isHistoric = true;              	
                }
                // Else if the user is trying something new...
                else {
                	// Add this location.hash to the history
            		window.hash_history.push(window.location.hash);
                	// First remove the #, then split by & (#get&Account&42)
                	var hashArray = window.location.hash.substr(1).split('&');  
                	isHistoric = false;              	
                }

                // Call the hash function
            	window[hashArray[0]+hashArray[1]](isHistoric,hashArray[2]?hashArray[2]:null);                
			}
			// No hash...
			else {
				// Clear the history
				window.hash_history = [];

				// Reset
				if ( $.isFunction(window.reset) ) window.reset();
			}
		});

		window.newAccount = function(isHistoric) {

		}
		window.newContact = function(isHistoric) {

		}
		window.editAccount = function(isHistoric,id) {

		}
		window.editContact = function(isHistoric,id) {

		}
		window.getAccount = function(isHistoric,id) {
			accounts.get(id, function(account) {
				$this.newWin( account.getName(), account.getHTML('pic','icon','name','checkbox') );
			});			
		}
		window.getContact = function(isHistoric,id) {
			contacts.get(id, function(contact) {
				$this.newWin( contact.getName(), contact.getHTML('pic','icon','name','checkbox') );
			});
		}

		// ------------------------------------------------------------------------------------- //
	}

	WinMan.prototype.newWin = function(header,content,buttons) {
		var win = new Win(header,content,buttons);
		win.getHTML().addClass(this._windows.length.toString());
		// Add the window to the array
		this._windows.push( win );
	};

	// Returns the html for the winman's bottom bar
	WinMan.prototype.getHTML = function() {
		return this._html;
	};

	define(['jquery','Win'], function() { return new WinMan(); });
}(this));