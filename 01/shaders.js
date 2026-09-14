export const vertexShader = `
attribute vec3 position;
attribute vec4 color;
varying vec4 vColor;
uniform mat4 trans;
void main(void) {
    gl_Position = trans * vec4(position, 1.0);
    vColor = color;
}`;

export const fragmentShader = `
precision mediump float;
varying vec4 vColor;
void main(void) {
    gl_FragColor = vColor;
}`;
