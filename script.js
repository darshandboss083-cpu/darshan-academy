"use strict";

/* =========================================================
   DARSHAN ACADEMY - SCRIPT.JS
========================================================= */

const STORAGE = {
    name: "ds_student_name",
    html: "ds_html",
    css: "ds_css",
    javascript: "ds_javascript",
    notes: "ds_notes",
    questions: "ds_questions",
    activities: "ds_activities",
    practice: "ds_practice",
    firstVisit: "ds_first_visit"
};

const DEFAULT_CODE = {
    html: `<div class="page">
    <h1>Hello, Darshan Academy!</h1>
    <p>Start building your website here.</p>
    <button onclick="showMessage()">Click Me</button>
</div>`,

    css: `body {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #eef2ff;
}

.page {
    min-height: 100vh;
    display: grid;
    place-items: center;
    text-align: center;
}

h1 {
    color: #6d28d9;
}

button {
    padding: 10px 18px;
    border: 0;
    border-radius: 8px;
    background: #7c3aed;
    color: white;
    cursor: pointer;
}`,

    javascript: `function showMessage() {
    alert("Welcome to Darshan Academy!");
}`
};


/* =========================================================
   BASIC HELPERS
========================================================= */

function get(id) {
    return document.getElementById(id);
}

function save(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        console.warn("Could not save data.");
    }
}

function load(key, fallback = "") {
    try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : value;
    } catch (e) {
        return fallback;
    }
}


/* =========================================================
   STUDENT NAME
========================================================= */

function setupStudentName() {
    const modal = get("welcomeModal");
    const input = get("studentNameInput");
    const button = get("continueBtn");
    const error = get("nameError");

    if (!modal || !input || !button) return;

    const savedName = load(STORAGE.name, "");

    if (savedName.trim()) {
        showStudent(savedName);
        modal.classList.add("hidden");
        modal.style.display = "none";
    } else {
        modal.classList.remove("hidden");
        modal.style.display = "";
    }

    function continueStudent() {
        const name = input.value.trim();

        if (!name) {
            if (error) {
                error.textContent = "Please enter your name.";
            }
            input.focus();
            return;
        }

        save(STORAGE.name, name);

        if (!load(STORAGE.firstVisit)) {
            save(
                STORAGE.firstVisit,
                new Date().toISOString()
            );
        }

        showStudent(name);

        modal.classList.add("hidden");
        modal.style.display = "none";

        if (error) {
            error.textContent = "";
        }

        updateActivity("Started learning journey");
        updateJourney();
    }

    button.onclick = continueStudent;

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            continueStudent();
        }
    });

    input.addEventListener("input", function () {
        if (error) {
            error.textContent = "";
        }
    });
}


function showStudent(name) {
    document
        .querySelectorAll(
            "#studentDisplayName, #topStudentName, #profileStudentName, .student-name"
        )
        .forEach(function (element) {
            element.textContent = name;
        });

    const avatar = get("studentAvatar");

    if (avatar) {
        avatar.textContent =
            name.charAt(0).toUpperCase();
    }
}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {
    const buttons =
        document.querySelectorAll(".nav-btn");

    const sections =
        document.querySelectorAll(".page-section");

    function openSection(id) {
        sections.forEach(function (section) {
            section.classList.toggle(
                "active",
                section.id === id
            );
        });

        buttons.forEach(function (button) {
            button.classList.toggle(
                "active",
                button.dataset.section === id
            );
        });

        if (id === "journey") {
            updateJourney();
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            const section = button.dataset.section;

            if (section) {
                openSection(section);
                updateActivity(
                    "Opened " + section
                );
            }
        });
    });

    document
        .querySelectorAll("[data-go]")
        .forEach(function (button) {
            button.addEventListener(
                "click",
                function () {
                    openSection(
                        button.dataset.go
                    );
                }
            );
        });
}


/* =========================================================
   EXTERNAL LINKS
========================================================= */

