/* =====================================================
   DARSHAN ACADEMY
   MAIN JAVASCRIPT
===================================================== */


/* =====================================================
   BASIC HELPERS
===================================================== */

function $(id) {

    return document.getElementById(id);

}


function showToast(message) {

    let oldToast = document.querySelector(".toast");

    if (oldToast) {
        oldToast.remove();
    }


    let toast = document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;

    document.body.appendChild(toast);


    setTimeout(function () {

        if (toast) {
            toast.remove();
        }

    }, 3000);

}


/* =====================================================
   PROFILE SYSTEM
===================================================== */

/*
    Important:

    The name alone is NOT used as the student identity.

    A unique profile ID is generated for each browser profile.

    This prevents two students with the same name from
    overwriting each other's data on the same browser.
*/


function createProfileId() {

    if (
        window.crypto &&
        typeof window.crypto.randomUUID === "function"
    ) {

        return window.crypto.randomUUID();

    }


    return (
        "profile-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 12)
    );

}


function getProfileId() {

    let profileId =
        localStorage.getItem("da_profile_id");


    if (!profileId) {

        profileId = createProfileId();

        localStorage.setItem(
            "da_profile_id",
            profileId
        );

    }


    return profileId;

}


const PROFILE_ID = getProfileId();


function profileKey(name) {

    return "da_" + PROFILE_ID + "_" + name;

}


function getData(name, defaultValue) {

    let value =
        localStorage.getItem(
            profileKey(name)
        );


    if (value === null) {

        return defaultValue;

    }


    try {

        return JSON.parse(value);

    } catch {

        return value;

    }

}


function saveData(name, value) {

    localStorage.setItem(
        profileKey(name),
        JSON.stringify(value)
    );

}


/* =====================================================
   DEFAULT CODE
===================================================== */

const DEFAULT_CODE = {

    html:
`<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>

<body>

    <h1>Hello World!</h1>

    <p>
        Welcome to my website.
    </p>

</body>
</html>`,

    css:
`body {
    font-family: Arial, sans-serif;
    padding: 30px;
    background: #f4f4f4;
}

h1 {
    color: #6c5ce7;
}`,

    javascript:
`console.log("Hello from JavaScript!");

document.querySelector("h1");

`
};


/* =====================================================
   CODE STORAGE
===================================================== */

function getSavedCode() {

    return getData(
        "code",
        DEFAULT_CODE
    );

}


function saveCode() {

    if (!editors.html) {
        return;
    }


    let code = {

        html:
            editors.html.getValue(),

        css:
            editors.css.getValue(),

        javascript:
            editors.javascript.getValue()

    };


    saveData(
        "code",
        code
    );


    showToast("Code saved");


    addActivity(
        "Saved your coding work"
    );

}


/* =====================================================
   CURRENT EDITOR
===================================================== */

let editors = {

    html: null,

    css: null,

    javascript: null

};


let currentLanguage = "html";


let codeMirrorReady = false;


/* =====================================================
   CODE EDITOR
===================================================== */

function createEditors() {

    if (typeof CodeMirror === "undefined") {

        return;

    }


    let textarea =
        $("codeEditor");


    if (!textarea) {
        return;
    }


    let savedCode =
        getSavedCode();


    editors.html =
        CodeMirror.fromTextArea(
            textarea,
            {
                mode: "xml",
                theme: "material-darker",
                lineNumbers: true,
                autoCloseBrackets: true,
                lineWrapping: true,
                indentUnit: 4,
                tabSize: 4
            }
        );


    editors.css =
        CodeMirror(
            document.createElement("div"),
            {
                value: savedCode.css,
                mode: "css",
                theme: "material-darker",
                lineNumbers: true,
                autoCloseBrackets: true,
                lineWrapping: true,
                indentUnit: 4,
                tabSize: 4
            }
        );


    editors.javascript =
        CodeMirror(
            document.createElement("div"),
            {
                value: savedCode.javascript,
                mode: "javascript",
                theme: "material-darker",
                lineNumbers: true,
                autoCloseBrackets: true,
                lineWrapping: true,
                indentUnit: 4,
                tabSize: 4
            }
        );


    let editorPanel =
        document.querySelector(
            ".editor-panel"
        );


    let htmlEditor =
        editors.html.getWrapperElement();


    let cssEditor =
        editors.css.getWrapperElement();


    let jsEditor =
        editors.javascript.getWrapperElement();


    htmlEditor.classList.add(
        "editor-html"
    );


    cssEditor.classList.add(
        "editor-css"
    );


    jsEditor.classList.add(
        "editor-javascript"
    );


    editorPanel.appendChild(
        cssEditor
    );


    editorPanel.appendChild(
        jsEditor
    );


    codeMirrorReady = true;


    showEditor(
        "html"
    );


    runCode();

}


