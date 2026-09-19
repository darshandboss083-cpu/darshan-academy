/* =========================================================
   DARSHAN ACADEMY
   Main website JavaScript
========================================================= */

"use strict";


/* ================= SETTINGS ================= */

const YOUTUBE_PLAYLISTS =
    "https://youtube.com/@darshanacademy-z6c/playlists";

const INSTAGRAM =
    "https://www.instagram.com/dsacademy.in/";

const SITE_URL =
    "https://darshandboss083-cpu.github.io/darshan-academy/";

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


/* ================= DEFAULT CODE ================= */

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


/* ================= HELPERS ================= */

function get(id) {
    return document.getElementById(id);
}


function read(key, fallback) {

    try {
        const value = localStorage.getItem(key);

        if (value === null) {
            return fallback;
        }

        return JSON.parse(value);

    } catch (error) {
        return fallback;
    }
}


function write(key, value) {

    try {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );
    } catch (error) {
        console.warn("Storage unavailable");
    }
}


/* ================= STUDENT NAME ================= */

function setupStudentName() {

    const modal = get("welcomeModal");
    const input = get("studentNameInput");
    const continueBtn = get("continueBtn");
    const error = get("nameError");

    if (!modal || !input || !continueBtn) {
        return;
    }

    const savedName =
        localStorage.getItem(STORAGE.name);

    if (savedName && savedName.trim()) {

        showStudent(savedName);

        modal.classList.add("hidden");

    } else {

        modal.classList.remove("hidden");

        setTimeout(() => {
            input.focus();
        }, 150);
    }


    function continueToWebsite() {

        const name =
            input.value.trim();

        if (!name) {

            error.textContent =
                "Please enter your name.";

            input.focus();

            return;
        }

        if (name.length < 2) {

            error.textContent =
                "Please enter a valid name.";

            input.focus();

            return;
        }

        localStorage.setItem(
            STORAGE.name,
            name
        );

        showStudent(name);

        modal.classList.add("hidden");

        updateActivity(
            "Started learning journey"
        );

        updateJourney();
    }


    continueBtn.addEventListener(
        "click",
        continueToWebsite
    );


    input.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                event.preventDefault();

                continueToWebsite();
            }
        }
    );


    input.addEventListener(
        "input",
        function() {
            error.textContent = "";
        }
    );
}


function showStudent(name) {

    const topName =
        get("topStudentName");

    const avatar =
        get("studentAvatar");

    if (topName) {
        topName.textContent = name;
    }

    if (avatar) {
        avatar.textContent =
            name.charAt(0).toUpperCase();
    }
}


/* ================= NAVIGATION ================= */

function setupNavigation() {

    const navButtons =
        document.querySelectorAll(".nav-btn");

    const sections =
        document.querySelectorAll(".page-section");


    function showSection(sectionId) {

        sections.forEach(section => {

            section.classList.toggle(
                "active",
                section.id === sectionId
            );

        });


        navButtons.forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.section === sectionId
            );

        });


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        if (sectionId === "journey") {
            updateJourney();
        }
    }


    navButtons.forEach(button => {

        button.addEventListener(
            "click",
            function() {

                showSection(
                    button.dataset.section
                );

                updateActivity(
                    "Opened " +
                    button.dataset.section
                );
            }
        );
    });


    document.querySelectorAll("[data-go]")
        .forEach(button => {

            button.addEventListener(
                "click",
                function() {

                    showSection(
                        button.dataset.go
                    );
                }
            );
        });
}


/* ================= EXTERNAL LINKS ================= */

function setupExternalLinks() {

    document.querySelectorAll(
        'a[href*="youtube.com"]'
    ).forEach(link => {

        link.addEventListener(
            "click",
            () => updateActivity("Opened YouTube playlist")
        );
    });


    document.querySelectorAll(
        'a[href*="instagram.com"]'
    ).forEach(link => {

        link.addEventListener(
            "click",
            () => updateActivity("Opened Instagram")
        );
    });
}


/* ================= PLAYGROUND ================= */

let editors = {};

let activeLanguage = "html";


const languageModes = {

    html: "text/html",

    css: "css",

    javascript: "javascript"

};