function setupExternalLinks() {
    document
        .querySelectorAll('a[href*="youtube.com"]')
        .forEach(function (link) {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        });

    document
        .querySelectorAll('a[href*="instagram.com"]')
        .forEach(function (link) {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        });
}


/* =========================================================
   PLAYGROUND
========================================================= */

let editors = {};
let activeEditor = "html";

const editorModes = {
    html: "text/html",
    css: "css",
    javascript: "javascript"
};


function setupPlayground() {
    const container = get("editorContainer");

    if (!container) return;

    if (
        typeof CodeMirror === "undefined"
    ) {
        console.error(
            "CodeMirror is not loaded."
        );
        return;
    }

    createEditors(container);
    setupEditorTabs();
    setupWebDropdown();
    setupPlaygroundButtons();
    setupAutoHTMLClosing();

    switchEditor("html");
    updatePreview();
}


/* =========================================================
   CREATE THREE SEPARATE EDITORS
========================================================= */

function createEditors(container) {
    container.innerHTML = "";

    ["html", "css", "javascript"]
        .forEach(function (language) {

            const wrapper =
                document.createElement("div");

            wrapper.className =
                "editor-instance";

            wrapper.dataset.editor =
                language;

            container.appendChild(wrapper);

            const startingCode =
                load(
                    STORAGE[language],
                    DEFAULT_CODE[language]
                );

            const editor =
                CodeMirror(wrapper, {
                    value: startingCode,

                    mode:
                        editorModes[language],

                    theme: "material-darker",

                    lineNumbers: true,

                    lineWrapping: true,

                    autoCloseBrackets: true,

                    matchBrackets: true,

                    indentUnit: 4,

                    tabSize: 4,

                    smartIndent: true,

                    viewportMargin: Infinity,

                    extraKeys: {
                        "Ctrl-S": function () {
                            saveEditorCode(language);
                        },

                        "Cmd-S": function () {
                            saveEditorCode(language);
                        }
                    }
                });

            editors[language] = {
                editor: editor,
                wrapper: wrapper
            };

            editor.on(
                "change",
                function () {

                    saveEditorCode(language);

                    if (
                        language === "html" ||
                        language === "css" ||
                        language === "javascript"
                    ) {
                        updatePreview();
                    }
                }
            );
        });
}


/* =========================================================
   SAVE EDITOR
========================================================= */

function saveEditorCode(language) {
    if (
        !editors[language] ||
        !editors[language].editor
    ) {
        return;
    }

    save(
        STORAGE[language],
        editors[language].editor.getValue()
    );
}


/* =========================================================
   SWITCH EDITOR
========================================================= */

function switchEditor(language) {
    if (!editors[language]) return;

    activeEditor = language;

    Object.keys(editors).forEach(function (key) {
        const item = editors[key];

        item.wrapper.style.display =
            key === language
                ? "block"
                : "none";
    });

    document
        .querySelectorAll(".editor-tab")
        .forEach(function (tab) {

            tab.classList.toggle(
                "active",
                tab.dataset.editor === language
            );
        });

    document
        .querySelectorAll(".web-option")
        .forEach(function (option) {

            option.classList.toggle(
                "active",
                option.dataset.editor === language
            );
        });

    const languageLabel =
        get("editorLanguage");

    if (languageLabel) {
        languageLabel.textContent =
            language === "html"
                ? "HTML"
                : language === "css"
                    ? "CSS"
                    : "JavaScript";
    }

    setTimeout(function () {
        editors[language].editor.refresh();
        editors[language].editor.focus();
    }, 50);
}


/* =========================================================
   EDITOR TABS
========================================================= */

function setupEditorTabs() {
    document
        .querySelectorAll(".editor-tab")
        .forEach(function (tab) {

            tab.addEventListener(
                "click",
                function () {

                    const language =
                        tab.dataset.editor;

                    switchEditor(language);
                }
            );
        });
}


/* =========================================================
   WEB DROPDOWN
========================================================= */

