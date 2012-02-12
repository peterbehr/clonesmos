/*
 *Generically creates an accessor function.
 *If the function is called without value it returns the original value.
 *Called with a value it sets the value and returns the object acted upon.
 *Good for chaining.
 */
var accessor = function(name) { 
    return function(value) {
        if (typeof(value) === 'undefined') {
            return this[name];
        } else {
            this[name] = value;
            return this;
        }
    };
};

