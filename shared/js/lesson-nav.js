import { lessons } from "./lessons.js";

export function initLessonNav(slug) {
    const nav = document.getElementById("lesson-nav");
    if (!nav) {
        return;
    }

    const index = lessons.findIndex((lesson) => lesson.slug === slug);
    const prev = index > 0 ? lessons[index - 1] : null;
    const next = index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null;

    nav.innerHTML =
        '<a class="lesson-nav-link lesson-nav-home" href="../index.html">All lessons</a>' +
        '<div class="lesson-nav-steps">' +
        (prev
            ? '<a class="lesson-nav-link lesson-nav-prev" href="../' + prev.slug + '/">← ' + prev.title + "</a>"
            : '<span class="lesson-nav-spacer"></span>') +
        '<span class="lesson-nav-current">Lesson ' + slug + " of " + String(lessons.length).padStart(2, "0") + "</span>" +
        (next
            ? '<a class="lesson-nav-link lesson-nav-next" href="../' + next.slug + '/">' + next.title + " →</a>"
            : '<span class="lesson-nav-spacer"></span>') +
        "</div>";
}
