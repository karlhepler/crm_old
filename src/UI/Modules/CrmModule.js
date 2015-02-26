define(['EntityList','Timeline','TaskView','Module'],
    function(entityList,timeLine,taskView) {

        CrmModule = function() {

            var options = [
                {
                    pane:   entityList
                },
                {
                    isHider:    true,
                    pane:       timeLine
                },
                {
                    isHider:    true,
                    pane:       taskView
                }
            ];

            Module.apply(this,options);            
        }
        CrmModule.prototype = new Module();
        CrmModule.prototype.constructor = CrmModule;
});