export function highlightGlsl(source) {
    return source
        .trim()
        .replace(/\/\/.*$/gm, '<span class="cm">$&</span>')
        .replace(
            /\b(attribute|varying|uniform|void|precision|float|vec3|vec4|mat4|mediump)\b/g,
            '<span class="kw">$1</span>'
        )
        .replace(/\b(gl_Position|gl_FragColor|main)\b/g, '<span class="fn">$1</span>');
}

export function highlightJs(source) {
    return source
        .trim()
        .replace(/\/\/.*$/gm, '<span class="cm">$&</span>')
        .replace(/\b(const|false)\b/g, '<span class="kw">$1</span>')
        .replace(/\b(gl)\b/g, '<span class="ty">$1</span>')
        .replace(
            /\b(useProgram|uniformMatrix4fv|drawArrays|TRIANGLES)\b/g,
            '<span class="fn">$1</span>'
        )
        .replace(/\b(\d+)\b/g, '<span class="num">$1</span>');
}
