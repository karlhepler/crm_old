define(['Register','Login','Module'], function(register,login) {
    
    RegisterModule = function() {
        
        var options = [
            { pane: register },
            { pane: login }
        ];

        Module.apply(this,options);        
    }
    RegisterModule.prototype = new Module();
    RegisterModule.prototype.constructor = RegisterModule;
    
});