function setupPlayground() {

    const container =
        get("editorContainer");

    if (!container) {
        return;
    }


    const savedHTML =
        localStorage.getItem(STORAGE.html);

    const savedCSS =
        localStorage.getItem(STORAGE.css);

    const savedJS =
        localStorage.getItem(STORAGE.javascript);


    const initialCode = {

        html:
            savedHTML ||
            DEFAULT_CODE.html,

        css:
            savedCSS ||
            DEFAULT_CODE.css,

        javascript:
            savedJS ||
            DEFAULT_CODE.javascript
    };


    Object.keys(initialCode).forEach(
        language => {

            const wrapper =
                document.createElement("div");

            wrapper.className =
                "editor-instance";

            wrapper.style.display =
                language === "html"
                    ? "block"
                    : "none";


            const textarea =
                document.createElement("textarea");

            textarea.value =
                initialCode[language];

            wrapper.appendChild(textarea);

            container.appendChild(wrapper);


            const editor =
                CodeMirror.fromTextArea(
                    textarea,
                    {
                        mode: languageModes[language],
                        theme: "material-darker",

                        lineNumbers: true,

                        lineWrapping: true,

                        autoCloseBrackets: true,

                        tabSize: 2,

                        indentUnit: 2,

                        extraKeys: {
                            "Ctrl-Space":
                                "autocomplete"
                        }
                    }
                );


            editor.on(
                "change",
                function() {

                    localStorage.setItem(
                        STORAGE[language],
                        editor.getValue()
                    );

                    updateActivity(
                        "Edited " + language
                    );

                    updatePractice();
                }
            );


            editors[language] = {
                editor,
                wrapper
            };

        }
    );


    const languageSelect =
        get("languageSelect");


    if (languageSelect) {

        languageSelect.addEventListener(
            "change",
            function() {

                changeLanguage(
                    languageSelect.value
                );
            }
        );
    }


    document.querySelectorAll(
        ".editor-tab"
    ).forEach(tab => {

        tab.addEventListener(
            "click",
            function() {

                changeLanguage(
                    tab.dataset.editor
                );
            }
        );
    });


    get("suggestBtn")?.addEventListener(
        "click",
        showSuggestions
    );


    get("copyCode")?.addEventListener(
        "click",
        copyCode
    );


    get("clearCode")?.addEventListener(
        "click",
        clearCode
    );


    get("resetCode")?.addEventListener(
        "click",
        resetCode
    );


    get("runCode")?.addEventListener(
        "click",
        runWebsite
    );


    get("publishCode")?.addEventListener(
        "click",
        publishWebsite
    );


    runWebsite();

    updateEditorLabel();
}


function changeLanguage(language) {

    if (!editors[language]) {
        return;
    }


    Object.keys(editors).forEach(
        key => {

            editors[key].wrapper.style.display =
                key === language
                    ? "block"
                    : "none";
        }
    );


    activeLanguage =
        language;


    const select =
        get("languageSelect");

    if (select) {
        select.value = language;
    }


    document.querySelectorAll(
        ".editor-tab"
    ).forEach(tab => {

        tab.classList.toggle(
            "active",
            tab.dataset.editor === language
        );
    });


    updateEditorLabel();


    setTimeout(() => {

        editors[language].editor.refresh();

    }, 50);
}


function updateEditorLabel() {

    const label =
        get("editorLanguage");

    if (!label) {
        return;
    }

    label.textContent =
        activeLanguage === "html"
            ? "HTML"
            : activeLanguage === "css"
                ? "CSS"
                : "JavaScript";
}


/* ================= SUGGESTIONS ================= */

