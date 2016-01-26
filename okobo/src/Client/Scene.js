// Class Scene
var Scene = Class.extend({
	initialize : function() {
		this.scene = new THREE.Scene();
		this.scene.fog = new THREE.Fog( 0xffffff, 1, 5000 );
		this.scene.fog.color.setHSL( 0.6, 0, 1 );
		
		// Ajout de lumière à la scène
     //    var light = new THREE.PointLight(0xffffff);
     //    console.log(light);
	    // light.position.set(1000,2500000000,200000);
	    // light.intensity = 1;
	    // this.scene.add(light);

        // Ajout du sol à la scène
     //    var floorMaterial = new THREE.MeshBasicMaterial({color:0x444444, side:THREE.DoubleSide});
	    // var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
	    // var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	    // floor.position.y = -0.5;
	    // floor.rotation.x = Math.PI / 2;
	    // this.scene.add(floor);

        // Ajout du ciel à la scène
     //    var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
	    // var skyBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x9999ff, side: THREE.BackSide });
	    // var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
	    // this.scene.add(skyBox);



		// LIGHTS

		hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
		hemiLight.color.setHSL( 0.6, 1, 0.6 );
		hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
		hemiLight.position.set( 0, 500, 0 );
		this.scene.add( hemiLight );

		//

		dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
		dirLight.color.setHSL( 0.1, 1, 0.95 );
		dirLight.position.set( -1, 1.75, 1 );
		dirLight.position.multiplyScalar( 50 );
		this.scene.add( dirLight );

		dirLight.castShadow = true;

		dirLight.shadowMapWidth = 2048;
		dirLight.shadowMapHeight = 2048;

		var d = 50;

		dirLight.shadowCameraLeft = -d;
		dirLight.shadowCameraRight = d;
		dirLight.shadowCameraTop = d;
		dirLight.shadowCameraBottom = -d;

		dirLight.shadowCameraFar = 3500;
		dirLight.shadowBias = -0.0001;
		dirLight.shadowDarkness = 0.35;
		//dirLight.shadowCameraVisible = true;

		// GROUND

		// var groundGeo = new THREE.PlaneGeometry( 10000, 10000 );
		// var groundMat = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0xffffff, specular: 0x050505 } );
		// groundMat.color.setHSL( 0.095, 1, 0.75 );

		// var ground = new THREE.Mesh( groundGeo, groundMat );
		// ground.rotation.x = -Math.PI/2;
		// ground.position.y = -33;
		// this.scene.add( ground );

		// ground.receiveShadow = true;

		// SKYDOME

		// var vertexShader = document.getElementById( 'vertexShader' ).textContent;
		// var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;

		var vertexShader = 'varying vec3 vWorldPosition;void main() {vec4 worldPosition = modelMatrix * vec4( position, 1.0 );vWorldPosition = worldPosition.xyz;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}';
		var fragmentShader = 'uniform vec3 topColor;uniform vec3 bottomColor;uniform float offset;uniform float exponent;varying vec3 vWorldPosition;void main() {float h = normalize( vWorldPosition + offset ).y;gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( h, exponent ), 0.0 ) ), 1.0 );}';

		var uniforms = {
			topColor: 	 { type: "c", value: new THREE.Color( 0x0077ff ) },
			bottomColor: { type: "c", value: new THREE.Color( 0xffffff ) },
			offset:		 { type: "f", value: 33 },
			exponent:	 { type: "f", value: 0.6 }
		}
		uniforms.topColor.value.copy( hemiLight.color );

		this.scene.fog.color.copy( uniforms.bottomColor.value );

		var skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
		var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );

		var sky = new THREE.Mesh( skyGeo, skyMat );
		this.scene.add( sky );

	},
	
	addCamera : function(Camera) {
		this.scene.add(Camera.camera);
	},
	
	add : function(toAdd) {
		this.scene.add(toAdd);
	},
	
	getPosition : function() {
		return this.scene.position;
	}
});