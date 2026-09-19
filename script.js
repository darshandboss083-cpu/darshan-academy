/* =========================================================
   DARSHAN ACADEMY
   Main Website JavaScript
========================================================= */

"use strict";


/* =========================================================
   SETTINGS
========================================================= */

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


/* =========================================================
   DEFAULT CODE
========================================================= */

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
   HELPER
========================================================= */

function get(id) {
    return document.getElementById(id);
}


function read(key, fallback) {

    try {

        const value =
            localStorage.getItem(key);

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

        console.warn("Storage unavailable.");
    }
}


/* =========================================================
   STUDENT NAME
========================================================= */

function setupStudentName() {

    const modal =
        get("welcomeModal");

    /*
       Your HTML currently uses studentNameInput.
       The fallback also supports studentName.
    */
    const input =
        get("studentNameInput") ||
        get("studentName");

    const continueBtn =
        get("continueBtn");

    const error =
        get("nameError");


    if (!modal || !input || !continueBtn) {

        console.error(
            "Welcome modal elements are missing."
        );

        return;
    }


    const savedName =
        localStorage.getItem(
            STORAGE.name
        );


    /* -------------------------
       Existing student
    ------------------------- */

    if (
        savedName &&
        savedName.trim()
    ) {

        showStudent(
            savedName.trim()
        );

        modal.classList.add(
            "hidden"
        );

    } else {

        modal.classList.remove(
            "hidden"
        );

        setTimeout(function () {

            input.focus();

        }, 200);
    }


    /* -------------------------
       Continue button
    ------------------------- */

    function continueToWebsite() {

        const name =
            input.value.trim();


        if (!name) {

            if (error) {

                error.textContent =
                    "Please enter your name.";
            }

            input.focus();

            return;
        }


        if (name.length < 2) {

            if (error) {

                error.textContent =
                    "Please enter a valid name.";
            }

            input.focus();

            return;
        }


        /* Save name */

        localStorage.setItem(
            STORAGE.name,
            name
        );


        /* Show name on website */

        showStudent(name);


        /* Hide welcome popup */

        modal.classList.add(
            "hidden"
        );


        /* Save first visit */

        if (
            !localStorage.getItem(
                STORAGE.firstVisit
            )
        ) {

            localStorage.setItem(
                STORAGE.firstVisit,
                new Date().toISOString()
            );
        }


        updateActivity(
            "Started learning journey"
        );

        updateJourney();
    }


    continueBtn.addEventListener(
        "click",
        continueToWebsite
    );


    /* Enter key */

    input.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                continueToWebsite();
            }
        }
    );


    /* Clear error while typing */

    input.addEventListener(
        "input",
        function () {

            if (error) {
                error.textContent = "";
            }
        }
    );
}


/* =========================================================
   SHOW STUDENT
========================================================= */

function showStudent(name) {

    const topName =
        get("topStudentName");

    const avatar =
        get("studentAvatar");


    if (topName) {

        topName.textContent =
            name;
    }


    if (avatar) {

        avatar.textContent =
            name.charAt(0).toUpperCase();
    }


    document
        .querySelectorAll(
            ".student-name, #profileStudentName, #studentDisplayName"
        )
        .forEach(function (element) {

            element.textContent =
                name;
        });
}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    const navButtons =
        document.querySelectorAll(
            ".nav-btn"
        );

    const sections =
        document.querySelectorAll(
            ".page-section"
        );


    function showSection(sectionId) {

        sections.forEach(
            function (section) {

                section.classList.toggle(
                    "active",
                    section.id === sectionId
                );
            }
        );


        navButtons.forEach(
            function (button) {

                button.classList.toggle(
                    "active",
                    button.dataset.section === sectionId
                );
            }
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        if (
            sectionId === "journey"
        ) {

            updateJourney();
        }
    }


    navButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    showSection(
                        button.dataset.section
                    );

                    updateActivity(
                        "Opened " +
                        button.dataset.section
                    );
                }
            );
        }
    );


    document
        .querySelectorAll("[data-go]")
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        showSection(
                            button.dataset.go
                        );
                    }
                );
            }
        );
}


/* =========================================================
   EXTERNAL LINKS
========================================================= */

function setupExternalLinks() {

    document
        .querySelectorAll(
            'a[href*="youtube.com"]'
        )
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        updateActivity(
                            "Opened YouTube playlist"
                        );
                    }
                );
            }
        );


    document
        .querySelectorAll(
            'a[href*="instagram.com"]'
        )
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        updateActivity(
                            "Opened Instagram"
                        );
                    }
                );
            }
        );
}


