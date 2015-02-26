var helper = {
    
    capitalize: function(str) {
        str = str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });
        return str;
    },
    
    capitalizeFirstLetter: function(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
};

Array.prototype.last = function() { return this[this.length-1] }