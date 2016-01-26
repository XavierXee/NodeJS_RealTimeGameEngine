// Class Mesh
var n = 0;
var Mesh = Class.extend({
	// initialize : function(Id, Color, X, Y, Z, Width, Height, Depth, WireVisible, Speed) {
	initialize : function(Id, Color, X, Y, Z, Width, Height, Depth, WireVisible, Speed, Geometry, Material) {
		var self = this;
		this.id = Id;

		this.time;
		this.animOffset = 0;
		this.walking = false;
		this.duration = 1000;
		this.keyframes = 20;
		this.interpolation = this.duration / this.keyframes; 
		this.lastKeyframe = 0;    
		this.currentKeyframe = 0;

		this.color = typeof Color !== 'undefined' ? Color : 0x000000;
		this.x = typeof X !== 'undefined' ? X : 0;
		this.y = typeof Y !== 'undefined' ? Y : 25.1;
		this.z = typeof Z !== 'undefined' ? Z : 0;
		this.width = typeof Width !== 'undefined' ? Width : 50;
		this.height = typeof Height !== 'undefined' ? Height : 50;
		this.depth = typeof Depth !== 'undefined' ? Depth : 50;
		this.wireVisible = typeof WireVisible !== 'undefined' ? WireVisible : false;
		this.wireThickness = this.wireVisible === true ? 1 : 0;
        this.speed = typeof Speed !== 'undefined' ? Speed : 200; // la vitesse par défaut est de 200px/s
        if((typeof Geometry == 'undefined') && (typeof Material == 'undefined')){
			self.geometry = new THREE.CubeGeometry(self.width, self.height, self.depth, self.wireThickness, self.wireThickness, self.wireThickness);
			self.material = new THREE.MeshBasicMaterial({
				color: self.color,
				wireframe: self.wireVisible
			});
        } else { 
        	self.geometry = Geometry;
        	self.material = Material;
        }
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.id = this.id;
		this.mesh.name = "Oko";
        
		this.mesh.position.set(this.x, this.y, this.z);
	},
	setPosition : function(x, y ,z) {
		this.mesh.position.x = x;
		this.mesh.position.y = y;
		this.mesh.position.z = z;
		//this.update();
	},
	getPosition : function() {
		return this.mesh.position;
	},

	setRotation: function(x, y ,z) {
		this.mesh.rotation.x = x;
		this.mesh.rotation.y = y;
		this.mesh.rotation.z = z;
		//this.update();
	},
	getRotation : function() {
		return this.mesh.rotation;
	},
	
	getX : function() {
		return this.mesh.position.x;
	},
	
	getY : function() {
		return this.mesh.position.y;
	},
	
	getZ : function() {
		return this.mesh.position.z;
	},
	
	rotateX : function(angle) {
		this.mesh.rotation.x = angle;
	},
	
	rotateY : function(angle) {
		this.mesh.rotation.y = angle;
	},
	
	rotateZ : function(angle) {
		this.mesh.rotation.z = angle;
	},

	animate : function(){
		this.time = new Date().getTime() % this.duration;
		this.keyframe = Math.floor( this.time / this.interpolation ) + this.animOffset;
		if ( this.keyframe != this.currentKeyframe ) 
		{
			this.mesh.morphTargetInfluences[ this.lastKeyframe ] = 0;
			this.mesh.morphTargetInfluences[ this.currentKeyframe ] = 1;
			this.mesh.morphTargetInfluences[ this.keyframe ] = 0;
			this.lastKeyframe = this.currentKeyframe;
			this.currentKeyframe = this.keyframe;
		}
		this.mesh.morphTargetInfluences[ this.keyframe ] = 
			( this.time % this.interpolation ) / this.interpolation;
		this.mesh.morphTargetInfluences[ this.lastKeyframe ] = 
			1 - this.mesh.morphTargetInfluences[ this.keyframe ];
	},

    update : function() {
    	var self = this;
        var delta = clock.getDelta(); // seconds.
        var moveDistance = this.speed * delta; // pixels per second
        var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
		var send = false;
		this.walking = false;
        if (keyboard.pressed("left")) {
        	cubes[sessionId].mesh.rotateOnAxis(new THREE.Vector3(0,1,0), rotateAngle);
        	self.walking = true;
        	this.animate();
        	send = true;
        }
			
        if (keyboard.pressed("right")) {
			cubes[sessionId].mesh.rotateOnAxis(new THREE.Vector3(0,1,0), -rotateAngle);
        	self.walking = true;
        	this.animate();
			send = true;
		}

        if (keyboard.pressed("O")) {
			console.log(cubes[sessionId].x, cubes[sessionId].y, cubes[sessionId].z);
		}

        if (keyboard.pressed("Q")) {
	        cubes[sessionId].mesh.translateX(-moveDistance);
        	self.walking = true;
        	this.animate();
	        send = true;
        }
        if (keyboard.pressed("D")) {
	        cubes[sessionId].mesh.translateX(moveDistance);
        	self.walking = true;
        	this.animate();
	        send = true;
        }
        if (keyboard.pressed("Z")) {
	        cubes[sessionId].mesh.translateZ(-moveDistance);
        	self.walking = true;
        	this.animate();
	        send = true;
	    }
        if (keyboard.pressed("S")) {
	        cubes[sessionId].mesh.translateZ(moveDistance);
        	self.walking = true;
        	this.animate();
	        send = true;
	    }
		if (keyboard.pressed("A")) {
	        cubes[sessionId].mesh.translateY(-moveDistance);
	        console.log(cubes[sessionId].y);
        	self.walking = true;
        	this.animate();
	        send = true;
	    }
        if (keyboard.pressed("E")) {
	        cubes[sessionId].mesh.translateY(moveDistance);
	        console.log(cubes[sessionId].y);
        	self.walking = true;
        	this.animate();
	        send = true;
	    }

		// if ( this.walking )
		// {
		// 	self.time = new Date().getTime() % self.duration;
		// 	self.keyframe = Math.floor( self.time / self.interpolation ) + self.animOffset;
		// 	if ( self.keyframe != self.currentKeyframe ) 
		// 	{
		// 		self.mesh.morphTargetInfluences[ self.lastKeyframe ] = 0;
		// 		self.mesh.morphTargetInfluences[ self.currentKeyframe ] = 1;
		// 		self.mesh.morphTargetInfluences[ self.keyframe ] = 0;
		// 		self.lastKeyframe = self.currentKeyframe;
		// 		self.currentKeyframe = self.keyframe;
		// 	}
		// 	self.mesh.morphTargetInfluences[ self.keyframe ] = 
		// 		( self.time % self.interpolation ) / self.interpolation;
		// 	self.mesh.morphTargetInfluences[ self.lastKeyframe ] = 
		// 		1 - self.mesh.morphTargetInfluences[ self.keyframe ];
		// }

		if(send && n%3 == 0) {
			okos[sessionId].coordinates.x = cubes[sessionId].mesh.position.x;
			okos[sessionId].coordinates.y = cubes[sessionId].mesh.position.y;
			okos[sessionId].coordinates.z = cubes[sessionId].mesh.position.z;
			
			okos[sessionId].rotation.x = cubes[sessionId].mesh.rotation.x;
			okos[sessionId].rotation.y = cubes[sessionId].mesh.rotation.y;
			okos[sessionId].rotation.z = cubes[sessionId].mesh.rotation.z;

			socket.emit('update', okos[sessionId]);
		}
		n++;
		if(typeof cubes[sessionId] != 'undefined') {
	        // Gestion des collisions
	        var originPoint = cubes[sessionId].mesh.position.clone();
	        for (var vertexIndex = 0; vertexIndex < cubes[sessionId].mesh.geometry.vertices.length; vertexIndex++)
		    {		
			    var localVertex = cubes[sessionId].mesh.geometry.vertices[vertexIndex].clone();
			    var globalVertex = localVertex.applyMatrix4(cubes[sessionId].mesh.matrix);
			    var directionVector = globalVertex.sub(cubes[sessionId].mesh.position);
			
			    var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
			    var collisionResults = ray.intersectObjects(collidableMeshList);

			    if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) 
			    {
				    // Une collision a eu lieu
	                // On pourait faire un return d'une valeur pour bloquer le mouvement
	                // en utilisant le directionVector pour spécifier la direction à bloquer
	                cubes[sessionId].mesh.material.color = 'ff0000';
			    } else
			    {	
				    // Pas de collision donc soit on dégage ce bloc, soit on y fait quelque chose
				    //cubes[sessionId].mesh.material.color = 0xFF0000;
			    }
		    }
	    }
    }
});