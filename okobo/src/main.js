// standard global variables
var Cube, Camera, container, Scene, Renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

// custom global variables
var collidableMeshList = [];
var arrowList = [];
var directionList = [];

var socket, sessionId;
var currentCube = {}, cubes = {};
var currentOko = {}, okos = {};
var init = false;

var okoMaterial, okoGeometry;
var terrainMaterial, terrainGeometry;
var rexMaterial, rexGeometry;

window.onunload =function(){
    socket.emit('quit');    
};

window.onbeforeunload =function(){
    socket.emit('quit');    
};

window.onload = function() {
var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load( "Client/Models/OkoSpider.js", initOkoModel );
    jsonLoader.load( "Client/Models/Field.js", initTerrainModel );
    jsonLoader.load( "Client/Models/Rex.js", initRexModel );

    initScene();
}

function initOkobo() {
//window.onload = function() {
    
    
    THREEx.FullScreen.request();
    
    animate();
    
    socket = io.connect(window.location.hostname);
    
    socket.on('start',function(rep) { 
        if(!init) {
            sessionId = this.socket.sessionid;
            init = true;
        }
        if(sessionId == rep.currentOko.id) {
            currentOko = rep.currentOko;
            okos = rep.okos; 
        } else {
            okos[rep.currentOko.id] = rep.currentOko;   
        }    
        initCubes();
        //refreshOkosPositions();
    });
    socket.on('update', function(rep) { 
        for(var i in rep.okos) {
            var _oko = rep.okos[i];
            if(_oko.id != sessionId && typeof cubes[_oko.id] != 'undefined') {
                var cube = cubes[_oko.id];
                if( _oko.coordinates.x != cube.getX() || 
                    _oko.coordinates.y != cube.getY() ||
                    _oko.coordinates.z != cube.getZ() ||
                    _oko.rotation.x != cube.getRotation().x ||
                    _oko.rotation.y != cube.getRotation().y ||
                    _oko.rotation.z != cube.getRotation().z
                ) {
                    cube.setPosition(_oko.coordinates.x, _oko.coordinates.y, _oko.coordinates.z);
                    cube.setRotation(_oko.rotation.x, _oko.rotation.y, _oko.rotation.z);
                    cube.update();
                }
            }
        }
    });
    socket.on('quit',function(rep) { 
        Scene.scene.remove(cubes[rep.quitId]);
        delete okos[rep.quitId];
        delete cubes[rep.quitId];
        clean();
    });

    socket.emit('start');
}

function initOkoModel(geometry, materials) {
    for (var i = 0; i < materials.length; i++){
        materials[i].morphTargets = true;        
    }
    okoGeometry = geometry;  
    okoMaterial = new THREE.MeshFaceMaterial( materials );
}

function initTerrainModel(geometry, materials) {
    for (var i = 0; i < materials.length; i++){
        materials[i].morphTargets = true;        
    }
    terrainGeometry = geometry;  
    terrainMaterial = new THREE.MeshFaceMaterial( materials );
    terrain = new THREE.Mesh( terrainGeometry, terrainMaterial );
    terrain.position.setY(329);
    
    terrain.scale.x = 20;
    terrain.scale.y = 20;
    terrain.scale.z = 20;
    Scene.add( terrain );

    initOkobo();
}

function initRexModel(geometry, materials) {
    for (var i = 0; i < materials.length; i++){
        materials[i].morphTargets = true;        
    }
    rexGeometry = geometry;  
    rexMaterial = new THREE.MeshFaceMaterial( materials );
    rex = new THREE.Mesh( rexGeometry, rexMaterial );
    rex.position.setY(0);
    
    rex.scale.x = 20;
    rex.scale.y = 20;
    rex.scale.z = 20;
    Scene.add( rex );
}


