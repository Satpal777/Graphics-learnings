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
import { colors, drawCalls, positions } from "./geometry.js";
import { fragmentShader, vertexShader } from "./shaders.js";

const javascriptSnippet = `// GPU primitives: line, triangle, curve (as line segments)
gl.drawArrays(gl.LINES, 0, 2);
gl.drawArrays(gl.TRIANGLES, 2, 3);
gl.drawArrays(gl.LINE_STRIP, 5, 65);`;

initLessonNav("02");

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

const positionBuffer = createBuffer(gl, positions);
const colorBuffer = createBuffer(gl, colors);

function draw() {
    resizeCanvas(canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.lineWidth(1.0);
    gl.useProgram(program);
    gl.uniformMatrix4fv(transLoc, false, identityMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    for (const { mode, offset, count } of drawCalls) {
        gl.drawArrays(gl[mode], offset, count);
    }
}

gpuOverlay.start(draw);
window.addEventListener("resize", draw);
