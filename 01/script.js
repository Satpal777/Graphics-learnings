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

var matrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1];

gl.useProgram(program);
gl.uniformMatrix4fv(m, false, matrix);


var p = gl.getAttribLocation(program, 'position');
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(p, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(p);

var c = gl.getAttribLocation(program, 'color');
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(c, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(c);

gl.clear(gl.COLOR_BUFFER_BIT);
gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 6);