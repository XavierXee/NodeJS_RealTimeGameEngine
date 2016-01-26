// REQUIRES
var express = require('express');

// PORT
var port = process.env.PORT || 3000;

// LAUNCH THE APP
var app    = express() ;
    server = app.listen(port, function() {
        console.log('Listening on port %d', server.address().port);  
    });

    console.log("---------------------------")
    console.log(server)
    console.log("---------------------------")

// APP CONFIGURATION
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/src'));

// LOADER
var LoaderClass = require(__dirname + '/src/Core/Loader.js');
var loader = new LoaderClass(__dirname);
global.loader = loader;

// OKO MANAGER
var OkoManagerClass = loader.load('Server/OkoManager');
var okoManager = new OkoManagerClass(server);

var timer = setInterval(function(){
    okoManager.update();
}, 15);
    
// ROUTES
app.get('/', function(req, res){
    res.render('index', {
    	scripts: [
    		'Vendor/Three/Three.js',
    		'Vendor/Three/Detector.js',
    		'Vendor/Three/Stats.js',
    		'Vendor/Three/OrbitControls.js',
    		'Vendor/Three/THREEx.KeyboardState.js',
    		'Vendor/Three/THREEx.FullScreen.js',
    		'Vendor/Three/THREEx.WindowResize.js',
    		'Core/Class.js',
    		'Client/Camera.js',
    		'Client/Mesh.js',
    		'Client/Scene.js'
    	]
  	});
});

module.exports = app;