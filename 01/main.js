import { renderCodePanels } from "../shared/js/lesson-page.js";
import {
    createBuffer,
    createProgram,
    createWebGLContext,
    identityMatrix,
    resizeCanvas
} from "../shared/js/webgl.js";
import { colors, positions, vertexCount } from "./geometry.js";
import { fragmentShader, vertexShader } from "./shaders.js";

const javascriptSnippet = `// Geometry: 2 triangles → 1 rectangle
const positions = [-0.8, 0.4, 0,  0.8, 0.4, 0,  ...];
const colors    = [1,0,0,1,  0,1,0,1,  0,0,1,1,  ...];

// Upload buffers, compile shaders, link program
gl.useProgram(program);
gl.uniformMatrix4fv(transLoc, false, identityMatrix);

// Bind position & color attributes, then draw
gl.drawArrays(gl.TRIANGLES, 0, 6);`;

renderCodePanels({
    vertex: vertexShader,
    fragment: fragmentShader,
    javascript: javascriptSnippet
});

const canvas = document.getElementById("canvas");
const gl = createWebGLContext(canvas);

const program = createProgram(gl, vertexShader, fragmentShader);
const transLoc = gl.getUniformLocation(program, "trans");
const positionLoc = gl.getAttribLocation(program, "position");
const colorLoc = gl.getAttribLocation(program, "color");

const positionBuffer = createBuffer(gl, positions);
const colorBuffer = createBuffer(gl, colors);

function draw() {
    resizeCanvas(canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniformMatrix4fv(transLoc, false, identityMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
}

draw();
window.addEventListener("resize", draw);
