const p0 = [0.45, 0.75];
const p1 = [0.55, 0.95];
const p2 = [0.85, 0.05];
const p3 = [0.95, 0.70];

const curvePositions = [];
const curveColors = [];

for (let i = 0; i <= 64; i++) {
    const t = i / 64;
    const u = 1 - t;
    const u2 = u * u;
    const u3 = u2 * u;
    const t2 = t * t;
    const t3 = t2 * t;

    curvePositions.push(
        u3 * p0[0] + 3 * u2 * t * p1[0] + 3 * u * t2 * p2[0] + t3 * p3[0],
        u3 * p0[1] + 3 * u2 * t * p1[1] + 3 * u * t2 * p2[1] + t3 * p3[1],
        0
    );

    curveColors.push(1, 0, 1, 1);
}

export const positions = new Float32Array([
    -0.95, 0.75, 0,
    -0.35, 0.25, 0,

    -0.15, 0.75, 0,
    0.25, 0.75, 0,
    0.05, 0.15, 0,

    ...curvePositions
]);

export const colors = new Float32Array([
    1, 0, 0, 1,
    0, 1, 0, 1,

    1, 0, 0, 1,
    0, 1, 0, 1,
    0, 0, 1, 1,

    ...curveColors
]);

export const drawCalls = [
    { mode: "LINES", offset: 0, count: 2 },
    { mode: "TRIANGLES", offset: 2, count: 3 },
    { mode: "LINE_STRIP", offset: 5, count: 65 }
];
