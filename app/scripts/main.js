//npm modules
var ColorPicker = require('simple-color-picker');

//local modules
var glutils = require('./glutils.js');
var colorutils = require('./colorutils.js');

//Element target for copying hex to clipboard
var copyElement = document.createElement("textarea");
copyElement.id = "hex-code";
copyElement.setAttribute("readonly", true);
document.body.appendChild(copyElement);
var copyMsg = false;

//Element displaying hex codes on rollover
var hexElement = document.createElement("div");
hexElement.id = "hoverhex";
document.getElementById("colorContainer").appendChild(hexElement);

function isValidColorInput(i) {
    return (i.startsWith("#") && i.length == 7)
        || (!i.startsWith("#") && i.length == 6);
}

function CreatePicker(element, color, vector) {
	let p = new ColorPicker({
	  color: color,
	  el: element,
	  width: 200,
	  height: 200
	});

	let h = document.createElement("input");
	h.type = "text";
	h.maxLength = 7;
	h.addEventListener("input", function(e) {
		if (isValidColorInput(e.target.value)) {p.setColor(e.target.value);}
	});

	element.appendChild(h);

	p.onChange(function (v) {
		h.value = v;
		updateColorUniform(vector.value, v);
	})
}

var canvas = document.getElementById("matrix-canvas");
var gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});

var vertexShader = document.getElementById("vertPass").text;
var fragmentShader = document.getElementById("fragColor").text;

var vert = glutils.compileShader(gl, vertexShader, gl.VERTEX_SHADER);
var frag = glutils.compileShader(gl, fragmentShader, gl.FRAGMENT_SHADER);
var program = glutils.createProgram(gl, vert, frag);

var uniforms = {
	resolution:    { value: [canvas.width, canvas.height] },
    gamma:           { value: 2.2 },
	segments:      { value: 6 },
	USE_LINEAR:    { value: true },

	topLeft:       {value: {r:0, g:0, b:0} },
	topRight:      {value: {r:0, g:0, b:0} },
	bottomLeft:    {value: {r:0, g:0, b:0} },
	bottomRight:   {value: {r:0, g:0, b:0} }
}

var positionAttributeLocation = gl.getAttribLocation(program, "position");
var resolutionUniformLocation = gl.getUniformLocation(program, "resolution");
var segmentsUniformLocation = gl.getUniformLocation(program, "segments");
var gammaUniformLocation = gl.getUniformLocation(program, "gamma");

var colorUniformLocations = [
    {location:gl.getUniformLocation(program, "topLeft"),
    value: uniforms.topLeft.value},
    {location:gl.getUniformLocation(program, "topRight"),
    value: uniforms.topRight.value},
    {location:gl.getUniformLocation(program, "bottomLeft"),
    value: uniforms.bottomLeft.value},
    {location:gl.getUniformLocation(program, "bottomRight"),
    value: uniforms.bottomRight.value},
];

// Create a buffer
var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1,  1,
       1,  1,
       1, -1,
       1, -1,
      -1, -1,
      -1,  1]),
    gl.STATIC_DRAW);

function drawScene() {

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, 400, 400);

    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Set uniforms
    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
    gl.uniform1f(segmentsUniformLocation, uniforms.segments.value);
    gl.uniform1f(gammaUniformLocation, uniforms.gamma.value);

    // Set color uniforms to their respective color properties
    colorUniformLocations.forEach(function (u) {
        gl.uniform3f(u.location, u.value.r, u.value.g, u.value.b)
    })

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset)

    // Draw the geometry.
    var offset = 0;
    var count = 6;
    gl.drawArrays(gl.TRIANGLES, offset, count);
}

animate();

function animate() {

    setTimeout( function() {
        requestAnimationFrame( animate );
    }, 1000 / 30 );

    drawScene();

}


function updateColorUniform(color, hex) {
	var c = colorutils.hexToRgb(hex);
	color.r = c.r;
	color.g = c.g;
	color.b = c.b;
}

CreatePicker(
	document.getElementById('picker-topLeft'),
	"#e7a142",
	uniforms.topLeft);

CreatePicker(
	document.getElementById('picker-bottomLeft'),
	"#e71e98",
	uniforms.bottomLeft);

CreatePicker(
	document.getElementById('picker-topRight'),
	"#864ad7",
	uniforms.topRight);

CreatePicker(
	document.getElementById('picker-bottomRight'),
	"#3bbdd4",
	uniforms.bottomRight);


document.getElementById('segments-value').innerHTML =
uniforms.segments.value =
document.getElementById('segment-slider').value;

document.getElementById('gamma-value').innerHTML =
uniforms.gamma.value =
document.getElementById('gamma-slider').value;

if (document.getElementById('dark-mode-bool').checked){
	document.getElementById('grid').className = "dark";
}else{
	document.getElementById('grid').className = "";
}

document.getElementById('segment-slider').oninput = (function () {
	uniforms.segments.value = this.value;
    document.getElementById('segments-value').innerHTML = this.value;
});

document.getElementById('gamma-slider').oninput = (function () {
	uniforms.gamma.value = this.value;
    document.getElementById('gamma-value').innerHTML = this.value;
});

document.getElementById('dark-mode-bool').oninput = (function () {
	document.getElementById('grid').className = this.checked == true ? "dark" : "";
});

//MOUSE EVENTS
canvas.addEventListener("mousedown", copyHexCode, false);
canvas.addEventListener("mousemove", updateHex, false);
canvas.addEventListener("mouseover", showHex, false);
canvas.addEventListener("mouseout", hideHex, false);

function updateHex(e){
    if (copyMsg){return;}
    hexElement.innerHTML = "#" + getHexCode(e);
}

function showHex(){
    if (copyMsg){return;}
    hexElement.style.display = "block";
}

function hideHex(){
    if (copyMsg){return;}
    hexElement.style.display = "none";
}

function getHexCode(e){
	let p = new Uint8Array(4);
	let pos = getMousePos(canvas, e)
	gl.readPixels(pos.x, canvas.height - pos.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, p);
    return colorutils.rgbToHex(p[0],p[1],p[2]);
}

function copyHexCode(e){
	copyElement.innerHTML = getHexCode(e); // the hex code
	copyElement.select();

	try {
	    var successful = document.execCommand('copy');

        copyMsg = true;
        hexElement.innerHTML = "Copied!";
        setTimeout(function () {
            copyMsg = false;
        }, 3000);
	} catch (err) {
		console.log('Unable to copy value');
	}
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}
