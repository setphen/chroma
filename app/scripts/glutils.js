//from https://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html
module.exports = {
    compileShader: function(gl, shaderSource, shaderType) {
        // Create the shader object
        var shader = gl.createShader(shaderType);

        // Set the shader source code.
        gl.shaderSource(shader, shaderSource);

        // Compile the shader
        gl.compileShader(shader);

        // Check if it compiled
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success) {
        // Something went wrong during compilation; get the error
        throw "could not compile shader:" + gl.getShaderInfoLog(shader);
        }

        return shader;
    },

    createProgram: function (gl, vertexShader, fragmentShader) {
        // create a program.
        var program = gl.createProgram();

        // attach the shaders.
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        // link the program.
        gl.linkProgram(program);

        // Check if it linked.
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!success) {
          // something went wrong with the link
          throw ("program filed to link:" + gl.getProgramInfoLog (program));
        }

        return program;
    }
}
