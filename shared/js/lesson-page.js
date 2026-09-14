import { highlightGlsl, highlightJs } from "./code-highlight.js";

export function renderCodePanels({ vertex, fragment, javascript }) {
    document.getElementById("vertex-code").innerHTML = highlightGlsl(vertex);
    document.getElementById("fragment-code").innerHTML = highlightGlsl(fragment);
    document.getElementById("js-code").innerHTML = highlightJs(javascript);
}
