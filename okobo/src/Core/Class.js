/**
 * @class Class
 *
 * Generic class, implements extension method, getters/setters and events
 */
var Class = function() {
    this.initialize && this.initialize.apply(this, arguments);
};

/**
 * Contains generic class events
 *
 * Base events are as follows :
 *    - "get-" + propertyName : called before the value is returned
 *    - "beforeSet-" + propertyName : called before the value is assigned
 *    - "afterSet-" + propertyName : called after the value is assigned
 * Each event function takes the current object.
 *
    
    name : 'MyName'
    events : {
        'get-name' : function() {
            console.log('Property MyName is got');        
        }   
    }
    
 * @static
 * @property events 
 * @type Object
 */
Class.events = new Object();

/**
 * Implementation of the extension method
 *
 * @static
 * @method extend
 * @param {Object} childPrototype Child class prototype
 */
Class.extend = function(childPrototype) { 
    var parent = this;
    var child = function() { 
        return parent.apply(this, arguments);
    };
    
    // Class functions
    child.extend = parent.extend;
    child.events = parent.events;

    var Surrogate = function() {};
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;
    for(var key in childPrototype){
        child.prototype[key] = childPrototype[key];
    }

    // Object functions
    child.prototype.get = parent.get; 
    child.prototype.set = parent.set; 
    child.prototype.trigger = parent.trigger;

    return child;
};

/**
 * Generic getter
 *
 * Call "get" event. Throw an error if the property doesn't exist.
 *
 * @method get
 * @param {String} propertyName Property name to get
 * @return Property value
 */
Class.get = function(propertyName) {
    if(typeof this[propertyName] === 'undefined') {
        throw new Error('Property : ' + propertyName + ' is undefined');
    } else {
        this.trigger('get-'+propertyName);
        return this[propertyName];
    }
}

/**
 * Generic setter
 *
 * Set the value of "propertyName" with "propertyValue" and return the object.
 * Call "beforeSet" and "afterSet" events. Throw an error if the property doesn't exist.
 *
 * @method set
 * @param {String} propertyName Property name to set
 * @param propertyValue Value to assign
 * @return {Object} Current object
 */
Class.set = function(propertyName, propertyValue) {
    if(typeof this[propertyName] === 'undefined') {
        throw new Error('Property : ' + propertyName + ' is undefined');
    } else {
        this.trigger('beforeSet-'+propertyName);
        
        this[propertyName] = propertyValue;
        
        this.trigger('afterSet-'+propertyName);
        return this;
    }
}

/**
 * Execute an event by his key
 *
 * @method trigger
 * @param {String} eventName Event to trigger
 */
Class.trigger = function(eventName) {
    if(typeof this.events == 'object') {
        if(typeof this.events[eventName] == 'function') {
            this.events[eventName](this);
        }
    }
}

if(typeof module != 'undefined') {
    module.exports = Class;
}