/* =========================================================
   PLAYGROUND
========================================================= */

let editors = {};

let activeLanguage = "html";


const languageModes = {

    html: "text/html",

    css: "css",

    javascript: "javascript"
};


/* =========================================================
   SETUP PLAYGROUND
========================================================= */

function setupPlayground() {

    const container =
        get("editorContainer");


    if (!container) {
        return;
    }


    /*
       Prevent duplicate editors
       if the function runs again.
    */

    if (
        Object.keys(editors).length > 0
    ) {

        return;
    }


    const savedHTML =
        localStorage.getItem(
            STORAGE.html
        );

    const savedCSS =
        localStorage.getItem(
            STORAGE.css
        );

    const savedJS =
        localStorage.getItem(
            STORAGE.javascript
        );


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


    Object.keys(initialCode)
        .forEach(
            function (language) {

                const wrapper =
                    document.createElement(
                        "div"
                    );


                wrapper.className =
                    "editor-instance";


                wrapper.style.display =
                    language === "html"
                        ? "block"
                        : "none";


                const textarea =
                    document.createElement(
                        "textarea"
                    );


                textarea.value =
                    initialCode[language];


                wrapper.appendChild(
                    textarea
                );


                container.appendChild(
                    wrapper
                );


                const editor =
                    CodeMirror.fromTextArea(
                        textarea,
                        {

                            mode:
                                languageModes[
                                    language
                                ],

                            theme:
                                "material-darker",

                            lineNumbers:
                                true,

                            lineWrapping:
                                true,

                            autoCloseBrackets:
                                true,

                            tabSize:
                                2,

                            indentUnit:
                                2,

                            extraKeys: {

                                "Ctrl-Space":
                                    "autocomplete"
                            }
                        }
                    );


                editor.on(
                    "change",
                    function () {

                        localStorage.setItem(
                            STORAGE[language],
                            editor.getValue()
                        );

                        updatePractice();
                    }
                );


                editors[language] = {

                    editor:
                        editor,

                    wrapper:
                        wrapper
                };


                /* HTML automatic closing */

                if (
                    language === "html"
                ) {

                    setupHTMLAutoClose(
                        editor
                    );
                }
            }
        );


    /* Editor tabs */

    document
        .querySelectorAll(
            ".editor-tab"
        )
        .forEach(
            function (tab) {

                tab.addEventListener(
                    "click",
                    function () {

                        changeLanguage(
                            tab.dataset.editor
                        );
                    }
                );
            }
        );


    /* Suggestions */

    const suggestBtn =
        get("suggestBtn");

    if (suggestBtn) {

        suggestBtn.addEventListener(
            "click",
            showSuggestions
        );
    }


    /* Copy */

    const copyBtn =
        get("copyCode");

    if (copyBtn) {

        copyBtn.addEventListener(
            "click",
            copyCode
        );
    }


    /* Clear */

    const clearBtn =
        get("clearCode");

    if (clearBtn) {

        clearBtn.addEventListener(
            "click",
            clearCode
        );
    }


    /* Reset */

    const resetBtn =
        get("resetCode");

    if (resetBtn) {

        resetBtn.addEventListener(
            "click",
            resetCode
        );
    }


    /* Run */

    const runBtn =
        get("runCode");

    if (runBtn) {

        runBtn.addEventListener(
            "click",
            runWebsite
        );
    }


    /* Publish */

    const publishBtn =
        get("publishCode");

    if (publishBtn) {

        publishBtn.addEventListener(
            "click",
            publishWebsite
        );
    }


    setupWebDropdown();


    runWebsite();

    updateEditorLabel();
}


/* =========================================================
   WEB DROPDOWN
========================================================= */

function setupWebDropdown() {

    const button =
        get("webDropdownBtn");

    const menu =
        get("webDropdownMenu");


    if (!button || !menu) {
        return;
    }


    button.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            menu.classList.toggle(
                "show"
            );
        }
    );


    document.addEventListener(
        "click",
        function () {

            menu.classList.remove(
                "show"
            );
        }
    );


    document
        .querySelectorAll(
            ".web-option"
        )
        .forEach(
            function (option) {

                option.addEventListener(
                    "click",
                    function () {

                        const language =
                            option.dataset.editor;


                        changeLanguage(
                            language
                        );


                        document
                            .querySelectorAll(
                                ".web-option"
                            )
                            .forEach(
                                function (item) {

                                    item.classList.remove(
                                        "active"
                                    );
                                }
                            );


                        option.classList.add(
                            "active"
                        );


                        menu.classList.remove(
                            "show"
                        );
                    }
                );
            }
        );
}


