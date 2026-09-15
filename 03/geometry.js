// Same rectangle shape, drawn three ways.
// Shared corners are the optimization opportunity.

function quadColors() {
    return [
        1, 0, 0, 1, // red
        0, 1, 0, 1, // green
        0, 0, 1, 1, // blue
        1, 0, 1, 1 // magenta
    ];
}

// --- 1) All vertices listed (drawArrays TRIANGLES) ---
// Two triangles = 6 positions. Shared edge verts are duplicated.
export const arrayPositions = new Float32Array([
    // triangle 1
    -0.95, 0.35, 0,
    -0.45, 0.35, 0,
    -0.45, -0.35, 0,
    // triangle 2
    -0.95, 0.35, 0,
    -0.45, -0.35, 0,
    -0.95, -0.35, 0
]);

export const arrayColors = new Float32Array([
    1, 0, 0, 1,
    0, 1, 0, 1,
    0, 0, 1, 1,
    1, 0, 0, 1,
    0, 0, 1, 1,
    1, 0, 1, 1
]);

// --- 2) Unique vertices + element indices (drawElements) ---
// 4 corners stored once; index list says which three make each triangle.
export const indexedPositions = new Float32Array([
    -0.25, 0.35, 0, // 0 top-left
    0.25, 0.35, 0, // 1 top-right
    0.25, -0.35, 0, // 2 bottom-right
    -0.25, -0.35, 0 // 3 bottom-left
]);

export const indexedColors = new Float32Array(quadColors());

export const indices = new Uint16Array([
    0, 1, 2, // triangle 1
    0, 2, 3 // triangle 2
]);

// --- 3) Triangle strip (drawArrays TRIANGLE_STRIP) ---
// 4 verts in strip order. Each new vertex reuses the previous edge.
export const stripPositions = new Float32Array([
    0.45, -0.35, 0, // 0 bottom-left
    0.95, -0.35, 0, // 1 bottom-right
    0.45, 0.35, 0, // 2 top-left  → triangle (0,1,2)
    0.95, 0.35, 0 // 3 top-right → triangle (2,1,3)
]);

export const stripColors = new Float32Array([
    1, 0, 1, 1,
    0, 0, 1, 1,
    1, 0, 0, 1,
    0, 1, 0, 1
]);
