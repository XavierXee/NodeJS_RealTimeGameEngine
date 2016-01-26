var Class = loader.load('Core/Class');

/**
 * @class SocketManager
 *
 * Used to manage a socket.io object
 * 
 * @extends Class
 */
var SocketManager = Class.extend({

    /**
     * The socket.io object
     *
     * @property io 
     * @type Object
     * @default null
     */
    io: null,
    
    /**
     * The server object provided by express framework
     *
     * @property server 
     * @type Object
     * @default null
     */
    server: null,

    /**
     * Events to bind in the socket object after connection
     *
        {
            'start' : function() {
                this; // <- refer to socket object
                this.manager; // <- refer to SocketManager Object    
            } 
        }
     * @property socketEvents 
     * @type Object
     * @default {}
     */ 
    socketEvents: {},

    /**
     * @constructor
     * @class SocketManager
     * @method initialize
     * @param {Object} server The server object provided by express framework
     * @param {Object} socketEvents Containes socket events definition
     */
    initialize: function(server, socketEvents) {
        var self = this;
        self.set('server', server);
        self.set('socketEvents', socketEvents);
    },

    /**
     * Start and initialize socket.io object in the "io" property
     *
     * @method start
     */
    start: function() {
        var self = this;    
        self.set('io', require('socket.io').listen(self.get('server'), { log: false }));
    },

    /**
     * Getters and setters events
     * 
        {
            //This event definition permite to bind socket events after connection
            'afterSet-io': function(socketManager) {
                socketManager.get('io').on('connection', function(socket) {
                    for(var eventName in socketManager.get('socketEvents')) {
                        var eventFunct = socketManager.get('socketEvents')[eventName];
                        socket.manager = socketManager;
                        socket.on(eventName, eventFunct);        
                    }
                });    
            }
        }
     *
     * @property events 
     * @type Object
     */
    events : {
        /**
         * This event definition permite to bind socket events after connection
         */  
        'afterSet-io': function(socketManager) {
            console.log('************************************')
            console.log(socketManager.get('io'))
            console.log('************************************')
            socketManager.get('io').configure(function () {
              socketManager.get('io').set("transports", ["xhr-polling"]);
              socketManager.get('io').set("polling duration", 10);
            });

            socketManager.get('io').on('connection', function(socket) {
                for(var eventName in socketManager.get('socketEvents')) {
                    var eventFunct = socketManager.get('socketEvents')[eventName];
                    socket.manager = socketManager;
                    socket.on(eventName, eventFunct);        
                }
            });    
        }
    }
});
    
module.exports = SocketManager;