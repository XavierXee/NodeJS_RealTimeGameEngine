var Class = loader.load('Core/Class');

/**
 * @class Oko
 *
 * Represents an Oko
 * 
 * @extends Class
 */
var Oko = Class.extend({
    
    /**
     * Oko's id
     *
     * @property id 
     * @type String
     * @default null
     */
    id : null,

    /**
     * Oko's coordinates
     *
     * Default :
        {
            x: 0,
            y: 0,
            z: 0
        }
     * @property coordinates 
     * @type Object
     * @default {}
     */
    coordinates : {},

    /**
     * Oko's rotation
     *
     * Default :
        {
            x: 0,
            y: 0,
            z: 0
        }
     * @property rotation 
     * @type Object
     * @default {}
     */
    rotation : {},

    /**
     * @constructor
     * @class Oko
     * @method initialize
     * @param {String} id Oko's id
     */
    initialize: function(id) {
        var self = this;

        self.coordinates =  {
            x: 50,
            y: 50,
            z: 50
        };

        self.rotation =  {
            x: 0,
            y: 0,
            z: 0
        };

        self.set('id', id);
    },

    /**
     * Assign properties from json object
     *
     * @method synchronize
     * @param {Object} json Json data object
     */
    synchronize: function(json) {
        var self = this;
        self.set('id', json.id);
        self.set('coordinates', json.coordinates);
        self.set('rotation', json.rotation);
    },

    /**
     * Getters and setters events
     * 
       { 

       }
     *
     * @property events 
     * @type Object
     */
    events: {}
});

module.exports = Oko;