/* =========================================================
   HTML AUTO CLOSE TAG
========================================================= */

function setupHTMLAutoClose(editor) {

    let lock = false;


    const voidTags =
        new Set([

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
        ]);


    editor.on(
        "change",
        function (cm, change) {

            if (
                lock ||
                !change ||
                change.origin === "autoClose"
            ) {

                return;
            }


            if (
                change.text.length !== 1 ||
                change.text[0] !== ">"
            ) {

                return;
            }


            const cursor =
                cm.getCursor();


            const line =
                cm.getLine(
                    cursor.line
                );


            const before =
                line.slice(
                    0,
                    cursor.ch
                );


            const match =
                before.match(
                    /<([A-Za-z][\w:-]*)(?:\s[^<>]*?)?>$/
                );


            if (!match) {
                return;
            }


            const tag =
                match[1];


            if (
                voidTags.has(
                    tag.toLowerCase()
                )
            ) {

                return;
            }


            if (
                /\/\s*>$/.test(
                    before
                )
            ) {

                return;
            }


            /*
               Don't automatically close
               an already closed tag.
            */

            const after =
                line.slice(
                    cursor.ch
                );


            if (
                after.startsWith(
                    `</${tag}>`
                )
            ) {

                return;
            }


            const closingTag =
                `</${tag}>`;


            lock = true;


            cm.replaceRange(
                closingTag,
                cursor,
                cursor,
                "autoClose"
            );


            cm.setCursor(
                cursor
            );


            lock = false;
        }
    );
}


/* =========================================================
   CHANGE LANGUAGE
========================================================= */

function changeLanguage(language) {

    if (
        !editors[language]
    ) {

        return;
    }


    Object.keys(editors)
        .forEach(
            function (key) {

                editors[key].wrapper.style.display =
                    key === language
                        ? "block"
                        : "none";
            }
        );


    activeLanguage =
        language;


    document
        .querySelectorAll(
            ".editor-tab"
        )
        .forEach(
            function (tab) {

                tab.classList.toggle(
                    "active",
                    tab.dataset.editor === language
                );
            }
        );


    document
        .querySelectorAll(
            ".web-option"
        )
        .forEach(
            function (option) {

                option.classList.toggle(
                    "active",
                    option.dataset.editor === language
                );
            }
        );


    updateEditorLabel();


    setTimeout(
        function () {

            editors[
                language
            ].editor.refresh();

        },
        50
    );
}


/* =========================================================
   EDITOR LABEL
========================================================= */

function updateEditorLabel() {

    const label =
        get("editorLanguage");


    if (!label) {
        return;
    }


    if (
        activeLanguage === "html"
    ) {

        label.textContent =
            "HTML";

    } else if (
        activeLanguage === "css"
    ) {

        label.textContent =
            "CSS";

    } else {

        label.textContent =
            "JavaScript";
    }
}


/* =========================================================
   SUGGESTIONS
========================================================= */

function showSuggestions() {

    const currentEditor =
        editors[
            activeLanguage
        ]?.editor;


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
        suggestions[
            activeLanguage
        ];


    if (
        !hintList ||
        !CodeMirror.showHint
    ) {

        return;
    }


    const cursor =
        currentEditor.getCursor();


    const token =
        currentEditor.getTokenAt(
            cursor
        );


    const word =
        token.string || "";


    const start =
        cursor.ch -
        word.length;


    const end =
        cursor.ch;


    CodeMirror.showHint(
        currentEditor,
        function () {

            return {

                list:
                    hintList,

                from:
                    CodeMirror.Pos(
                        cursor.line,
                        Math.max(
                            0,
                            start
                        )
                    ),

                to:
                    CodeMirror.Pos(
                        cursor.line,
                        end
                    )
            };
        },

        {
            completeSingle:
                false
        }
    );


    updateActivity(
        "Used code suggestions"
    );
}


/* =========================================================
   COPY
========================================================= */

async function copyCode() {

    const editor =
        editors[
            activeLanguage
        ]?.editor;


    if (!editor) {
        return;
    }


    const code =
        editor.getValue();


    try {

        await navigator.clipboard.writeText(
            code
        );

        alert(
            "Code copied!"
        );

    } catch (error) {

        const temp =
            document.createElement(
                "textarea"
            );


        temp.value =
            code;


        document.body.appendChild(
            temp
        );


        temp.select();


        document.execCommand(
            "copy"
        );


        temp.remove();


        alert(
            "Code copied!"
        );
    }
}


