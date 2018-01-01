var THREE = require('three');
var dat = require('./vendor/dat.gui.js');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );

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
//var loader = new THREE.JSONLoader();
// loader.load( 'assets/test.json', function(geom){
// 	cube = new THREE.Mesh( geom, shaderMaterial );
// 	scene.add( cube );
// 	animate();
// });

var geom = new THREE.PlaneGeometry(1,1);
cube = new THREE.Mesh( geom, shaderMaterial );
scene.add( cube );

camera.position.z = 0.8;

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

function updateColorUniform() {
	colorUniforms.topLeft.value = colorVector3(colors.topLeft);
	colorUniforms.topRight.value = colorVector3(colors.topRight);
	colorUniforms.bottomLeft.value = colorVector3(colors.bottomLeft);
	colorUniforms.bottomRight.value = colorVector3(colors.bottomRight);
}

function changeHue(color, value) {
	let c = colors.topLeft.getHSL();
	colors.topLeft.setHSL(value, params.Saturation, params.Lightness);
}

function changeSat(color, value) {
	let c = colors.topLeft.getHSL();
	colors.topLeft.setHSL(params.Hue, value, params.Lightness);
}

function changeValue(color, value) {
	let c = colors.topLeft.getHSL();
	colors.topLeft.setHSL(params.Hue, params.Saturation, value);
}


var colors = {
	topLeft: "#4ae8e8",
	topRight: "#7f17f5",
	bottomLeft: "#b2f219",
	bottomRight: "#e83131"
};

updateColorUniform();

var params = {
	segments: 7,
	linearColor: true
}

var gui = new dat.GUI({autoPlace: false});
window.gui = gui;
var folder = gui.addFolder( 'Colors' );
folder.addColor( colors, 'topLeft').onChange(updateColorUniform);
folder.addColor( colors, 'topRight').onChange(updateColorUniform);
folder.addColor( colors, 'bottomLeft').onChange(updateColorUniform);
folder.addColor( colors, 'bottomRight').onChange(updateColorUniform);
folder.open();
var folder = gui.addFolder( 'Parameters' );
folder.add(params, 'segments' , 3, 9).step(1).onChange(function (value) {
	shaderMaterial.uniforms.segments.value = value;
})
folder.add(params, 'linearColor').onChange(function (value) {
	colorUniforms.USE_LINEAR.value = value;
})
folder.open();

document.getElementById('datGui').appendChild(gui.domElement);

// window.onload = function() {
//
// };
