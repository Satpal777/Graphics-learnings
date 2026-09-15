import { lessons } from "./lessons.js";

const steps = document.getElementById("lesson-steps");

const stepActions = ["Start here", "Continue", "Continue"];

steps.innerHTML = lessons.map((lesson, index) => {
    const step = index + 1;
    const number = String(step).padStart(2, "0");
    const action = stepActions[index] || "Open lesson";
    const isLast = index === lessons.length - 1;

    return (
        '<li class="lesson-step">' +
        '<div class="lesson-step-marker">' +
        '<span class="lesson-step-num">' + number + "</span>" +
        (isLast ? "" : '<span class="lesson-step-line" aria-hidden="true"></span>') +
        "</div>" +
        '<div class="lesson-step-card">' +
        '<div class="lesson-step-header">' +
        '<span class="lesson-step-label">Step ' + step + "</span>" +
        '<a class="lesson-step-link" href="./' + lesson.slug + '/">' + action + " →</a>" +
        "</div>" +
        '<a class="lesson-step-body" href="./' + lesson.slug + '/">' +
        "<h3>" + lesson.title + "</h3>" +
        "<p>" + lesson.description + "</p>" +
        "</a>" +
        "</div>" +
        "</li>"
    );
}).join("");
