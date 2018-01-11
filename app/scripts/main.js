var THREE = require('three');
var ColorPicker = require('simple-color-picker');
var shaders = require('./shaders.js');

var copyElement = document.createElement("textarea");
copyElement.id = "hex-code";
copyElement.setAttribute("readonly", true);
document.body.appendChild(copyElement);

//HELPERS
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function CreatePicker(element, color, vector) {
	let p = new ColorPicker({
	  color: color,
	  el: element,
	  width: 200,
	  height: 200
	});

	let h = document.createElement("textarea");
	h.setAttribute("readonly", true);
	element.appendChild(h);

	p.onChange(function (v) {
		h.innerHTML = v;
		updateColorUniform(vector.value, v);
	})
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16)/255,
        g: parseInt(result[2], 16)/255,
        b: parseInt(result[3], 16)/255
    } : null;
}

var rgbComponentToHex = function (rgb) {
  var hex = Number(rgb).toString(16);
  if (hex.length < 2) {
       hex = "0" + hex;
  }
  return hex;
};

var rgbToHex = function(r,g,b) {
  var red = rgbComponentToHex(r);
  var green = rgbComponentToHex(g);
  var blue = rgbComponentToHex(b);
  return red+green+blue;
};

//THREE.JS
var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({alpha: true, preserveDrawingBuffer: true});
renderer.setSize( 400,400 );
renderer.setClearColor( 0xffffff, 0 );
document.getElementById("matrix").appendChild( renderer.domElement );

var colorUniforms = {
	resolution: { value: new THREE.Vector2() },

	segments: { value: 6 },
	USE_LINEAR: { value: true },

	topLeft: {value: new THREE.Vector3(0,0,0) },
	topRight: {value: new THREE.Vector3(0,0,0) },
	bottomLeft: {value: new THREE.Vector3(0,0,0) },
	bottomRight: {value: new THREE.Vector3(0,0,0) }
}

var shaderMaterial = new THREE.ShaderMaterial( {

	uniforms: colorUniforms,
	vertexShader: shaders.vertexShader,
	fragmentShader: shaders.fragmentShader

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

function updateColorUniform(colorVector, hex) {
	let c = hexToRgb(hex);
	colorVector.x = c.r;
	colorVector.y = c.g;
	colorVector.z = c.b;
}

CreatePicker(
	document.getElementById('picker-topLeft'),
	"#dd8f25",
	colorUniforms.topLeft);

CreatePicker(
	document.getElementById('picker-bottomLeft'),
	"#0c9c9c",
	colorUniforms.bottomLeft);

CreatePicker(
	document.getElementById('picker-topRight'),
	"#c35598",
	colorUniforms.topRight);

CreatePicker(
	document.getElementById('picker-bottomRight'),
	"#26042d",
	colorUniforms.bottomRight);

document.getElementById('segment-slider').oninput = (function () {
	colorUniforms.segments.value = this.value;
});

document.getElementById('linear-color').onchange = (function () {
	colorUniforms.USE_LINEAR.value = this.checked;
	console.log(this.checked);
});

//MOUSE EVENTS
renderer.domElement.addEventListener("mousedown", copyHexCode, false);

function copyHexCode(e){
	let gl = renderer.getContext();
	let p = new Uint8Array(4);
	let pos = getMousePos(renderer.domElement, e)
	gl.readPixels(pos.x, renderer.getSize().height - pos.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, p);

	copyElement.innerHTML = rgbToHex(p[0],p[1],p[2]); // the hex code
	copyElement.select();

	try {
	    var successful = document.execCommand('copy');
	} catch (err) {
		console.log('Unable to copy value');
	}
}
