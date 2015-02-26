$.fn.replaceWithPush = function(a) {
    var $a = $(a);

    this.replaceWith($a);
    return $a;
};