function initCubes() {
    for(id in okos) {
        var oko = okos[id];
        if(typeof cubes[oko.id] == 'undefined') {
            var color = 0xff0000;
            if(oko.id == sessionId) {
                color = 0x00ff00    
            }
            var cube;
            if(okoGeometry &&  okoMaterial){
                var cube = new Mesh(oko.id, color, 0, 0, 0, 50, 50, 50, true, 200, okoGeometry, okoMaterial);
            } else {
                var cube = new Mesh(oko.id, color, 0, 25.1, 0, 50, 50, 50, true, 200);
            }
            // var cube = new Mesh(oko.id, color, 0, 25.1, 0, 50, 50, 50, true);
            cubes[oko.id] = cube;
            cubes[oko.id].setPosition(oko.coordinates.x, oko.coordinates.y, oko.coordinates.z);
            cubes[oko.id].setRotation(oko.rotation.x, oko.rotation.y, oko.rotation.z);
            Scene.add(cubes[oko.id].mesh);
            if(oko.id == sessionId) {
                Camera.lookAt(cubes[oko.id].mesh.position);
            }
        } 
    }
}

function updateCubes() {
    for(id in cubes) {
        cubes[id].update();
    }
}

/*************************************************************/




// FUNCTIONS
function initScene()
{
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    
    // SCENE
    Scene = new Scene();
    
    // CAMERA
    Camera = new Camera(SCREEN_WIDTH, SCREEN_HEIGHT);
    Scene.addCamera(Camera);
    
    // RENDERER
    if (Detector.webgl)
        Renderer = new THREE.WebGLRenderer({antialias:true});
    else
        Renderer = new THREE.CanvasRenderer();
        
    Renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container = document.getElementById('ThreeJS');
    container.appendChild(Renderer.domElement);
    
    // EVENTS
    THREEx.WindowResize(Renderer, Camera.camera);
    THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
    
    // CONTROLS
    controls = new THREE.OrbitControls(Camera.camera, Renderer.domElement);
    
    ////////////
    // CUSTOM //
    ////////////
    // Mur 1
    /*
    var wall = new Mesh(0x8888ff, 100, 50, -100, 100, 100, 20);
    Scene.add(wall.mesh);
    collidableMeshList.push(wall.mesh);
    var wall = new Mesh(0x000000, 100, 50, -100, 100, 100, 20, true);
    Scene.add(wall.mesh);
    
    // Mur 2
    var wall2 = new Mesh(0x8888ff, -150, 50, 0, 100, 100, 20);
    wall2.rotateY(Math.PI / 2);
    Scene.add(wall2.mesh);
    collidableMeshList.push(wall2.mesh);
    var wall2 = new Mesh(0x000000, -150, 50, 0, 100, 100, 20, true);
    wall2.rotateY(Math.PI / 2);
    Scene.add(wall2.mesh);
    */
}

function animate() 
{
    requestAnimationFrame(animate);
    render();       
    update();
}

function update()
{
    controls.update();
    updateCubes();
    if(init) {
        Camera.followMesh(cubes[sessionId]);
    }
}

function render()
{
    
    // if ( bigSpider && walking ) // exists / is loaded 
    // {
    //     // Alternate morph targets
    //     time = new Date().getTime() % duration;
    //     keyframe = Math.floor( time / interpolation ) + animOffset;
    //     if ( keyframe != currentKeyframe ) 
    //     {
    //         bigSpider.morphTargetInfluences[ lastKeyframe ] = 0;
    //         bigSpider.morphTargetInfluences[ currentKeyframe ] = 1;
    //         bigSpider.morphTargetInfluences[ keyframe ] = 0;
    //         lastKeyframe = currentKeyframe;
    //         currentKeyframe = keyframe;
    //     }
    //     bigSpider.morphTargetInfluences[ keyframe ] = 
    //         ( time % interpolation ) / interpolation;
    //     bigSpider.morphTargetInfluences[ lastKeyframe ] = 
    //         1 - bigSpider.morphTargetInfluences[ keyframe ];
    // }
    Renderer.render(Scene.scene, Camera.camera);
}

function clean() {
    for(i in Scene.scene.children) {
        var c = Scene.scene.children[i];
        if(typeof c.name != 'undefined') {
            if(c.name == 'Oko' && typeof okos[c.id] == 'undefined') {
                Scene.scene.remove(c);
            }
        }
    }
}