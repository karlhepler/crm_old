$.fn.styleAttributeToObject = function () {
    var style = $(this).attr('style'),
        asObject = {};
    if ('string' === typeof style) {
        $.each(style.split(';'), function (i, e) {
            var pair = e.split(':');
            if (2 === pair.length) {
                asObject[pair[0]] = pair[1];
            }
        });
    }
    return asObject;
};