function showSuggestions() {

    const currentEditor =
        editors[activeLanguage]?.editor;

    if (!currentEditor) {
        return;
    }


    const suggestions = {

        html: [
            "<div></div>",
            "<section></section>",
            "<header></header>",
            "<main></main>",
            "<footer></footer>",
            "<h1></h1>",
            "<p></p>",
            "<button></button>",
            "<a href=\"\"></a>",
            "<img src=\"\" alt=\"\">",
            "<ul></ul>",
            "<li></li>"
        ],

        css: [
            "display: flex;",
            "display: grid;",
            "justify-content: center;",
            "align-items: center;",
            "background: #ffffff;",
            "color: #000000;",
            "padding: 20px;",
            "margin: 20px;",
            "border-radius: 10px;",
            "box-shadow: 0 10px 30px rgba(0,0,0,.2);",
            "font-size: 20px;",
            "text-align: center;"
        ],

        javascript: [
            "console.log();",
            "document.getElementById();",
            "document.querySelector();",
            "addEventListener();",
            "function name() {}",
            "if () {}",
            "for (let i = 0; i < 10; i++) {}",
            "const value = ;",
            "let value = ;"
        ]
    };


    const hintList =
        suggestions[activeLanguage];


    const cursor =
        currentEditor.getCursor();


    const word =
        currentEditor.getTokenAt(cursor).string;


    const start =
        cursor.ch - word.length;


    const end =
        cursor.ch;


    currentEditor.showHint({

        hint: function() {

            return {

                list: hintList,

                from: CodeMirror.Pos(
                    cursor.line,
                    Math.max(0, start)
                ),

                to: CodeMirror.Pos(
                    cursor.line,
                    end
                )

            };
        },

        completeSingle: false

    });


    updateActivity(
        "Used code suggestions"
    );
}


/* ================= COPY ================= */

async function copyCode() {

    const editor =
        editors[activeLanguage]?.editor;

    if (!editor) {
        return;
    }


    const code =
        editor.getValue();


    try {

        await navigator.clipboard.writeText(
            code
        );

        alert("Code copied!");

    } catch (error) {

        const temp =
            document.createElement("textarea");

        temp.value = code;

        document.body.appendChild(temp);

        temp.select();

        document.execCommand("copy");

        temp.remove();

        alert("Code copied!");
    }
}


/* ================= CLEAR ================= */

function clearCode() {

    const editor =
        editors[activeLanguage]?.editor;

    if (!editor) {
        return;
    }


    editor.setValue("");

    updateActivity(
        "Cleared " + activeLanguage + " code"
    );
}


/* ================= RESET ================= */

function resetCode() {

    const editor =
        editors[activeLanguage]?.editor;

    if (!editor) {
        return;
    }


    editor.setValue(
        DEFAULT_CODE[activeLanguage]
    );


    localStorage.setItem(
        STORAGE[activeLanguage],
        DEFAULT_CODE[activeLanguage]
    );


    updateActivity(
        "Reset " + activeLanguage + " code"
    );
}


/* ================= RUN ================= */

