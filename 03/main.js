import { initLessonNav } from "../shared/js/lesson-nav.js";
import { renderCodePanels } from "../shared/js/lesson-page.js";
import { createGpuDebugOverlay } from "../shared/js/gpu-debug-overlay.js";
import {
    createBuffer,
    createProgram,
    createWebGLContext,
    identityMatrix,
    resizeCanvas
} from "../shared/js/webgl.js";
import {
    arrayColors,
    arrayPositions,
    indexedColors,
    indexedPositions,
    indices,
    stripColors,
    stripPositions
} from "./geometry.js";
import { fragmentShader, vertexShader } from "./shaders.js";

const javascriptSnippet = `// Same rectangle, three ways to send triangles

// 1) List every vertex (shared corners duplicated)
gl.drawArrays(gl.TRIANGLES, 0, 6);          // 6 verts

// 2) Store unique verts + index list
gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0); // 4 verts + 6 indices

// 3) Triangle strip: each new vert reuses the last edge
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);     // 4 verts`;

initLessonNav("03");

renderCodePanels({
    vertex: vertexShader,
    fragment: fragmentShader,
    javascript: javascriptSnippet
});

const canvas = document.getElementById("canvas");

let gl;
try {
    gl = createWebGLContext(canvas);
} catch {
    createGpuDebugOverlay({ unavailable: true });
    throw new Error("WebGL not supported");
}

const gpuOverlay = createGpuDebugOverlay({ gl });

const program = createProgram(gl, vertexShader, fragmentShader);
const transLoc = gl.getUniformLocation(program, "trans");
const positionLoc = gl.getAttribLocation(program, "position");
const colorLoc = gl.getAttribLocation(program, "color");

const arrayPosBuf = createBuffer(gl, arrayPositions);
const arrayColBuf = createBuffer(gl, arrayColors);

const indexedPosBuf = createBuffer(gl, indexedPositions);
const indexedColBuf = createBuffer(gl, indexedColors);
const indexBuf = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuf);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

const stripPosBuf = createBuffer(gl, stripPositions);
const stripColBuf = createBuffer(gl, stripColors);

function bindAttribs(positionBuffer, colorBuffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);
}

function draw() {
    resizeCanvas(canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniformMatrix4fv(transLoc, false, identityMatrix);

    // 1) All vertices
    bindAttribs(arrayPosBuf, arrayColBuf);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // 2) Indexed vertices + elements
    bindAttribs(indexedPosBuf, indexedColBuf);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuf);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    // 3) Triangle strip
    bindAttribs(stripPosBuf, stripColBuf);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

gpuOverlay.start(draw);
window.addEventListener("resize", draw);
