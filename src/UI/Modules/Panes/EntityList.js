;(function(global,undefined) {
	EntityList = function() {
		var $this = this;

		$this._html   =   	$('<div />')                        
                            .addClass('carousel').css('margin-bottom',0)
                            .addClass('slide')
                            .carousel({interval: false});

        $this._carousel =   $('<div />').appendTo( $this._html )
                            .addClass('carousel-inner')
                            .css('margin-bottom',0);

        $this._list     =   $('<ul />').appendTo( $('<div />').addClass('item').addClass('active').appendTo($this._carousel) )
                            .addClass('nav')
                            .addClass('nav-tabs')
                            .addClass('nav-stacked')
                            .addClass('entity-list');

        $this._history	=	new Array();

        // START - ON LOAD --------------------------------------------------------------------------

        // Cache first
        accounts.getEach(function(account) {            
            $this.add( account );
        });        
        contacts.getEach(function(contact) {            
            $this.add( contact );
        });
        
        // Then ajax
        accounts.sync(function(account) {
            // If it's not already in there, add it!
            if ( $this._list.children('.Account.'+account.getID()).length < 1 ) {
                $this.add(account);
            }
        },
        function() {
            contacts.sync(function(contact) {
                // If it's not already in there, add it!
                if ( $this._list.children('.Contact.'+contact.getID()).length < 1 ) {
                    $this.add(contact);
                }
            });
        });        

        // When the page loads, show the card according to the hash if there is one
        // if ( location.hash !== '' ) {
        //     var hash = location.hash;                
        //     var $thisCard = $this._carousel.find('.active');
        //     var entity = hash.substr(1,7);
        //     var id     = hash.substr(8);

        //     // Show next card
        //     switch ( entity ) {
                
        //         case 'Account':
        //             accounts.get(id, function(account) {
        //                 $this.showNewCard(account);
        //             });
        //             break;

        //         case 'Contact':
        //             contacts.get(id, function(contact) {
        //                 $this.showNewCard(contact);
        //             });
        //             break;

        //         default:
        //             alertify.error('Unkown hash: ' + hash);
        //             break;
        //     }
        // }
        // END - ON LOAD ----------------------------------------------------------------------------        

        // START - EVENTS ---------------------------------------------------------------------------

        window.getContact = function(isHistoric,id) {
            if (isHistoric) {
                $this._prevCard = $this._carousel.find('.active');
                $this.showPrevCard();
            }
            else {
                contacts.get(id, function(contact) {
                    $this.showNewCard(contact);
                });
            }            
        }

        window.reset = function() {
            $this.showList();
        }

        // This is what happens when the hash changes
        // $(window).hashchange(function(e) {
        //     if ( location.hash.length > 0 ) {
        //         var $thisCard = $this._carousel.find('.active');

        //         // Add class to show only this entityId                
        //         $('.Entity.'+location.hash.substr(1));                

        //         // Is it back or forward?
        //         if ( location.hash === $this._history.last() ) {
        //             // Remove that class from the last in history
        //             $('.Entity.'+$this._history.last().substr(1));
        //             // Show previous card
        //             $this._prevCard = $thisCard;
        //             $this.showPrevCard();
        //             $this._history.pop();
        //         }
        //         else {
        //             var entity = location.hash.substr(1,7);
        //             var id     = location.hash.substr(8);
        //             $this._history.push(location.hash);
                    
        //             // Show next card
        //             switch ( entity ) {
                        
        //                 case 'Account':
        //                     accounts.get(id, function(account) {
        //                         $this.showNewCard(account);
        //                     });
        //                     break;

        //                 case 'Contact':
        //                     contacts.get(id, function(contact) {
        //                         $this.showNewCard(contact);
        //                     });
        //                     break;

        //                 default:
        //                     alertify.error('Unkown hash: ' + hash);
        //                     break;
        //             }
        //         }
        //     }
        //     else {
        //         // Show list and clear history
        //         $this._history = [];
        //         // Find all occurances of showOnly and get rid of it
        //         $('.Entity.showOnly');
        //         // Show the list!
        //         $this.showList();
        //     }
        // });

        // What happens after the carousel slides        
        $this._html.carousel().on('slid', function(e) {
            if ( $this._showList === true ) {
                $this._carousel.find('.item:gt(0)').remove();
                $this._showList = false;
            }
            else if ( $this._prevCard !== null ) {
                $this._prevCard.remove();                
            }
        });
        // END - EVENTS -----------------------------------------------------------------------------
	};
	EntityList.prototype.constructor = EntityList;

	// Add entity to list in alphabetical order
	EntityList.prototype.add = function(entity) {
		var $this = this;

		// Just append the first one
        if ( $this._list.children().length === 0 )
            $this._list.prepend( $this._getItem(entity) );
        else {
            // Go through each li
            $this._list.children().each(function(index,elem) {
                // If the entity name is further on the alphabet than the li            
                // @todo: I'm worried because it works but doesn't break the loop
                if ( name > $(elem).children('a').text() ) {
                    // Put the entity before the li
                    $(elem).after( $this._getItem(entity) );
                }
                else {
                    $(elem).before( $this._getItem(entity) );
                    return false;
                }
            });
        }
	};

	// Get the entity card @todo: maybe make this entity-centric
	EntityList.prototype._getCard = function(entity) {
        // Get the initial entity html
        var $entityHTML = entity.getHTML('pic','name','icon','checkbox');

        // Get the card container
        var $card = $('<div />').addClass('entity-card')
                    .addClass('well').addClass('well-small');

        // fill in the card
        $('<div />').attr('class',$entityHTML.attr('class')).appendTo( $card )        
        // CHECKBOX
        .append( $entityHTML.children('.checkbox-label') )        
        // PICTURE
        .append( $entityHTML.children('.pic') )
        // ICON
        .append( $entityHTML.children('.icon') )
        // NAME
        .append( $entityHTML.children('.name') );

		return $card;
	};

	// Get the entity list item
	EntityList.prototype._getItem = function(entity) {
        // Get the initial entity html
        var $entityHTML = entity.getHTML('pic','checkbox','icon','name');        

        // Return the item
		return  $('<li />', { 'class': $entityHTML.attr('class') })
                .append(
                    $('<a />', {href: '#get&'+entity.getType()+'&'+entity.getID()})
                    .append( $entityHTML.children('.checkbox-label') )
                    .append( $entityHTML.children('.pic') )
                    .append( $entityHTML.children('.icon') )
                    .append( $entityHTML.children('.name') )
                    .append( $('<i />').addClass('icon-chevron-right').addClass('close') )
                );
	};

	EntityList.prototype.showNewCard = function(entity) {
        this._prevCard = null;
        
        $('<div />').appendTo(this._carousel)
        .addClass('item')
        .append( this._getCard(entity) );

        this._html.carousel('next');
        
        // Make sure the list menu is the right size
        $('.entity-list-menu input:text').each(function(index,elem) {
            $(elem).width( $('.entity-list-menu').parents('.pane').width() - $(elem).parent().width() + $(elem).width() - 1 );
        });
    }

    EntityList.prototype.showList = function() {
        this._showList = true;
        this._html.carousel(0);
        
        // Make sure the list menu is the right size
        $('.entity-list-menu input:text').each(function(index,elem) {
            $(elem).width( $('.entity-list-menu').parents('.pane').width() - $(elem).parent().width() + $(elem).width() - 1 );
        });
    }

    EntityList.prototype.showPrevCard = function() {
        this._html.carousel('prev');
        
        // Make sure the list menu is the right size
        $('.entity-list-menu input:text').each(function(index,elem) {
            $(elem).width( $('.entity-list-menu').parents('.pane').width() - $(elem).parent().width() + $(elem).width() - 1 );
        });
    }
    
    define(['Pane','ContactCache','AccountCache','UdfCache','TagCache','LogCache'], function() {return $.extend({},new EntityList(),new Pane());});
}(this));