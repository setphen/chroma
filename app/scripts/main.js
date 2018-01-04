var THREE = require('three');
var dat = require('./vendor/dat.gui.js');
var ColorPicker = require('simple-color-picker');

var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize( 400,400 );
renderer.setClearColor( 0xffffff, 0 );
document.getElementById("colorContainer").appendChild( renderer.domElement );

var colorUniforms = {
	resolution: { value: new THREE.Vector2() },

	segments: { value: 12 },
	USE_LINEAR: { value: true },

	topLeft: {value: new THREE.Vector3(0,0,0) },
	topRight: {value: new THREE.Vector3(0,0,0) },
	bottomLeft: {value: new THREE.Vector3(0,0,0) },
	bottomRight: {value: new THREE.Vector3(0,0,0) }
}

var shaderMaterial = new THREE.ShaderMaterial( {

	uniforms: colorUniforms,
	vertexShader: document.getElementById( 'vertexProgram' ).textContent,
	fragmentShader: document.getElementById( 'fragmentProgram' ).textContent

} );

var cube;

var geom = new THREE.PlaneGeometry(2,2);
cube = new THREE.Mesh( geom, shaderMaterial );
scene.add( cube );

camera.position.z = 1;

renderer.render( scene, camera );

animate();

function animate() {
	requestAnimationFrame( animate );

	renderer.render( scene, camera );
}

function colorVector3(color) {
	let c = new THREE.Color(color);
	return new THREE.Vector3(c.r, c.g, c.b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16)/256,
        g: parseInt(result[2], 16)/256,
        b: parseInt(result[3], 16)/256
    } : null;
}

function updateColorUniform(colorVector, hex) {
	let c = hexToRgb(hex);
	colorVector.x = c.r;
	colorVector.y = c.g;
	colorVector.z = c.b;
}

function CreatePicker(element, color, vector) {
	let p = new ColorPicker({
	  color: color,
	  background: '#b6b6b6',
	  el: element,
	  width: 200,
	  height: 200
	});
	p.onChange(function (v) {
		updateColorUniform(vector.value, v);
	})
}

CreatePicker(
	document.getElementById('picker-topLeft'),
	"#4ae8e8",
	colorUniforms.topLeft);

CreatePicker(
	document.getElementById('picker-bottomLeft'),
	"#4ae8e8",
	colorUniforms.bottomLeft);

CreatePicker(
	document.getElementById('picker-topRight'),
	"#4ae8e8",
	colorUniforms.topRight);

CreatePicker(
	document.getElementById('picker-bottomRight'),
	"#4ae8e8",
	colorUniforms.bottomRight);

document.getElementById('segment-slider').oninput = (function () {
	colorUniforms.segments.value = this.value;
});

document.getElementById('linear-color').oninput = (function () {
	colorUniforms.USE_LINEAR.value = this.checked;
});

// 	},
// 	{
// 		element:document.getElementById('picker-bottomLeft'),
// 		vector:colorUniforms.bottomLeft
// 	},
// 	{
// 		element:document.getElementById('picker-topRight'),
// 		vector:colorUniforms.topRight
// 	},
// 	{
// 		element:document.getElementById('picker-bottomRight'),
// 		vector:colorUniforms.bottomRight
// 	}
// ];



// var params = {
// 	segments: 7,
// 	linearColor: true
// }
//
// window.onload = function() {
//
// };