/* =========================================================
   CLEAR
========================================================= */

function clearCode() {

    const editor =
        editors[
            activeLanguage
        ]?.editor;


    if (!editor) {
        return;
    }


    editor.setValue("");


    updateActivity(
        "Cleared " +
        activeLanguage +
        " code"
    );
}


/* =========================================================
   RESET
========================================================= */

function resetCode() {

    const editor =
        editors[
            activeLanguage
        ]?.editor;


    if (!editor) {
        return;
    }


    editor.setValue(
        DEFAULT_CODE[
            activeLanguage
        ]
    );


    localStorage.setItem(
        STORAGE[
            activeLanguage
        ],
        DEFAULT_CODE[
            activeLanguage
        ]
    );


    updateActivity(
        "Reset " +
        activeLanguage +
        " code"
    );
}


/* =========================================================
   RUN WEBSITE
========================================================= */

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


    const safeJS =
        javascript.replace(
            /<\/script/gi,
            "<\\/script"
        );


    const finalHTML =
`<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<style>

${css}

</style>

</head>

<body>

${html}

<script>

${safeJS}

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


    updatePractice();
}


/* =========================================================
   PUBLISH WEBSITE
========================================================= */

function publishWebsite() {

    if (
        !editors.html ||
        !editors.css ||
        !editors.javascript
    ) {

        return;
    }


    if (
        typeof LZString === "undefined"
    ) {

        alert(
            "Publishing is temporarily unavailable. Please refresh the page."
        );

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

        box.classList.remove(
            "hidden"
        );
    }


    if (link) {

        link.value =
            url;
    }


    updateActivity(
        "Published a website"
    );
}


/* =========================================================
   GET SHARED PROJECT
========================================================= */

function getSharedProjectFromURL() {

    const hash =
        window.location.hash;


    if (
        !hash.startsWith(
            "#project="
        )
    ) {

        return null;
    }


    try {

        const compressed =
            decodeURIComponent(
                hash.substring(9)
            );


        if (
            typeof LZString === "undefined"
        ) {

            return null;
        }


        const json =
            LZString.decompressFromEncodedURIComponent(
                compressed
            );


        if (!json) {
            return null;
        }


        return JSON.parse(
            json
        );

    } catch (error) {

        console.error(
            "Could not load shared project:",
            error
        );

        return null;
    }
}


/* =========================================================
   BUILD SHARED PROJECT
========================================================= */

function buildProjectHTML(project) {

    const html =
        project.html || "";


    const css =
        project.css || "";


    const javascript =
        (
            project.javascript ||
            ""
        ).replace(
            /<\/script/gi,
            "<\\/script"
        );


    /*
       If user created a complete
       HTML document.
    */

    if (
        /<html[\s>]/i.test(
            html
        )
    ) {

        let full =
            html;


        if (
            /<\/head>/i.test(
                full
            )
        ) {

            full =
                full.replace(
                    /<\/head>/i,
                    `<style>${css}</style></head>`
                );

        } else {

            full =
                `<style>${css}</style>` +
                full;
        }


        if (
            /<\/body>/i.test(
                full
            )
        ) {

            full =
                full.replace(
                    /<\/body>/i,
                    `<script>${javascript}<\/script></body>`
                );

        } else {

            full +=
                `<script>${javascript}<\/script>`;
        }


        return full;
    }


    /*
       Normal HTML fragment.
    */

    return `<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

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
}


/* =========================================================
   RENDER SHARED PROJECT
========================================================= */

function renderSharedProject(project) {

    document.body.innerHTML = "";


    const frame =
        document.createElement(
            "iframe"
        );


    frame.style.cssText =
        "width:100vw;" +
        "height:100vh;" +
        "border:0;" +
        "display:block;" +
        "background:white;";


    frame.setAttribute(
        "title",
        "Published Website"
    );


    frame.setAttribute(
        "sandbox",
        "allow-scripts"
    );


    frame.srcdoc =
        buildProjectHTML(
            project
        );


    document.body.appendChild(
        frame
    );


    document.title =
        "Published Website | Darshan Academy";
}


/* =========================================================
   LOAD PUBLISHED PROJECT
========================================================= */

function loadPublishedProject() {

    const project =
        getSharedProjectFromURL();


    if (!project) {
        return false;
    }


    renderSharedProject(
        project
    );


    return true;
}