/* =====================================================
   SHOW SELECTED EDITOR
===================================================== */

function showEditor(language) {

    currentLanguage = language;


    if (!editors.html) {
        return;
    }


    let htmlElement =
        editors.html.getWrapperElement();


    let cssElement =
        editors.css.getWrapperElement();


    let jsElement =
        editors.javascript.getWrapperElement();


    htmlElement.style.display =
        "none";

    cssElement.style.display =
        "none";

    jsElement.style.display =
        "none";


    if (language === "html") {

        htmlElement.style.display =
            "block";

        $("editorLanguage").textContent =
            "HTML";

    }


    if (language === "css") {

        cssElement.style.display =
            "block";

        $("editorLanguage").textContent =
            "CSS";

    }


    if (language === "javascript") {

        jsElement.style.display =
            "block";

        $("editorLanguage").textContent =
            "JAVASCRIPT";

    }


    document
        .querySelectorAll(".editor-tab")
        .forEach(function (button) {

            button.classList.remove(
                "active"
            );

        });


    let selectedButton =
        document.querySelector(
            '.editor-tab[data-language="' +
            language +
            '"]'
        );


    if (selectedButton) {

        selectedButton.classList.add(
            "active"
        );

    }


    setTimeout(function () {

        if (editors.html) {
            editors.html.refresh();
        }

        if (editors.css) {
            editors.css.refresh();
        }

        if (editors.javascript) {
            editors.javascript.refresh();
        }

    }, 50);

}


/* =====================================================
   BUILD WEBSITE DOCUMENT
===================================================== */

