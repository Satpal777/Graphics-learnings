export function getGpuInfo(gl) {
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

export function createGpuDebugOverlay({ gl = null, unavailable = false } = {}) {
    const overlay = document.getElementById("gpu-debug-overlay");
    if (!overlay) {
        return { update() {}, start() {} };
    }

    if (unavailable || !gl) {
        overlay.innerHTML =
            '<div class="gpu-debug-status gpu-debug-error">WebGL unavailable</div>' +
            '<div><span class="gpu-debug-label">Fallback: </span>' +
            '<span class="gpu-debug-value">CPU (no GPU acceleration)</span></div>';
        return { update() {}, start() {} };
    }

    const gpuInfo = getGpuInfo(gl);
    let frameCount = 0;
    let lastFpsUpdate = performance.now();
    let fps = 0;

    function update(frameTimeMs) {
        overlay.innerHTML =
            '<div class="gpu-debug-status">● Rendering via WebGL (GPU)</div>' +
            '<div><span class="gpu-debug-label">Vendor: </span>' +
            '<span class="gpu-debug-value">' + gpuInfo.vendor + '</span></div>' +
            '<div><span class="gpu-debug-label">Renderer: </span>' +
            '<span class="gpu-debug-value">' + gpuInfo.renderer + '</span></div>' +
            '<div><span class="gpu-debug-label">FPS: </span>' +
            '<span class="gpu-debug-value">' + fps + '</span></div>' +
            '<div><span class="gpu-debug-label">Frame: </span>' +
            '<span class="gpu-debug-value">' + frameTimeMs.toFixed(2) + ' ms</span></div>';
    }

    function trackFrame(frameTimeMs) {
        frameCount++;
        const now = performance.now();
        if (now - lastFpsUpdate >= 500) {
            fps = Math.round((frameCount * 1000) / (now - lastFpsUpdate));
            frameCount = 0;
            lastFpsUpdate = now;
        }
        update(frameTimeMs);
    }

    function start(onFrame) {
        function loop() {
            const frameStart = performance.now();
            onFrame();
            trackFrame(performance.now() - frameStart);
            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
    }

    update(0);
    return { update, start };
}
