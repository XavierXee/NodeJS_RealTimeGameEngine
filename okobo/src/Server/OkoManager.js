var Class            = loader.load('Core/Class'),
    SocketManagerCls = loader.load('Core/SocketManager'),
    OkoCls           = loader.load('Server/Oko');

/**
 * Object responsible for managing the Okos connected to the application and emit events to the clients
 *
 * @class OkoManager
 * @extends Class
 */
var OkoManager = Class.extend({
    
    /**
     * The SocketManager
     *
     * Used to manage socket events
     *
     * @property socketManager 
     * @type SocketManager
     * @default null
     */
    socketManager: null,

    /**
     * The okos array
     *
     * Contains the okos connected to the application
     *
     * @property okos 
     * @type Object
     * @default {}
     */
    okos: {},

    /**
     * @constructor
     * @class OkoManager
     * @method initialize
     * @param {Object} server The server object provided by express framework
     */
    initialize: function(server) {
        var self = this;
        self.initSocketManager(server);
    },

    /**
     * Initialize the socketManager and define socket listen events
     * 
     * The listen events are :
     * - start : emitted by the client when access the app, construct a new Oko and emit "start" event  
     * - update : emitted by the client when his Oko is updated, will update the Oko in the okos array and emit "update" event
     * - quit : emitted by the client when quit the app, delete the Oko from the okos array and emit "quit" event
     *
     * @method initSocketManager
     * @param {Object} server The server object provided by express framework
     */
    initSocketManager: function(server) {
        var self = this;
        var socketManager = new SocketManagerCls(server, {
            'start': function() {
                console.log(this.id+" connected");
                var oko = new OkoCls(this.id);
                self.add(oko);
                self.emit('start', this, {oko: oko});
            },
            'update': function(okoJson) {
                var oko = new OkoCls(this.id);
                oko.synchronize(okoJson);
                self.add(oko);
                //self.emit('update', this, {oko: oko});            
            },
            'quit': function() {
                var oko = self.getOkoById(this.id);
                if(typeof oko != 'undefined') {
                    self.destroy(oko);
                    self.emit('quit', this, {id: oko.get('id')});
                }
            }
        });
        self.set('socketManager', socketManager);
    },
    
    update: function() {
        this.socketManager.get('io').sockets.emit('update', {okos: this.okos});
    },

    /**
     * Emit a socket event
     * 
     * The emits events are :
     * - start : params = { oko: "An Oko object" } - Send the okos array and the Oko object in params 
     * - update : params = { oko: "An Oko object" } - Send the Oko object in params 
     * - quit : params = { id: "An Oko id" } - Send the id of the Oko who have left the app
     *
     * @method emit
     * @param {String} key The name of the event to emit
     * @param {Object} socket The socket object provided by the socketManager
     * @param {Object} params The params used to get the data to send
     */
    emit: function(key, socket, params) {
        var self = this;
        var emitter = socket.manager.io.sockets;
        var _params = {};
        switch(key) {
            case 'start' : {
                _params = {okos: self.okos, currentOko: params.oko};
            } break;
            case 'update' : {
                _params = {okos: getOkosNoCurrent(params.oko)};
            } break;
            case 'quit' : {
                _params = {quitId: params.id};
            } break;   
        }

        emitter.emit(key, _params);
    },

    /**
     * Add a Oko in the okos array 
     *
     * Insert the Oko at the key corresponding to its id
     *
     * @method add
     * @param {Oko} oko The Oko to add
     */
    add: function(oko) {
        var self = this;
        self.get('okos')[oko.get('id')] = oko;
    },

    /**
     * Delete a Oko in the okos array 
     *
     * Will remplace the okos array by the return of the function {{#crossLink "OkoManager/getOkosNoCurrent:method"}}getOkosNoCurrent{{/crossLink}}
     *
     * @method destroy
     * @param {Oko} oko The Oko to destroy
     */
    destroy: function(oko) {
        var self = this;
        self.set('okos', self.getOkosNoCurrent(oko));    
    },

    /**
     * Returns an Oko by its id
     *
     * @method getOkoById
     * @param {String} id The id of the Oko
     * @return {Oko} The Oko
     */
    getOkoById: function(id) {
        var self = this; 
        return self.get('okos')[id];
    },

    /**
     * Returns an array of okos without the Oko specified in parameter
     *
     * The test is made with its id
     *
     * @method getOkosNoCurrent
     * @param {Oko} oko The Oko to remove
     * @return {Array} Okos array
     */
    getOkosNoCurrent : function(oko) {
        var self = this;
        var okosNoCurrent = {};
        for(var id in self.get('okos')) {
            if(id != oko.get('id')) {
                okosNoCurrent[id] = self.get('okos')[id];
            }
        }
        return okosNoCurrent;
    },

    /**
     * Getters and setters events
     * 
       { 
           // Starts the socketManager
           'afterSet-socketManager' : function(okoManager) {
               okoManager.get('socketManager').start();        
           }
       }
     *
     * @property events 
     * @type Object
     */
    events: {
        // Starts the socketManager
        'afterSet-socketManager' : function(okoManager) {
            okoManager.get('socketManager').start();        
        }
    }
});
    
module.exports = OkoManager;