module.exports = {
    vertexShader : [
        "attribute vec2 position;",
        "void main(){",
            "gl_Position = vec4(position,0.0,1.0);",
        "}"
    ].join( "\n" ),

    fragmentShader : [
        "void main(){",
        "    gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);",
        "}"
    ].join("\n"),

    fragmentShader2 : [
        "uniform vec4 resolution;",
        "uniform float segments;",
        "uniform float phi;",
        "uniform vec3 topLeft;",
        "uniform vec3 topRight;",
        "uniform vec3 bottomLeft;",
        "uniform vec3 bottomRight;",
        "uniform bool USE_LINEAR;",
        "vec3 toLinear(vec3 srgb) {",
        "    return pow(srgb, vec3(phi));",
        "}",
        "vec3 fromLinear(vec3 linear) {",
        "    return pow(linear, vec3(1.0/phi));",
        "}",
        "void main(){",
        "    vec2 vUv = gl_FragCoord.xy/400.0;",
        "    vec3 c1 = topLeft;",
        "    vec3 c2 = topRight;",
        "    vec3 c3 = bottomLeft;",
        "    vec3 c4 = bottomRight;",
        "    if (USE_LINEAR) {",
        "        c1 = toLinear(c1);",
        "        c2 = toLinear(c2);",
        "        c3 = toLinear(c3);",
        "        c4 = toLinear(c4);",
        "    }",
        "    float mixH = floor(vUv.x*segments)/(segments-1.0);",
        "    float mixV = floor(vUv.y*segments)/(segments-1.0);",
        "    vec3 cTop = mix(c1, c2, mixH);",
        "    vec3 cBottom = mix(c3, c4, mixH);",
        "    vec3 cFinal = mix(cBottom, cTop, mixV);",
        "    if (USE_LINEAR) {",
        "        cFinal = fromLinear(cFinal);",
        "    }",
        "    gl_FragColor = vec4(cFinal, 1.0);",
        "}"
    ].join("\n")
}