function buildProjectDocument(
    html,
    css,
    javascript
) {

    let documentText = html.trim();


    /*
        If the student only wrote body elements,
        automatically create a complete HTML document.
    */

    if (
        !documentText
            .toLowerCase()
            .includes("<html")
    ) {

        documentText =
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

${javascript
    .replace(/<\/script>/gi, "<\\/script>")}

    <\/script>

</body>

</html>`;

        return documentText;

    }


    /*
        Student wrote a complete HTML document.
    */

    if (
        /<\/head>/i.test(documentText)
    ) {

        documentText =
            documentText.replace(
                /<\/head>/i,

                `
<style>

${css}

</style>

</head>`
            );

    } else {

        documentText =
            `
<style>

${css}

</style>

` +
            documentText;

    }


    if (
        /<\/body>/i.test(documentText)
    ) {

        documentText =
            documentText.replace(
                /<\/body>/i,

                `
<script>

${javascript
    .replace(/<\/script>/gi, "<\\/script>")}

<\/script>

</body>`
            );

    } else {

        documentText +=
`
<script>

${javascript
    .replace(/<\/script>/gi, "<\\/script>")}

<\/script>`;

    }


    return documentText;

}


/* =====================================================
   RUN CODE
===================================================== */

function runCode() {

    if (!codeMirrorReady) {
        return;
    }


    let html =
        editors.html.getValue();


    let css =
        editors.css.getValue();


    let javascript =
        editors.javascript.getValue();


    let documentText =
        buildProjectDocument(
            html,
            css,
            javascript
        );


    let frame =
        $("previewFrame");


    /*
        IMPORTANT:

        The student's website runs inside
        its own iframe.

        This prevents Darshan Academy CSS
        from changing the student's website.
    */

    frame.srcdoc =
        documentText;


    saveCode();


    addActivity(
        "Ran code in the playground"
    );

}


/* =====================================================
   PUBLISH WEBSITE
===================================================== */

function publishWebsite() {

    if (!codeMirrorReady) {
        return;
    }


    let project = {

        studentId:
            PROFILE_ID,

        studentName:
            getStudentName(),

        html:
            editors.html.getValue(),

        css:
            editors.css.getValue(),

        javascript:
            editors.javascript.getValue(),

        createdAt:
            new Date().toISOString()

    };


    let jsonText =
        JSON.stringify(project);


    let compressed =
        LZString.compressToEncodedURIComponent(
            jsonText
        );


    /*
        IMPORTANT FIX:

        The published URL contains ?published=

        It does NOT open the Darshan Academy
        dashboard.

        It opens only the website created
        by the student.
    */

    let publishedUrl =
        window.location.origin +
        window.location.pathname +
        "?published=" +
        compressed;


    $("shareLink").value =
        publishedUrl;


    $("publishBox")
        .classList
        .remove("hidden");


    let openButton =
        $("openPublished");


    openButton.onclick =
        function () {

            window.open(
                publishedUrl,
                "_blank"
            );

        };


    addActivity(
        "Published your website"
    );


    showToast(
        "Website published successfully"
    );

}


/* =====================================================
   LOAD PUBLISHED WEBSITE
===================================================== */

function loadPublishedWebsite() {

    let params =
        new URLSearchParams(
            window.location.search
        );


    let compressed =
        params.get("published");


    if (!compressed) {

        return false;

    }


    try {

        let jsonText =
            LZString.decompressFromEncodedURIComponent(
                compressed
            );


        if (!jsonText) {

            throw new Error(
                "Invalid project"
            );

        }


        let project =
            JSON.parse(
                jsonText
            );


        if (
            !project.html
        ) {

            throw new Error(
                "Invalid HTML"
            );

        }


        let website =
            buildProjectDocument(
                project.html,
                project.css || "",
                project.javascript || ""
            );


        /*
            Remove the entire academy page.

            This is the important part that fixes
            the old website appearing after publishing.
        */

        document.body.innerHTML = "";


        document.body.className =
            "published-page";


        let frame =
            document.createElement(
                "iframe"
            );


        frame.className =
            "published-frame";


        frame.setAttribute(
            "title",
            "Published student website"
        );


        document.body.appendChild(
            frame
        );


        frame.srcdoc =
            website;


        return true;

    } catch (error) {

        document.body.innerHTML = "";


        let message =
            document.createElement(
                "div"
            );


        message.style.cssText = `
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            padding:30px;
            background:#0b0f14;
            color:white;
            font-family:Arial,sans-serif;
            text-align:center;
        `;


        message.innerHTML =
`
<div>

    <h1>
        Unable to open website
    </h1>

    <p>
        This published project link is invalid
        or incomplete.
    </p>

</div>
`;


        document.body.appendChild(
            message
        );


        return true;

    }

}


/* =====================================================
   STUDENT NAME
===================================================== */

function getStudentName() {

    return getData(
        "student_name",
        ""
    );

}


function setupStudentName() {

    let name =
        getStudentName();


    if (name) {

        updateStudentDisplay(
            name
        );

        $("welcomeModal")
            .classList
            .add("hidden");


        return;

    }


    $("welcomeModal")
        .classList
        .remove("hidden");

}


function updateStudentDisplay(name) {

    $("topStudentName")
        .textContent =
        name;


    let firstLetter =
        name
            .trim()
            .charAt(0)
            .toUpperCase();


    $("studentAvatar")
        .textContent =
        firstLetter;


    $("studentNameInput").value =
        name;

}


/* =====================================================
   SAVE STUDENT NAME
===================================================== */

function saveStudentName() {

    let input =
        $("studentNameInput");


    let name =
        input.value.trim();


    if (!name) {

        $("nameError")
            .textContent =
            "Please enter your name.";

        input.focus();

        return;

    }


    if (name.length < 2) {

        $("nameError")
            .textContent =
            "Please enter at least 2 characters.";

        input.focus();

        return;

    }


    $("nameError")
        .textContent =
        "";


    saveData(
        "student_name",
        name
    );


    updateStudentDisplay(
        name
    );


    $("welcomeModal")
        .classList
        .add("hidden");


    addActivity(
        "Joined Darshan Academy"
    );


    showToast(
        "Welcome to DS Academy, " +
        name +
        "!"
    );

}


/* =====================================================
   NAVIGATION
===================================================== */

function showSection(sectionId) {

    document
        .querySelectorAll(".page-section")
        .forEach(function (section) {

            section.classList.remove(
                "active"
            );

        });


    let section =
        $(sectionId);


    if (!section) {
        return;
    }


    section.classList.add(
        "active"
    );


    document
        .querySelectorAll(".nav-btn")
        .forEach(function (button) {

            button.classList.remove(
                "active"
            );

        });


    let selected =
        document.querySelector(
            '.nav-btn[data-section="' +
            sectionId +
            '"]'
        );


    if (selected) {

        selected.classList.add(
            "active"
        );

    }


    window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        }
    );

}


/* =====================================================
   ACTIVITY
===================================================== */

function addActivity(message) {

    let activities =
        getData(
            "activity",
            []
        );


    activities.unshift({

        message: message,

        time:
            new Date().toLocaleString()

    });


    if (activities.length > 20) {

        activities =
            activities.slice(
                0,
                20
            );

    }


    saveData(
        "activity",
        activities
    );


    updateJourney();

}


/* =====================================================
   JOURNEY
===================================================== */

function updateJourney() {

    let activities =
        getData(
            "activity",
            []
        );


    let saved =
        getData(
            "saved",
            []
        );


    let practice =
        getData(
            "practice_count",
            0
        );


    $("practiceCount")
        .textContent =
        practice;


    $("savedCount")
        .textContent =
        saved.length;


    /*
        Simple learning-day calculation.
    */

    let uniqueDays = [];


    activities.forEach(
        function (item) {

            let date =
                new Date(
                    item.time
                );


            let day =
                date.toDateString();


            if (
                !uniqueDays.includes(day)
            ) {

                uniqueDays.push(day);

            }

        }
    );


    $("streakCount")
        .textContent =
        uniqueDays.length;


    let progress =
        Math.min(
            100,
            activities.length * 5
        );


    $("progressFill")
        .style.width =
        progress + "%";


    $("progressPercent")
        .textContent =
        progress + "%";


    let list =
        $("activityList");


    if (
        !activities.length
    ) {

        list.innerHTML =
`
<div class="empty-question">
    Start learning to see your activity here.
</div>
`;

        return;

    }


    list.innerHTML = "";


    activities
        .slice(0, 10)
        .forEach(
            function (item) {

                let row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "activity-item";


                row.innerHTML =
`
<span>
    ${escapeHtml(item.message)}
</span>

<small>
    ${escapeHtml(item.time)}
</small>
`;


                list.appendChild(
                    row
                );

            }
        );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   THEME
===================================================== */

function setupTheme() {

    let theme =
        getData(
            "theme",
            "dark"
        );


    if (theme === "light") {

        document.body.classList.add(
            "light"
        );

        $("themeBtn")
            .textContent =
            "☀";

    } else {

        document.body.classList.remove(
            "light"
        );

        $("themeBtn")
            .textContent =
            "☾";

    }

}


function toggleTheme() {

    let isLight =
        document.body.classList.toggle(
            "light"
        );


    if (isLight) {

        $("themeBtn")
            .textContent =
            "☀";


        saveData(
            "theme",
            "light"
        );

    } else {

        $("themeBtn")
            .textContent =
            "☾";


        saveData(
            "theme",
            "dark"
        );

    }

}


/* =====================================================
   AI ASSISTANT
===================================================== */

function getAIAnswer(question) {

    let text =
        question
            .toLowerCase()
            .trim();


    if (!text) {

        return "Please type your doubt first.";

    }


    if (
        text.includes("html")
    ) {

        return `
HTML stands for HyperText Markup Language.

HTML is used to create the structure of a webpage.

For example:

<h1>Hello</h1>

creates a heading.

<p>Hello</p>

creates a paragraph.

Think of HTML as the structure of a house.
`;

    }


    if (
        text.includes("css")
    ) {

        return `
CSS stands for Cascading Style Sheets.

CSS is used to style HTML elements.

For example:

h1 {
    color: red;
}

This changes the text color of the h1 element.

Think of CSS as the design of a house.
`;

    }


    if (
        text.includes("javascript") ||
        text.includes("js")
    ) {

        return `
JavaScript is used to add behaviour and functionality
to a webpage.

For example:

button.onclick = function() {
    alert("Hello!");
};

JavaScript can respond to clicks,
change HTML, modify CSS and perform calculations.
`;

    }


    if (
        text.includes("python")
    ) {

        return `
Python is a programming language known for
simple and readable syntax.

Example:

name = "Darshan"

print(name)

Python is commonly used for programming,
automation, data science, AI and Machine Learning.
`;

    }


    if (
        text.includes("div")
    ) {

        return `
The <div> element is a container.

It is commonly used to group HTML elements
so that you can style or control them together.

Example:

<div>
    <h1>Hello</h1>
    <p>Welcome</p>
</div>
`;

    }


    if (
        text.includes("class")
    ) {

        return `
A class is used to identify one or more
HTML elements.

Example:

<p class="title">
    Hello
</p>

Then CSS can target it:

.title {
    color: blue;
}
`;

    }


    if (
        text.includes("id")
    ) {

        return `
An id identifies a specific HTML element.

Example:

<h1 id="heading">
    Hello
</h1>

CSS:

#heading {
    color: red;
}

An id should normally be unique on a page.
`;

    }


    if (
        text.includes("bootstrap")
    ) {

        return `
Bootstrap is a CSS framework.

It provides ready-made classes and components
that help developers create responsive websites faster.

You can add Bootstrap using its CDN link
inside the HTML head section.
`;

    }


    if (
        text.includes("error") ||
        text.includes("not working")
    ) {

        return `
Let's debug it step by step.

1. Check the browser console.
2. Check the spelling of HTML tags.
3. Check your CSS selectors.
4. Check whether your JavaScript runs after
   the HTML element exists.
5. Use Run Code again.

If you send me the code,
you can check the exact problem.
`;

    }


    return `
I understand your question.

Try breaking the problem into smaller parts.

For coding doubts, check:

1. HTML structure
2. CSS selectors
3. JavaScript logic
4. Browser console errors
5. Whether the correct file is connected

You can also ask me specifically about
HTML, CSS, JavaScript, Python or AI/ML.
`;

}


function askAI() {

    let question =
        $("aiQuestion")
            .value
            .trim();


    if (!question) {

        $("aiAnswer").textContent =
            "Please type your doubt first.";

        return;

    }


    $("aiAnswer").textContent =
        "Thinking...";


    setTimeout(
        function () {

            let answer =
                getAIAnswer(
                    question
                );


            $("aiAnswer")
                .textContent =
                answer;


            addActivity(
                "Asked a question to AI Assistant"
            );

        },
        350
    );

}


/* =====================================================
   INSTRUCTOR QUESTIONS
===================================================== */

function loadQuestions() {

    let questions =
        getData(
            "doubts",
            []
        );


    let list =
        $("questionList");


    if (
        !questions.length
    ) {

        list.innerHTML =
`
<div class="empty-question">
    Your questions will appear here.
</div>
`;

        return;

    }


    list.innerHTML = "";


    questions.forEach(
        function (item) {

            let div =
                document.createElement(
                    "div"
                );


            div.className =
                "question-item";


            div.innerHTML =
`
<p>
    ${escapeHtml(item.question)}
</p>

<small>
    ${escapeHtml(item.time)}
</small>
`;


            list.appendChild(
                div
            );

        }
    );

}


function sendInstructorQuestion() {

    let input =
        $("instructorQuestion");


    let question =
        input.value.trim();


    if (!question) {

        showToast(
            "Please write your doubt first."
        );

        return;

    }


    let questions =
        getData(
            "doubts",
            []
        );


    questions.unshift({

        question: question,

        time:
            new Date().toLocaleString()

    });


    saveData(
        "doubts",
        questions
    );


    input.value = "";


    loadQuestions();


    addActivity(
        "Asked a doubt to instructor"
    );


    showToast(
        "Your doubt has been saved."
    );

}


/* =====================================================
   QUICK NOTES
===================================================== */

function loadQuickNotes() {

    let notes =
        getData(
            "quick_notes",
            ""
        );


    $("quickNotes")
        .value =
        notes;

}


function saveQuickNotes() {

    let notes =
        $("quickNotes")
            .value;


    saveData(
        "quick_notes",
        notes
    );


    $("notesSavedMessage")
        .textContent =
        "Notes saved successfully.";


    setTimeout(
        function () {

            $("notesSavedMessage")
                .textContent =
                "";

        },
        2500
    );

}


/* =====================================================
   COPY CODE
===================================================== */

function copyCurrentCode() {

    if (!codeMirrorReady) {
        return;
    }


    let code;


    if (
        currentLanguage === "html"
    ) {

        code =
            editors.html.getValue();

    }


    if (
        currentLanguage === "css"
    ) {

        code =
            editors.css.getValue();

    }


    if (
        currentLanguage === "javascript"
    ) {

        code =
            editors.javascript.getValue();

    }


    navigator.clipboard
        .writeText(code)
        .then(
            function () {

                showToast(
                    "Code copied!"
                );

            }
        )
        .catch(
            function () {

                showToast(
                    "Unable to copy code."
                );

            }
        );

}


/* =====================================================
   CLEAR CURRENT CODE
===================================================== */

function clearCurrentCode() {

    if (!codeMirrorReady) {
        return;
    }


    if (
        currentLanguage === "html"
    ) {

        editors.html.setValue("");

    }


    if (
        currentLanguage === "css"
    ) {

        editors.css.setValue("");

    }


    if (
        currentLanguage === "javascript"
    ) {

        editors.javascript.setValue("");

    }


    runCode();

}


/* =====================================================
   RESET CODE
===================================================== */

function resetCode() {

    if (!codeMirrorReady) {
        return;
    }


    editors.html.setValue(
        DEFAULT_CODE.html
    );


    editors.css.setValue(
        DEFAULT_CODE.css
    );


    editors.javascript.setValue(
        DEFAULT_CODE.javascript
    );


    runCode();


    showToast(
        "Code reset."
    );

}


/* =====================================================
   SUGGESTIONS
===================================================== */

function showSuggestions() {

    if (!codeMirrorReady) {
        return;
    }


    if (
        currentLanguage !== "html"
    ) {

        showToast(
            "Suggestions are currently available for HTML."
        );

        return;

    }


    let editor =
        editors.html;


    editor.showHint(
        {
            completeSingle: false
        }
    );

}


/* =====================================================
   PRACTICE COUNT
===================================================== */

function increasePracticeCount() {

    let count =
        getData(
            "practice_count",
            0
        );


    count++;


    saveData(
        "practice_count",
        count
    );


    updateJourney();

}


/* =====================================================
   LANGUAGE SELECTOR
===================================================== */

function changeLanguage() {

    let select =
        $("languageSelect");


    if (!select) {
        return;
    }


    let language =
        select.value;


    if (
        language === "html"
    ) {

        showEditor("html");

        return;

    }


    if (
        language === "css"
    ) {

        showEditor("css");

        return;

    }


    if (
        language === "javascript"
    ) {

        showEditor("javascript");

        return;

    }


    /*
        Important limitation:

        GitHub Pages is a static website.

        Python, C, C++, Java and MySQL need
        a compiler/server/backend to actually run.

        Therefore we do not pretend they can run
        inside this browser-only playground.
    */

    showToast(
        language.toUpperCase() +
        " editor selected. Running this language requires a compiler/backend."
    );

}


/* =====================================================
   NAVIGATION BUTTON EVENTS
===================================================== */

function setupNavigation() {

    document
        .querySelectorAll(".nav-btn")
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        let section =
                            button.dataset.section;


                        showSection(
                            section
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


/* =====================================================
   PLAYGROUND EVENTS
===================================================== */

function setupPlayground() {

    document
        .querySelectorAll(".editor-tab")
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        showEditor(
                            button.dataset.language
                        );

                    }
                );

            }
        );


    $("runBtn")
        .addEventListener(
            "click",
            function () {

                runCode();

                increasePracticeCount();

            }
        );


    $("publishBtn")
        .addEventListener(
            "click",
            function () {

                publishWebsite();

            }
        );


    $("copyBtn")
        .addEventListener(
            "click",
            function () {

                copyCurrentCode();

            }
        );


    $("clearBtn")
        .addEventListener(
            "click",
            function () {

                clearCurrentCode();

            }
        );


    $("resetBtn")
        .addEventListener(
            "click",
            function () {

                resetCode();

            }
        );


    $("suggestBtn")
        .addEventListener(
            "click",
            function () {

                showSuggestions();

            }
        );


    $("languageSelect")
        .addEventListener(
            "change",
            function () {

                changeLanguage();

            }
        );

}


/* =====================================================
   GENERAL EVENTS
===================================================== */

function setupEvents() {

    $("continueBtn")
        .addEventListener(
            "click",
            function () {

                saveStudentName();

            }
        );


    $("studentNameInput")
        .addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    saveStudentName();

                }

            }
        );


    $("themeBtn")
        .addEventListener(
            "click",
            function () {

                toggleTheme();

            }
        );


    $("askAiBtn")
        .addEventListener(
            "click",
            function () {

                askAI();

            }
        );


    $("sendInstructorBtn")
        .addEventListener(
            "click",
            function () {

                sendInstructorQuestion();

            }
        );


    $("saveNotesBtn")
        .addEventListener(
            "click",
            function () {

                saveQuickNotes();

            }
        );

}


/* =====================================================
   START APPLICATION
===================================================== */

function startAcademy() {

    /*
        First check whether this URL is a
        published student website.

        If yes, DO NOT load the Academy dashboard.
    */

    let isPublished =
        loadPublishedWebsite();


    if (isPublished) {

        return;

    }


    setupTheme();

    setupStudentName();

    setupNavigation();

    setupEvents();

    setupPlayground();

    loadQuestions();

    loadQuickNotes();

    updateJourney();


    /*
        CodeMirror loads from CDN.
        Wait a little before creating editors.
    */

    setTimeout(
        function () {

            createEditors();

        },
        300
    );

}


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        startAcademy();

    }
);
