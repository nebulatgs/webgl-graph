#version 300 es
precision highp float;
uniform vec4 u_FragColor;
out vec4 outColor;
void main() {
    outColor = vec4(gl_FragCoord.xyz, 1.0);
}