function setupWebDropdown() {
    const button =
        get("webDropdownBtn");

    const menu =
        get("webDropdownMenu");

    if (!button || !menu) return;

    button.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            menu.classList.toggle("show");
        }
    );

    menu
        .querySelectorAll(".web-option")
        .forEach(function (option) {

            option.addEventListener(
                "click",
                function () {

                    if (
                        option.disabled ||
                        option.classList.contains(
                            "web-option-disabled"
                        )
                    ) {
                        return;
                    }

                    const language =
                        option.dataset.editor;

                    if (language) {
                        switchEditor(language);
                    }

                    menu.classList.remove("show");
                }
            );
        });

    document.addEventListener(
        "click",
        function () {
            menu.classList.remove("show");
        }
    );
}


/* =========================================================
   PLAYGROUND BUTTONS
========================================================= */

function setupPlaygroundButtons() {
    const run =
        get("runCode");

    const publish =
        get("publishCode");

    const copy =
        get("copyCode");

    const clear =
        get("clearCode");

    const reset =
        get("resetCode");

    const suggest =
        get("suggestBtn");


    if (run) {
        run.addEventListener(
            "click",
            function () {
                updatePreview();
                updatePractice();
                updateActivity(
                    "Ran code in playground"
                );
            }
        );
    }


    if (publish) {
        publish.addEventListener(
            "click",
            publishWebsite
        );
    }


    if (copy) {
        copy.addEventListener(
            "click",
            copyCurrentCode
        );
    }


    if (clear) {
        clear.addEventListener(
            "click",
            clearCurrentCode
        );
    }


    if (reset) {
        reset.addEventListener(
            "click",
            resetCurrentCode
        );
    }


    if (suggest) {
        suggest.addEventListener(
            "click",
            showSuggestions
        );
    }
}


/* =========================================================
   CURRENT CODE
========================================================= */

function getAllCode() {
    return {
        html:
            editors.html.editor.getValue(),

        css:
            editors.css.editor.getValue(),

        javascript:
            editors.javascript.editor.getValue()
    };
}


/* =========================================================
   RUN CODE / LIVE PREVIEW
========================================================= */

