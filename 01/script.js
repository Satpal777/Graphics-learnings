const positions = [
    -0.8, 0.4, 0,
    0.8, 0.4, 0,
    0.8, -0.4, 0,
    -0.8, 0.4, 0,
    0.8, -0.4, 0,
    -0.8, -0.4, 0
];

const colors = [
    1, 0, 0, 1,
    0, 1, 0, 1,
    0, 0, 1, 1,
    1, 0, 0, 1,
    0, 0, 1, 1,
    1, 0, 1, 1
];

const canvas = document.getElementById("canvas");
const pixelRatio = window.devicePixelRatio || 1;
canvas.width = pixelRatio * canvas.clientWidth;
canvas.height = pixelRatio * canvas.clientHeight;



const gl = canvas.getContext("webgl");
if (!gl) {
    document.getElementById("gpu-debug-overlay").innerHTML =
        '<div class="status" style="color:#f87171">WebGL unavailable</div>' +
        '<div><span class="label">Fallback: </span><span class="value">CPU (no GPU acceleration)</span></div>';
    throw new Error("WebGL not supported");
}
gl.viewport(0, 0, canvas.width, canvas.height);

gl.clearColor(1, 1, 1, 0);
gl.lineWidth(1.0);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);


const VertexShader = `
    attribute vec3 position;
    attribute vec4 color;
    varying vec4 vColor;
    uniform mat4 trans;
    void main(void) {
        gl_Position = trans * vec4(position, 1.0);
        vColor = color;
    }
`;

const FragmentShader = `
    precision mediump float;
    varying vec4 vColor;
    void main(void) {
        gl_FragColor = vColor;
    }
`;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, VertexShader);
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(vertexShader));
}


const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, FragmentShader);
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(fragmentShader));
}

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
}


var m = gl.getUniformLocation(program, 'trans');

gl.useProgram(program);


var p = gl.getAttribLocation(program, 'position');
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(p, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(p);

var c = gl.getAttribLocation(program, 'color');
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(c, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(c);

function getGpuInfo(gl) {
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (debugInfo) {
        return {
            vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
            renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
        };
    }
    return {
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER),
    };
}

const gpuInfo = getGpuInfo(gl);
const overlay = document.getElementById("gpu-debug-overlay");
let frameCount = 0;
let lastFpsUpdate = performance.now();
let fps = 0;

function updateOverlay(frameTimeMs) {
    overlay.innerHTML =
        '<div class="status">● Rendering via WebGL (GPU)</div>' +
        '<div><span class="label">Vendor: </span><span class="value">' + gpuInfo.vendor + '</span></div>' +
        '<div><span class="label">Renderer: </span><span class="value">' + gpuInfo.renderer + '</span></div>' +
        '<div><span class="label">FPS: </span><span class="value">' + fps + '</span></div>' +
        '<div><span class="label">Frame: </span><span class="value">' + frameTimeMs.toFixed(2) + ' ms</span></div>';
}

function render(time) {
    const frameStart = performance.now();

    const angle = time * 0.001;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const matrix = [
        cos, -sin, 0, 0,
        sin, cos, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ];

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniformMatrix4fv(m, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    const frameTimeMs = performance.now() - frameStart;
    frameCount++;
    const now = performance.now();
    if (now - lastFpsUpdate >= 500) {
        fps = Math.round((frameCount * 1000) / (now - lastFpsUpdate));
        frameCount = 0;
        lastFpsUpdate = now;
    }
    updateOverlay(frameTimeMs);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);