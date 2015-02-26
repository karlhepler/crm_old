;(function (global,undefined) {
    
    var UI = function(winMan) {
        var $this = this;


        // Define header
        this._header =  $('<header />').addClass('navbar').addClass('navbar-inverse').addClass('navbar-fixed-top')
                        .append(
                            $('<div />').addClass('navbar-inner')
                            .append(
                                $('<div />').addClass('container-fluid')
                                .append(
                                    $('<button type="button" />').addClass('btn').addClass('btn-navbar')
                                    .attr('data-toggle','collapse').attr('data-target','.nav-collapse')
                                    .append( $('<span />').addClass('icon-bar') )
                                    .append( $('<span />').addClass('icon-bar') )
                                    .append( $('<span />').addClass('icon-bar') )
                                )
                                .append(
                                    $('<a />', {href: '#'}).addClass('brand')
                                    .append(
                                        $('<span />').addClass('Entity').addClass('Account').addClass(ORGANIZATION_ACCOUNTID)
                                        .append( $('<span />', { text: ORGANIZATION_ACCOUNTNAME }).addClass('name') )
                                    )
                                )
                                .append(
                                    $('<div />').addClass('nav-collapse').addClass('collapse')
                                    .append(
                                        $('<ul />').addClass('nav')
                                        .append(
                                            $('<li />').addClass('dropdown')
                                            .append(
                                                $('<a />', {href: '#'}).addClass('dropdown-toggle').attr('data-toggle','dropdown')
                                                .append( $('<span />', { text: 'CRM' }) )
                                                .append( $('<b />').addClass('caret').css('margin-left',10) )
                                            )
                                            .append(
                                                $('<ul />').addClass('dropdown-menu')
                                                .append( $('<li />').append($('<a />', {href: '?page=crm', text: 'Dashboard'})) )
                                                .append( $('<li />').addClass('divider') )
                                                .append( $('<li />').append($('<a />', {href: '#new&Account', text: 'New Account'}).prepend($('<b />').addClass('icon-briefcase').css('margin-right',10))) )
                                                .append( $('<li />').append($('<a />', {href: '#new&Contact', text: 'New Contact'}).prepend($('<b />').addClass('icon-user').css('margin-right',10))) )
                                            )
                                        )
                                    )
                                    .append(
                                        $('<ul />').addClass('nav').addClass('pull-right')
                                        .append(
                                            $('<li />').addClass('dropdown')
                                            .append(
                                                $('<a />', {href: '#'}).addClass('dropdown-toggle').attr('data-toggle','dropdown')
                                                .append(
                                                    $('<span />').addClass('Entity').addClass('Account').addClass(USER_CONTACTID)
                                                    .append( $('<span />', { text: USER_CONTACTNAME }).addClass('name') )
                                                    .append( $('<b />').addClass('caret').css('margin-left',10) )
                                                )
                                            )
                                            .append(
                                                $('<ul />').addClass('dropdown-menu')
                                                .append( $('<li />').append($('<a />', {href: '#get&Contact&'+USER_CONTACTID, text: 'Profile'}).prepend($('<b />').addClass('icon-user').css('margin-right',10))) )
                                                .append( $('<li />').addClass('divider') )
                                                .append(                                                    
                                                    $('<li />').append(
                                                        $('<a />', {href: '#', text: 'Logout'}).addClass('logoutBtn')
                                                        .click(function(e) {
                                                            e.preventDefault();
            
                                                            ajax.get({
                                                                se: 'User',
                                                                sf: 'logout'
                                                            },
                                                            function(response) {
                                                                location.reload();
                                                            })
                                                        })
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        );
        
        // Define footer
        this._footer =  $('<footer />').addClass('navbar-fixed-bottom').addClass('navbar').addClass('navbar-inverse')
                        .append( winMan.getHTML() );

        // Define content
        this._content = $('<div />').addClass('container-fluid');
        
        // Fill content
        switch ( MODULE ) {
                        
            case 'crm':
                require(['CrmModule'], function() {
                    $this._init( new CrmModule() );
                });
                break;
                
            default:
                require(['RegisterModule'], function() {
                    $this._module = new RegisterModule();
                    $this._content.append($this._module.getHTML());
                    
                    // Just append the module
                    $('body').append($this.getContent());
                });
                break;
        }
    }
    
    UI.prototype.getHeader = function() {
        return this._header;
    }
    
    UI.prototype.getFooter = function() {
        return this._footer;
    }
    
    UI.prototype.getModule = function() {
        return this._module;
    }
    
    UI.prototype.getContent = function() {
        return this._content;
    }
    
    UI.prototype._init = function(module) {
        var $this = this;

        this._module = module;
        this._content.append(this._module.getHTML());            

        $('body')
        .append(this.getHeader())
        .append(this.getContent())
        .append(this.getFooter());
        
        // DOC READY ---------------------------------------------------------------------------------------
        
        // Make sure pane height is maxed out
        $('.pane').height( $(window).height() - $('footer').height() - $('header').height() - parseInt($('header').css('margin-bottom')) - parseInt($('footer').css('margin-top')) - ( $(window).width() >= 980 ? parseInt($('body').css('padding-top')) - 20 : 0 ) );
        
        // Make sure the entity list menus are full width by adjusting the size of the input text
        $('.entity-list-menu input:text').each(function(index,elem) {
            $(elem).width( $('.entity-list-menu').parents('.pane').width() - $(elem).parent().width() + $(elem).width() - 1 );
        });
        
        // Max out pane height when window is resized - do the same for list menus
        $(window).smartresize(function() {
            $('.pane').height( $(window).height() - $('footer').height() - $('header').height() - parseInt($('header').css('margin-bottom')) - parseInt($('footer').css('margin-top')) - ( $(window).width() >= 980 ? parseInt($('body').css('padding-top')) - 20 : 0 ) );            
            $('.entity-list-menu input:text').each(function(index,elem) {
                $(elem).width( $('.entity-list-menu').parents('.pane').width() - $(elem).parent().width() + $(elem).width() - 1 );
            });
        });

        // What happens when a checkbox is changed
        $this.getContent().on('change','.Entity input:checkbox.checkbox',function(e) {
            // Entity is always first, then type, then id. ex: .Entity.Account.42
            var _this = $(this);            
            var classArray = _this.parents('.Entity').eq(0).attr('class').split(' ');
            classArray.shift(); // Remove Entity
            var entity = classArray.shift();
            var id     = classArray.shift();

            switch ( entity ) {

                case 'Account':
                    accounts.get(id,toggleChecked);
                    break;

                case 'Contact':
                    contacts.get(id,toggleChecked);
                    break;

                default:
                    $.error('Cannot process checkbox for '+entityId);
                    break;
            }

            function toggleChecked(entity) {
                // Toggled the entity checked
                entity.toggleChecked();

                // Find all elems that match and change the checkbox state to match
                $this.getContent().find('.Entity.'+entity.getType()+'.'+entity.getID()+' input:checkbox.checkbox').each(function(index,checkbox) {
                    if ( $(checkbox).prop('checked') !== _this.prop('checked') )
                        $(checkbox).prop('checked',_this.prop('checked'));
                });

                // Find all entities of this type and toggle their visibility
                $this.getContent().find('.Entity.'+entity.getType()+'.'+entity.getID()).toggle();

                // Make sure entity-card and entity-list elems stay visible
                $this.getContent().find('.entity-list .Entity.'+entity.getType()+'.'+entity.getID()+', .entity-card .Entity.'+entity.getType()+'.'+entity.getID()).show();
            }
        });
    }    
    
    define([
        'WinMan',
        'jquery',
        'bootstrap',
        'helper',
        'jquery.smartresize'        
    ], function (winMan) {
        return new UI(winMan);
    });
}(this));