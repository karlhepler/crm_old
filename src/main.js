requirejs.config({
    baseUrl: '/crm/src/',
    paths: {
        'jquery':                           'jquery-1.9.1.min',
        'jquery-ui':                        'jquery-ui-1.10.1.custom/js/jquery-ui-1.10.1.custom.min',
        'bootstrap':                        'bootstrap/js/bootstrap.min',
        'AjaxBuffer':                       'loaders/AjaxBuffer',
        'helper':                           'helpers/helper',
        'bootstrap-editable':               'UI/bootstrap-editable/bootstrap-editable',
        'jquery.smartresize':               'UI/jquery.smartresize',
        'alertify':                         'UI/alertify.js-shim-0.3.8/alertify',
        'WinMan':                           'UI/WinMan/WinMan',
        'Win':                              'UI/WinMan/Win',
        'AccountWin':                       'UI/WinMan/AccountWin',
        'ContactWin':                       'UI/WinMan/ContactWin',
        'html2canvas':                      'UI/WinMan/src/html2canvas',
        'jquery.formulate':                 'UI/jquery.formulate/jquery.formulate',
        'jquery.cloneBox':                  'UI/jquery.formulate/src/jquery.cloneBox',
        'jquery.phonemask':                 'UI/jquery.formulate/src/jquery.phonemask',
        'jquery.replaceWithPush':           'UI/jquery.formulate/src/jquery.replaceWithPush',
        'jquery.select2':                   'UI/jquery.formulate/src/select2-release-3.2/select2.min',
        'jquery.serializeObject':           'UI/jquery.formulate/src/jquery.serializeObject',
        'jquery.styleAttributeToObject':    'UI/jquery.formulate/src/jquery.styleAttributeToObject',
        'jquery.transformer':               'UI/jquery.formulate/src/jquery.transformer',
        'jquery.udfSelect':                 'UI/jquery.formulate/src/jquery.udfSelect',
        'jquery.validate':                  'UI/jquery.formulate/src/jquery.validate',
        'EntityCache':                      'EntityClasses/js/EntityCache',
        'ContactCache':                     'EntityClasses/js/ContactCache',
        'AccountCache':                     'EntityClasses/js/AccountCache',
        'UdfCache':                         'EntityClasses/js/UdfCache',
        'TagCache':                         'EntityClasses/js/TagCache',
        'LogCache':                         'EntityClasses/js/LogCache',
        'UserCache':                        'EntityClasses/js/UserCache',
        'Entity':                           'EntityClasses/js/Entity',
        'Contact':                          'EntityClasses/js/Contact',
        'Account':                          'EntityClasses/js/Account',
        'Udf':                              'EntityClasses/js/Udf',
        'Tag':                              'EntityClasses/js/Tag',
        'Log':                              'EntityClasses/js/Log',
        'User':                             'EntityClasses/js/User',
        'UI':                               'UI/UI',
        'Module':                           'UI/Modules/Module',
        'CrmModule':                        'UI/Modules/CrmModule',
        'RegisterModule':                   'UI/Modules/RegisterModule',
        'Pane':                             'UI/Modules/Panes/Pane',
        'Timeline':                         'UI/Modules/Panes/Timeline',
        'TaskView':                         'UI/Modules/Panes/TaskView',
        'EntityList':                       'UI/Modules/Panes/EntityList',
        'Login':                            'UI/Modules/Panes/Login',
        'Register':                         'UI/Modules/Panes/Register'
    },
    shim: {
        'bootstrap':                        ['jquery'],
        'jquery-ui':                        ['jquery'],
        'jquery.validate':                  ['jquery'],
        'jquery.phonemask':                 ['jquery'],
        'jquery.replaceWithPush':           ['jquery'],
        'jquery.select2':                   ['jquery'],
        'jquery.serializeObject':           ['jquery'],
        'jquery.styleAttributeToObject':    ['jquery'],
        'jquery.smartresize':               ['jquery'],
        'bootstrap-editable':               ['bootstrap']
    }
});
require(['UI'], function(ui) {
    
    $(function() {
        
    });    
        
});