/* =========================================================
   PUBLISHED LINK BUTTON
========================================================= */

function setupPublishedButton() {

    const button =
        get("openPublished");


    if (!button) {
        return;
    }


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
                    "_blank",
                    "noopener,noreferrer"
                );
            }
        }
    );
}


/* =========================================================
   AI ASSISTANT
========================================================= */

function setupAI() {

    const button =
        get("askAiBtn");


    if (button) {

        button.addEventListener(
            "click",
            askAI
        );
    }


    const input =
        get("aiQuestion");


    if (input) {

        input.addEventListener(
            "keydown",
            function (event) {

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
        q.includes("artificial intelligence") ||
        q.includes(" ai ")
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
            "Flexbox is a CSS layout system. Use display: flex on a parent and properties such as justify-content and align-items to position its children.";

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


/* =========================================================
   NOTES
========================================================= */

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

        notes.value =
            saved;
    }


    save.addEventListener(
        "click",
        function () {

            localStorage.setItem(
                STORAGE.notes,
                notes.value
            );


            if (message) {

                message.textContent =
                    "Notes saved.";


                setTimeout(
                    function () {

                        message.textContent =
                            "";

                    },
                    1800
                );
            }


            updateActivity(
                "Saved notes"
            );
        }
    );
}


/* =========================================================
   ASK INSTRUCTOR
========================================================= */

function setupInstructor() {

    const button =
        get("sendInstructorBtn");


    if (button) {

        button.addEventListener(
            "click",
            function () {

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

                    text:
                        question,

                    time:
                        new Date()
                            .toLocaleString()
                });


                write(
                    STORAGE.questions,
                    questions.slice(
                        0,
                        20
                    )
                );


                input.value =
                    "";


                renderQuestions();


                updateActivity(
                    "Asked Instructor a question"
                );


                alert(
                    "Your question has been saved."
                );
            }
        );
    }


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
        questions
            .map(
                function (question) {

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
                }
            )
            .join("");
}


/* =========================================================
   JOURNEY / ACTIVITY
========================================================= */

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

        text:
            text,

        time:
            new Date()
                .toLocaleTimeString(
                    [],
                    {
                        hour:
                            "2-digit",

                        minute:
                            "2-digit"
                    }
                )
    });


    write(
        STORAGE.activities,
        activities.slice(
            0,
            10
        )
    );


    updateJourney();
}


function updatePractice() {

    let count =
        Number(
            localStorage.getItem(
                STORAGE.practice
            ) ||
            "0"
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
            ) ||
            "0"
        );


    const streak =
        activities.length > 0
            ? Math.min(
                30,
                Math.max(
                    1,
                    activities.length
                )
            )
            : 0;


    if (
        get("streakCount")
    ) {

        get(
            "streakCount"
        ).textContent =
            streak;
    }


    if (
        get("practiceCount")
    ) {

        get(
            "practiceCount"
        ).textContent =
            practice;
    }


    const savedNotes =
        localStorage.getItem(
            STORAGE.notes
        );


    if (
        get("savedCount")
    ) {

        get(
            "savedCount"
        ).textContent =
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


    if (
        get("progressFill")
    ) {

        get(
            "progressFill"
        ).style.width =
            progress + "%";
    }


    if (
        get("progressPercent")
    ) {

        get(
            "progressPercent"
        ).textContent =
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
        activities
            .slice(
                0,
                8
            )
            .map(
                function (item) {

                    return `
                        <div class="activity-item">

                            ${escapeHTML(
                                item.text
                            )}

                            <small
                                style="color:#8f98ad;margin-left:8px;"
                            >
                                ${escapeHTML(
                                    item.time
                                )}
                            </small>

                        </div>
                    `;
                }
            )
            .join("");
}


/* =========================================================
   NOTE BUTTONS
========================================================= */

function setupNoteButtons() {

    document
        .querySelectorAll(
            ".note-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        document
                            .querySelector(
                                '[data-section="ai"]'
                            )
                            ?.click();


                        setTimeout(
                            function () {

                                get(
                                    "aiQuestion"
                                )?.focus();

                            },
                            200
                        );
                    }
                );
            }
        );
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
           IMPORTANT:
           If this is a published project link,
           show only the student's project.
        */

        const sharedProject =
            getSharedProjectFromURL();


        if (sharedProject) {

            renderSharedProject(
                sharedProject
            );

            return;
        }


        /* Normal website */

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
    }
);
