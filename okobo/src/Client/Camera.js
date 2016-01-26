// Class Camera
var Camera = Class.extend({
	initialize : function(width, height, angle) {
		this.view_angle = typeof angle !== 'undefined' ? angle : 45;
		this.width = width;
		this.height = height
		this.aspect = this.width / this.height;
		this.near = 0.1;
		this.far = 20000;
		
		this.camera = new THREE.PerspectiveCamera(this.view_angle, this.aspect, this.near, this.far);
	},
	
	setPosition : function(x,y,z) {
		this.camera.position.set(x,y,z);
	},
	
	lookAt : function(position) {
		this.camera.lookAt(position);
	},
	
	followMesh : function(Mesh) {
		var relativeCameraOffset = new THREE.Vector3(0,100,400);
		// if((typeof Mesh != 'undefined') && (typeof Mesh.mesh != 'undefined')){
			var cameraOffset = relativeCameraOffset.applyMatrix4(Mesh.mesh.matrixWorld);
			this.camera.position.x = cameraOffset.x;
			this.camera.position.y = cameraOffset.y;
			this.camera.position.z = cameraOffset.z;
			this.camera.lookAt(Mesh.getPosition());
		// }
	}
});