function runWebsite() {

    if (
        !editors.html ||
        !editors.css ||
        !editors.javascript
    ) {
        return;
    }


    const html =
        editors.html.editor.getValue();

    const css =
        editors.css.editor.getValue();

    const javascript =
        editors.javascript.editor.getValue();


    const finalHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
${css}
</style>

</head>

<body>

${html}

<script>
${javascript}
<\/script>

</body>
</html>`;


    const preview =
        get("previewFrame");


    if (!preview) {
        return;
    }


    preview.srcdoc =
        finalHTML;


    updateActivity(
        "Ran website"
    );

    updatePractice();
}


/* ================= PUBLISH ================= */

function publishWebsite() {

    if (
        !editors.html ||
        !editors.css ||
        !editors.javascript
    ) {
        return;
    }


    const project = {

        html:
            editors.html.editor.getValue(),

        css:
            editors.css.editor.getValue(),

        javascript:
            editors.javascript.editor.getValue()
    };


    const compressed =
        LZString.compressToEncodedURIComponent(
            JSON.stringify(project)
        );


    const url =
        SITE_URL +
        "#project=" +
        compressed;


    const box =
        get("publishBox");

    const link =
        get("shareLink");


    if (box) {
        box.classList.remove("hidden");
    }

    if (link) {
        link.value = url;
    }


    updateActivity(
        "Published a website"
    );
}


function loadPublishedProject() {

    const hash =
        window.location.hash;


    if (
        !hash.startsWith("#project=")
    ) {
        return;
    }


    const compressed =
        hash.substring("#project=".length);


    try {

        const json =
            LZString.decompressFromEncodedURIComponent(
                compressed
            );


        const project =
            JSON.parse(json);


        if (
            !project ||
            !project.html
        ) {
            return;
        }


        setTimeout(() => {

            if (editors.html) {

                editors.html.editor.setValue(
                    project.html || ""
                );

                editors.css.editor.setValue(
                    project.css || ""
                );

                editors.javascript.editor.setValue(
                    project.javascript || ""
                );

                runWebsite();

            }

        }, 600);

    } catch (error) {

        console.warn(
            "Could not load published project."
        );
    }
}


/* ================= PUBLISHED LINK BUTTON ================= */

function setupPublishedButton() {

    get("openPublished")?.addEventListener(
        "click",
        function() {

            const link =
                get("shareLink");

            if (
                link &&
                link.value
            ) {

                window.open(
                    link.value,
                    "_blank",
                    "noopener,noreferrer"
                );
            }
        }
    );
}


/* ================= AI ASSISTANT ================= */

function setupAI() {

    get("askAiBtn")?.addEventListener(
        "click",
        askAI
    );


    get("aiQuestion")?.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter" &&
                event.ctrlKey
            ) {

                event.preventDefault();

                askAI();
            }
        }
    );
}


function askAI() {

    const input =
        get("aiQuestion");

    const answer =
        get("aiAnswer");


    if (!input || !answer) {
        return;
    }


    const question =
        input.value.trim();


    if (!question) {

        answer.innerHTML =
            `<span class="ai-placeholder">
                Please type your doubt first.
            </span>`;

        return;
    }


    const q =
        question.toLowerCase();


    let response = "";


    if (
        q.includes("html") &&
        q.includes("css")
    ) {

        response =
            "HTML creates the structure of a webpage, while CSS controls its appearance, spacing, colors and layout.";

    } else if (
        q.includes("html")
    ) {

        response =
            "HTML stands for HyperText Markup Language. It is used to create the structure and content of a webpage.";

    } else if (
        q.includes("css")
    ) {

        response =
            "CSS stands for Cascading Style Sheets. It is used to style HTML elements, including colors, spacing, borders, fonts and layouts.";

    } else if (
        q.includes("javascript") ||
        q.includes(" js ")
    ) {

        response =
            "JavaScript adds behavior and interaction to websites. You can use it to respond to clicks, change content and create dynamic features.";

    } else if (
        q.includes("python")
    ) {

        response =
            "Python is a high-level programming language known for simple syntax. It is widely used in software development, automation, data science and AI.";

    } else if (
        q.includes("ai") ||
        q.includes("artificial intelligence")
    ) {

        response =
            "Artificial Intelligence is the field of creating systems that can perform tasks that normally require human-like intelligence, such as understanding, prediction and generation.";

    } else if (
        q.includes("machine learning") ||
        q.includes(" ml ")
    ) {

        response =
            "Machine Learning is a part of AI where systems learn patterns from data and use those patterns to make predictions or decisions.";

    } else if (
        q.includes("div")
    ) {

        response =
            "The div element is a general-purpose container in HTML. It is commonly used to group elements and apply CSS styles or JavaScript behavior.";

    } else if (
        q.includes("flex")
    ) {

        response =
            "Flexbox is a CSS layout system. Use display: flex on a parent and then properties such as justify-content and align-items to position its children.";

    } else if (
        q.includes("border-radius")
    ) {

        response =
            "border-radius is the CSS property used to create rounded corners on HTML elements.";

    } else {

        response =
            "Start by breaking the doubt into a smaller concept. Check the relevant HTML, CSS, JavaScript, Python or AI/ML lesson, then test the concept in the Coding Playground.";

    }


    answer.innerHTML =
        `<strong>Answer:</strong><br><br>${response}`;


    updateActivity(
        "Asked AI a doubt"
    );
}


/* ================= NOTES ================= */

function setupNotes() {

    const notes =
        get("quickNotes");

    const save =
        get("saveNotesBtn");

    const message =
        get("notesSavedMessage");


    if (!notes || !save) {
        return;
    }


    const saved =
        localStorage.getItem(
            STORAGE.notes
        );


    if (saved) {
        notes.value = saved;
    }


    save.addEventListener(
        "click",
        function() {

            localStorage.setItem(
                STORAGE.notes,
                notes.value
            );


            if (message) {

                message.textContent =
                    "Notes saved.";

                setTimeout(() => {

                    message.textContent = "";

                }, 1800);
            }


            updateActivity(
                "Saved notes"
            );
        }
    );
}


/* ================= ASK INSTRUCTOR ================= */

function setupInstructor() {

    get("sendInstructorBtn")?.addEventListener(
        "click",
        function() {

            const input =
                get("instructorQuestion");


            if (!input) {
                return;
            }


            const question =
                input.value.trim();


            if (!question) {

                alert(
                    "Please write your doubt first."
                );

                input.focus();

                return;
            }


            const questions =
                read(
                    STORAGE.questions,
                    []
                );


            questions.unshift({

                text: question,

                time:
                    new Date().toLocaleString()

            });


            write(
                STORAGE.questions,
                questions.slice(0, 20)
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


    if (!list) {
        return;
    }


    const questions =
        read(
            STORAGE.questions,
            []
        );


    if (!questions.length) {

        list.innerHTML =
            `<div class="empty-question">
                Your questions will appear here.
            </div>`;

        return;
    }


    list.innerHTML =
        questions.map(
            question => {

                return `
                    <div class="question-item">
                        <strong>
                            ${escapeHTML(question.text)}
                        </strong>

                        <small>
                            ${escapeHTML(question.time)}
                        </small>
                    </div>
                `;
            }
        ).join("");
}


/* ================= JOURNEY ================= */

function updateActivity(text) {

    if (!text) {
        return;
    }


    const activities =
        read(
            STORAGE.activities,
            []
        );


    activities.unshift({

        text,

        time:
            new Date().toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            )

    });


    write(
        STORAGE.activities,
        activities.slice(0, 10)
    );


    updateJourney();
}


function updatePractice() {

    let count =
        Number(
            localStorage.getItem(
                STORAGE.practice
            ) || "0"
        );


    count += 1;


    localStorage.setItem(
        STORAGE.practice,
        String(count)
    );


    updateJourney();
}


function updateJourney() {

    const activities =
        read(
            STORAGE.activities,
            []
        );


    const practice =
        Number(
            localStorage.getItem(
                STORAGE.practice
            ) || "0"
        );


    const streak =
        activities.length > 0
            ? Math.min(
                30,
                Math.max(
                    1,
                    new Set(
                        activities.map(
                            item => item.time
                        )
                    ).size
                )
            )
            : 0;


    if (get("streakCount")) {
        get("streakCount").textContent =
            streak;
    }


    if (get("practiceCount")) {
        get("practiceCount").textContent =
            practice;
    }


    const savedNotes =
        localStorage.getItem(
            STORAGE.notes
        );


    if (get("savedCount")) {

        get("savedCount").textContent =
            savedNotes &&
            savedNotes.trim()
                ? 1
                : 0;
    }


    const progress =
        Math.min(
            100,
            activities.length * 5
        );


    if (get("progressFill")) {

        get("progressFill").style.width =
            progress + "%";
    }


    if (get("progressPercent")) {

        get("progressPercent").textContent =
            progress + "%";
    }


    const activityList =
        get("activityList");


    if (!activityList) {
        return;
    }


    if (!activities.length) {

        activityList.innerHTML =
            `<div class="activity-item">
                Start learning to see your activity.
            </div>`;

        return;
    }


    activityList.innerHTML =
        activities.slice(0, 8)
            .map(item => {

                return `
                    <div class="activity-item">
                        ${escapeHTML(item.text)}
                        <small style="color:#8f98ad;margin-left:8px;">
                            ${escapeHTML(item.time)}
                        </small>
                    </div>
                `;

            })
            .join("");
}


/* ================= NOTE BUTTONS ================= */

function setupNoteButtons() {

    document.querySelectorAll(
        ".note-btn"
    ).forEach(button => {

        button.addEventListener(
            "click",
            function() {

                document
                    .querySelector(
                        '[data-section="ai"]'
                    )
                    ?.click();


                setTimeout(() => {

                    get("aiQuestion")?.focus();

                }, 200);

            }
        );
    });
}


/* ================= SECURITY ================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* ================= INITIALIZATION ================= */
/* ================= INITIALIZATION ================= */
/* ================= INITIALIZATION ================= */

document.addEventListener("DOMContentLoaded", function () {

    setupStudentName();

    setupNavigation();

    setupExternalLinks();

    setupPlayground();

    setupPublishedButton();

    setupAI();

    setupNotes();

    setupInstructor();

    setupNoteButtons();

    updateJourney();

    loadPublishedProject();

});