function buildProjectHTML(project) {

    const safeJS =
        project.javascript.replace(
            /<\/script/gi,
            "<\\/script"
        );

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">

<style>
${project.css}
</style>

</head>

<body>

${project.html}

<script>
${safeJS}
<\/script>

</body>
</html>`;
}


function updatePreview() {
    const frame =
        get("previewFrame");

    if (!frame || !editors.html) {
        return;
    }

    const project =
        getAllCode();

    frame.srcdoc =
        buildProjectHTML(project);
}


/* =========================================================
   COPY
========================================================= */

async function copyCurrentCode() {
    if (!editors[activeEditor]) return;

    const code =
        editors[activeEditor]
            .editor
            .getValue();

    try {
        await navigator.clipboard.writeText(code);

        alert(
            activeEditor.toUpperCase() +
            " code copied."
        );

    } catch (error) {

        const textarea =
            document.createElement("textarea");

        textarea.value = code;

        document.body.appendChild(
            textarea
        );

        textarea.select();

        document.execCommand("copy");

        textarea.remove();

        alert("Code copied.");
    }
}


/* =========================================================
   CLEAR
========================================================= */

function clearCurrentCode() {
    if (!editors[activeEditor]) return;

    editors[activeEditor]
        .editor
        .setValue("");

    saveEditorCode(activeEditor);

    updatePreview();
}


/* =========================================================
   RESET
========================================================= */

function resetCurrentCode() {
    if (!editors[activeEditor]) return;

    const confirmed =
        confirm(
            "Reset this file to the default code?"
        );

    if (!confirmed) return;

    editors[activeEditor]
        .editor
        .setValue(
            DEFAULT_CODE[activeEditor]
        );

    saveEditorCode(activeEditor);

    updatePreview();
}


/* =========================================================
   HTML AUTO CLOSE TAG
========================================================= */

function setupAutoHTMLClosing() {
    if (!editors.html) return;

    const editor =
        editors.html.editor;

    editor.on(
        "inputRead",
        function (cm, change) {

            if (
                !change ||
                change.origin !== "+input"
            ) {
                return;
            }

            if (
                activeEditor !== "html"
            ) {
                return;
            }

            const cursor =
                cm.getCursor();

            const line =
                cm.getLine(cursor.line);

            const beforeCursor =
                line.substring(
                    0,
                    cursor.ch
                );

            const match =
                beforeCursor.match(
                    /<([a-zA-Z][\w-]*)>$/
                );

            if (!match) return;

            const tag =
                match[1].toLowerCase();

            const voidTags = [
                "area",
                "base",
                "br",
                "col",
                "embed",
                "hr",
                "img",
                "input",
                "link",
                "meta",
                "param",
                "source",
                "track",
                "wbr"
            ];

            if (
                voidTags.includes(tag)
            ) {
                return;
            }

            const closing =
                `</${tag}>`;

            cm.replaceRange(
                closing,
                cursor,
                cursor
            );

            cm.setCursor(cursor);
        }
    );
}


/* =========================================================
   SUGGESTIONS
========================================================= */

function showSuggestions() {
    if (!editors[activeEditor]) return;

    const editor =
        editors[activeEditor].editor;

    if (
        typeof CodeMirror.commands.autocomplete ===
        "function"
    ) {
        CodeMirror.commands.autocomplete(
            editor
        );
        return;
    }

    let suggestion = "";

    if (activeEditor === "html") {
        suggestion =
`<div class="">
    <h1>Heading</h1>
    <p>Your text here.</p>
</div>`;
    }

    if (activeEditor === "css") {
        suggestion =
`.container {
    display: flex;
    align-items: center;
    justify-content: center;
}`;
    }

    if (activeEditor === "javascript") {
        suggestion =
`function example() {
    console.log("Hello!");
}`;
    }

    editor.replaceSelection(
        suggestion
    );
}


/* =========================================================
   PUBLISH WEBSITE
========================================================= */

function publishWebsite() {
    const project =
        getAllCode();

    if (
        !project.html.trim() &&
        !project.css.trim() &&
        !project.javascript.trim()
    ) {
        alert(
            "Please write some code first."
        );
        return;
    }

    const encoded =
        encodeProject(project);

    const url =
        window.location.origin +
        window.location.pathname +
        "#project=" +
        encoded;

    const link =
        get("shareLink");

    if (link) {
        link.value = url;
    }

    const box =
        get("publishBox");

    if (box) {
        box.classList.remove("hidden");
        box.style.display = "";
    }

    const open =
        get("openPublished");

    if (open) {
        open.onclick = function () {
            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );
        };
    }

    updateActivity(
        "Published a website"
    );

    try {
        navigator.clipboard.writeText(url);
    } catch (e) {}

    alert(
        "Your website link has been created."
    );
}


/* =========================================================
   SIMPLE URL ENCODING
========================================================= */

function encodeProject(project) {
    const json =
        JSON.stringify(project);

    const bytes =
        new TextEncoder().encode(json);

    let binary = "";

    bytes.forEach(function (byte) {
        binary += String.fromCharCode(byte);
    });

    return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}


function decodeProject(value) {
    try {

        let base64 =
            value
                .replace(/-/g, "+")
                .replace(/_/g, "/");

        while (
            base64.length % 4
        ) {
            base64 += "=";
        }

        const binary =
            atob(base64);

        const bytes =
            Uint8Array.from(
                binary,
                function (character) {
                    return character.charCodeAt(0);
                }
            );

        const json =
            new TextDecoder().decode(bytes);

        return JSON.parse(json);

    } catch (error) {

        return null;
    }
}


/* =========================================================
   READ PUBLISHED PROJECT
========================================================= */

function getSharedProjectFromURL() {
    const hash =
        window.location.hash;

    if (
        !hash.startsWith("#project=")
    ) {
        return null;
    }

    const encoded =
        hash.substring(
            "#project=".length
        );

    return decodeProject(encoded);
}


/* =========================================================
   DISPLAY PUBLISHED PROJECT
========================================================= */

function renderSharedProject(project) {
    document.body.innerHTML = "";

    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";

    const frame =
        document.createElement("iframe");

    frame.style.width = "100vw";
    frame.style.height = "100vh";
    frame.style.border = "0";
    frame.setAttribute(
        "title",
        "Published Website"
    );

    frame.setAttribute(
        "sandbox",
        "allow-scripts allow-forms allow-modals allow-popups"
    );

    frame.srcdoc =
        buildProjectHTML(project);

    document.body.appendChild(frame);
}


/* =========================================================
   PUBLISHED BUTTON
========================================================= */

function setupPublishedButton() {
    const button =
        get("openPublished");

    if (!button) return;

    button.addEventListener(
        "click",
        function () {

            const link =
                get("shareLink");

            if (
                link &&
                link.value
            ) {
                window.open(
                    link.value,
                    "_blank"
                );
            }
        }
    );
}


/* =========================================================
   AI DOUBT
========================================================= */

function setupAI() {
    const button =
        get("askAIButton");

    const input =
        get("aiQuestion");

    const answer =
        get("aiAnswer");

    if (!button || !input || !answer) {
        return;
    }

    button.addEventListener(
        "click",
        function () {

            const question =
                input.value.trim();

            if (!question) {
                answer.textContent =
                    "Write your doubt first.";
                return;
            }

            answer.innerHTML = `
                <strong>DS Academy AI Assistant</strong>
                <p>
                    Your doubt is:
                    "${escapeHTML(question)}"
                </p>
                <p>
                    Try breaking the problem into
                    smaller steps and check the
                    HTML, CSS, or JavaScript involved.
                </p>
            `;

            updateActivity(
                "Asked an AI doubt"
            );
        }
    );
}


/* =========================================================
   NOTES
========================================================= */

function setupNotes() {
    const notes =
        get("quickNotes");

    const button =
        get("saveNotesBtn");

    const message =
        get("notesSavedMessage");

    if (!notes || !button) return;

    notes.value =
        load(
            STORAGE.notes,
            ""
        );

    button.addEventListener(
        "click",
        function () {

            save(
                STORAGE.notes,
                notes.value
            );

            if (message) {
                message.textContent =
                    "Notes saved successfully.";

                setTimeout(function () {
                    message.textContent = "";
                }, 2000);
            }

            updateActivity(
                "Saved notes"
            );

            updateJourney();
        }
    );
}


/* =========================================================
   ASK INSTRUCTOR
========================================================= */

function setupInstructor() {
    const button =
        get("sendInstructorBtn");

    if (!button) {
        renderQuestions();
        return;
    }

    button.addEventListener(
        "click",
        function () {

            const input =
                get("instructorQuestion");

            if (!input) return;

            const question =
                input.value.trim();

            if (!question) {
                alert(
                    "Please write your doubt first."
                );
                input.focus();
                return;
            }

            let questions;

            try {
                questions =
                    JSON.parse(
                        load(
                            STORAGE.questions,
                            "[]"
                        )
                    );
            } catch (e) {
                questions = [];
            }

            questions.unshift({
                text: question,
                time:
                    new Date()
                        .toLocaleString()
            });

            save(
                STORAGE.questions,
                JSON.stringify(
                    questions.slice(0, 20)
                )
            );

            input.value = "";

            renderQuestions();

            updateActivity(
                "Asked Instructor a question"
            );

            alert(
                "Your question has been saved."
            );
        }
    );

    renderQuestions();
}


function renderQuestions() {
    const list =
        get("questionList");

    if (!list) return;

    let questions = [];

    try {
        questions =
            JSON.parse(
                load(
                    STORAGE.questions,
                    "[]"
                )
            );
    } catch (e) {
        questions = [];
    }

    if (!questions.length) {
        list.innerHTML = `
            <div class="empty-question">
                Your questions will appear here.
            </div>
        `;
        return;
    }

    list.innerHTML =
        questions
            .map(function (question) {
                return `
                    <div class="question-item">
                        <strong>
                            ${escapeHTML(
                                question.text
                            )}
                        </strong>
                        <small>
                            ${escapeHTML(
                                question.time
                            )}
                        </small>
                    </div>
                `;
            })
            .join("");
}


/* =========================================================
   JOURNEY
========================================================= */

function updateActivity(text) {
    if (!text) return;

    let activities = [];

    try {
        activities =
            JSON.parse(
                load(
                    STORAGE.activities,
                    "[]"
                )
            );
    } catch (e) {
        activities = [];
    }

    activities.unshift({
        text: text,
        time:
            new Date()
                .toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                })
    });

    save(
        STORAGE.activities,
        JSON.stringify(
            activities.slice(0, 20)
        )
    );

    updateJourney();
}


function updatePractice() {
    const current =
        Number(
            load(
                STORAGE.practice,
                "0"
            )
        );

    save(
        STORAGE.practice,
        String(current + 1)
    );

    updateJourney();
}


function updateJourney() {
    let activities = [];

    try {
        activities =
            JSON.parse(
                load(
                    STORAGE.activities,
                    "[]"
                )
            );
    } catch (e) {
        activities = [];
    }

    const practice =
        Number(
            load(
                STORAGE.practice,
                "0"
            )
        );

    const notes =
        load(
            STORAGE.notes,
            ""
        );

    const streak =
        activities.length
            ? Math.min(
                30,
                activities.length
            )
            : 0;

    const progress =
        Math.min(
            100,
            activities.length * 5
        );

    const streakElement =
        get("streakCount");

    const practiceElement =
        get("practiceCount");

    const savedElement =
        get("savedCount");

    const progressFill =
        get("progressFill");

    const progressPercent =
        get("progressPercent");

    if (streakElement) {
        streakElement.textContent =
            streak;
    }

    if (practiceElement) {
        practiceElement.textContent =
            practice;
    }

    if (savedElement) {
        savedElement.textContent =
            notes.trim() ? "1" : "0";
    }

    if (progressFill) {
        progressFill.style.width =
            progress + "%";
    }

    if (progressPercent) {
        progressPercent.textContent =
            progress + "%";
    }

    const activityList =
        get("activityList");

    if (!activityList) return;

    if (!activities.length) {
        activityList.innerHTML = `
            <div class="activity-item">
                Start learning to see your activity.
            </div>
        `;
        return;
    }

    activityList.innerHTML =
        activities
            .slice(0, 8)
            .map(function (item) {
                return `
                    <div class="activity-item">
                        ${escapeHTML(
                            item.text
                        )}
                        <small>
                            ${escapeHTML(
                                item.time
                            )}
                        </small>
                    </div>
                `;
            })
            .join("");
}


/* =========================================================
   NOTE BUTTONS
========================================================= */

function setupNoteButtons() {
    document
        .querySelectorAll(".note-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const aiButton =
                        document.querySelector(
                            '[data-section="ai"]'
                        );

                    if (aiButton) {
                        aiButton.click();
                    }

                    setTimeout(
                        function () {

                            const input =
                                get("aiQuestion");

                            if (input) {
                                input.focus();
                            }

                        },
                        200
                    );
                }
            );
        });
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   START WEBSITE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const sharedProject =
            getSharedProjectFromURL();

        if (sharedProject) {
            renderSharedProject(
                sharedProject
            );
            return;
        }

        setupStudentName();
        setupNavigation();
        setupExternalLinks();
        setupPlayground();
        setupAI();
        setupNotes();
        setupInstructor();
        setupNoteButtons();
        updateJourney();
    }
);
