/* =========================================================
   DARSHAN ACADEMY
   Complete Website Script
   ========================================================= */

"use strict";

/* ---------------------------------------------------------
   BASIC DATA
--------------------------------------------------------- */

const ACADEMY_URL = "https://darshandboss083-cpu.github.io/darshan-academy/";

const defaultCode = {
  html: `<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <h1>Hello Darshan Academy!</h1>
  <p>Start building your website.</p>
  <button onclick="sayHello()">Click Me</button>
</body>
</html>`,

  css: `body {
  font-family: Arial, sans-serif;
  background: #f5f5ff;
  padding: 40px;
}

h1 {
  color: #635bff;
}`,

  javascript: `function sayHello() {
  alert("Hello from Darshan Academy!");
}

console.log("JavaScript is working!");`,

  python310: `print("Hello Darshan Academy!")

name = "Student"
print("Welcome", name)`,

  python38ml: `# Python 3.8 ML example

data = [1, 2, 3, 4, 5]
print("Data:", data)`,

  python39: `print("Python 3.9 is ready!")

for i in range(5):
    print(i)`,

  c: `#include <stdio.h>

int main() {
    printf("Hello Darshan Academy!");
    return 0;
}`,

  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello Darshan Academy!";
    return 0;
}`,

  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello Darshan Academy!");
    }
}`,

  mysql: `CREATE TABLE students (
    id INT,
    name VARCHAR(50)
);

SELECT * FROM students;`
};

const languageNames = {
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
  python310: "Python 3.10",
  python38ml: "Python 3.8 (ML)",
  python39: "Python 3.9",
  c: "C",
  cpp: "C++",
  java: "Java",
  mysql: "MySQL"
};

let currentLanguage = "html";
let editor = null;

/* ---------------------------------------------------------
   LOCAL STORAGE STATE
--------------------------------------------------------- */

let state = JSON.parse(localStorage.getItem("darshanAcademyState") || "null") || {
  name: "",
  firstOpen: null,
  lastOpen: null,
  streak: 0,
  longestStreak: 0,
  daysOpened: 0,
  codingPractice: 0,
  lessons: 0,
  videosWatched: 0,
  notesOpened: 0,
  doubtsAsked: 0,
  aiQuestions: 0,
  saved: [],
  doubts: [],
  activities: [],
  code: { ...defaultCode }
};

function saveState() {
  localStorage.setItem("darshanAcademyState", JSON.stringify(state));
}

function todayString() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function daysBetween(a, b) {
  const first = new Date(a);
  const second = new Date(b);
  return Math.round((second - first) / 86400000);
}

/* ---------------------------------------------------------
   ACTIVITY / JOURNEY
--------------------------------------------------------- */

function addActivity(text, icon = "✓") {
  state.activities.unshift({
    text,
    icon,
    date: new Date().toLocaleString()
  });

  state.activities = state.activities.slice(0, 12);
  saveState();
  updateJourney();
}

function registerOpen() {
  const today = todayString();

  if (!state.firstOpen) {
    state.firstOpen = today;
    state.daysOpened = 1;
    state.streak = 1;
    state.longestStreak = 1;
  } else if (state.lastOpen !== today) {
    state.daysOpened++;

    if (state.lastOpen) {
      const gap = daysBetween(state.lastOpen, today);

      if (gap === 1) {
        state.streak++;
      } else {
        state.streak = 1;
      }

      state.longestStreak = Math.max(
        state.longestStreak,
        state.streak
      );
    } else {
      state.streak = 1;
    }
  }

  state.lastOpen = today;
  saveState();
}

function calculateProgress() {
  let points = 0;

  if (state.name) points += 10;
  if (state.daysOpened >= 2) points += 10;
  if (state.codingPractice >= 1) points += 15;
  if (state.codingPractice >= 5) points += 10;
  if (state.videosWatched >= 1) points += 10;
  if (state.videosWatched >= 3) points += 10;
  if (state.notesOpened >= 1) points += 10;
  if (state.doubtsAsked >= 1) points += 5;
  if (state.aiQuestions >= 1) points += 10;

  return Math.min(points, 100);
}

function updateJourney() {
  const progress = calculateProgress();

  setText("homeStreak", state.streak);
  setText("homePractice", state.codingPractice);
  setText("homeVideos", state.videosWatched);
  setText("homeProgress", progress + "%");

  setText("journeyStreak", state.streak);
  setText("journeyLongest", state.longestStreak);
  setText("journeyDays", state.daysOpened);
  setText("journeyCoding", state.codingPractice);
  setText("journeyVideos", state.videosWatched);
  setText("journeyDoubts", state.doubtsAsked);

  setText("journeyProgress", progress + "%");

  const progressBar = document.getElementById("journeyProgressBar");
  if (progressBar) {
    progressBar.style.width = progress + "%";
  }

  const name = state.name || "Student";

  setText("journeyName", name);
  setText("journeyAvatar", firstLetter(name));

  renderActivities();
  updateBadges();
}

function renderActivities() {
  const box = document.getElementById("activityList");
  if (!box) return;

  if (!state.activities.length) {
    box.innerHTML = `
      <div class="empty-activity">
        Your learning activity will appear here.
      </div>
    `;
    return;
  }

  box.innerHTML = state.activities
    .slice(0, 7)
    .map(item => `
      <div class="activity-item">
        <div class="activity-icon">${escapeHtml(item.icon)}</div>
        <div>
          <strong>${escapeHtml(item.text)}</strong>
          <small>${escapeHtml(item.date)}</small>
        </div>
      </div>
    `)
    .join("");
}

function updateBadges() {
  unlock("badgeStarter", Boolean(state.name));
  unlock("badgeCoder", state.codingPractice >= 1);
  unlock("badgeLearner", state.videosWatched >= 1);
  unlock("badgeStreak", state.streak >= 7);
}

function unlock(id, yes) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.toggle("unlocked", yes);
  }
}

/* ---------------------------------------------------------
   NAME POPUP
--------------------------------------------------------- */

function setupNamePopup() {
  const overlay = document.getElementById("welcomeOverlay");
  const input = document.getElementById("studentNameInput");
  const button = document.getElementById("startLearningBtn");

  if (state.name) {
    overlay.classList.add("hide");
    setTimeout(() => {
      overlay.style.display = "none";
    }, 600);
    updateStudentName();
  }

  button.addEventListener("click", saveStudentName);

  input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      saveStudentName();
    }
  });
}

function saveStudentName() {
  const input = document.getElementById("studentNameInput");
  const name = input.value.trim();

  if (!name) {
    input.classList.add("shake");

    setTimeout(() => {
      input.classList.remove("shake");
    }, 400);

    showToast("Please enter your name.");
    return;
  }

  state.name = name;
  saveState();

  updateStudentName();
  addActivity("Started learning at Darshan Academy", "🌱");

  const overlay = document.getElementById("welcomeOverlay");
  overlay.classList.add("hide");

  setTimeout(() => {
    overlay.style.display = "none";
  }, 600);

  showToast("Welcome, " + name + "! 🚀");
}

function updateStudentName() {
  const name = state.name || "Student";

  setText("sideStudentName", name);
  setText("topStudentName", name);
  setText("aiStudentName", name);
  setText("journeyName", name);

  setText("profileAvatar", firstLetter(name));
  setText("topAvatar", firstLetter(name));
  setText("journeyAvatar", firstLetter(name));

  const title = document.getElementById("pageTitle");
  if (title && document.getElementById("home").classList.contains("active")) {
    title.textContent = "Welcome back, " + name + "!";
  }
}

function firstLetter(name) {
  return name.charAt(0).toUpperCase();
}

/* ---------------------------------------------------------
   NAVIGATION
--------------------------------------------------------- */

const pageTitles = {
  home: ["DASHBOARD", "Welcome back!"],
  courses: ["LEARNING", "Courses"],
  videos: ["CLASSROOM", "Videos"],
  notes: ["RESOURCES", "Notes & PDFs"],
  playground: ["PRACTICE", "Coding Playground"],
  saved: ["LIBRARY", "Saved"],
  doubt: ["SUPPORT", "Ask a Doubt"],
  ai: ["AI LEARNING", "AI Assistant"],
  journey: ["PROGRESS", "My Journey"]
};

function showSection(sectionId) {
  document.querySelectorAll(".page-section").forEach(section => {
    section.classList.remove("active");
  });

  const target = document.getElementById(sectionId);

  if (target) {
    target.classList.add("active");
  }

  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.classList.toggle(
      "active",
      btn.dataset.section === sectionId
    );
  });

  const info = pageTitles[sectionId] || ["DARSHAN ACADEMY", "Darshan Academy"];

  setText("pageKicker", info[0]);

  if (sectionId === "home" && state.name) {
    setText("pageTitle", "Welcome back, " + state.name + "!");
  } else {
    setText("pageTitle", info[1]);
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  closeMobileMenu();

  if (sectionId === "playground") {
    setTimeout(() => {
      if (editor) editor.refresh();
    }, 100);
  }
}

function setupNavigation() {
  document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => {
      showSection(button.dataset.section);
    });
  });

  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => {
      showSection(button.dataset.go);
    });
  });
}

/* ---------------------------------------------------------
   MOBILE MENU
--------------------------------------------------------- */

function setupMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("mobileOverlay");

  menu.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    overlay.style.display = sidebar.classList.contains("open")
      ? "block"
      : "none";
  });

  overlay.addEventListener("click", closeMobileMenu);
}

function closeMobileMenu() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("mobileOverlay");

  sidebar.classList.remove("open");
  overlay.style.display = "none";
}

/* ---------------------------------------------------------
   CODING PLAYGROUND
--------------------------------------------------------- */

const suggestionData = {

  html: [
    "html",
    "head",
    "title",
    "body",
    "div",
    "section",
    "header",
    "footer",
    "main",
    "nav",
    "h1",
    "h2",
    "h3",
    "p",
    "span",
    "a",
    "img",
    "button",
    "input",
    "form",
    "label",
    "ul",
    "ol",
    "li",
    "table",
    "tr",
    "td",
    "class",
    "id",
    "href",
    "src",
    "alt",
    "onclick",
    "placeholder"
  ],

  css: [
    "color",
    "background",
    "background-color",
    "font-size",
    "font-family",
    "font-weight",
    "width",
    "height",
    "margin",
    "padding",
    "border",
    "border-radius",
    "display",
    "flex",
    "grid",
    "justify-content",
    "align-items",
    "text-align",
    "position",
    "top",
    "right",
    "bottom",
    "left",
    "box-shadow",
    "opacity",
    "line-height",
    "gap",
    "cursor",
    "transition"
  ],

  javascript: [
    "const",
    "let",
    "var",
    "function",
    "return",
    "if",
    "else",
    "for",
    "while",
    "switch",
    "case",
    "break",
    "continue",
    "true",
    "false",
    "null",
    "document",
    "querySelector",
    "getElementById",
    "addEventListener",
    "innerHTML",
    "textContent",
    "console.log",
    "alert",
    "Math",
    "Array",
    "Object"
  ],

  python310: [
    "print",
    "input",
    "def",
    "return",
    "if",
    "elif",
    "else",
    "for",
    "while",
    "in",
    "range",
    "list",
    "dict",
    "tuple",
    "set",
    "class",
    "import",
    "from",
    "as",
    "True",
    "False",
    "None"
  ],

  python38ml: [
    "import",
    "numpy",
    "pandas",
    "sklearn",
    "tensorflow",
    "keras",
    "model",
    "fit",
    "predict",
    "train_test_split",
    "accuracy_score",
    "DataFrame",
    "array",
    "print",
    "def",
    "return"
  ],

  python39: [
    "print",
    "input",
    "def",
    "return",
    "if",
    "elif",
    "else",
    "for",
    "while",
    "range",
    "import",
    "class",
    "True",
    "False",
    "None"
  ],

  c: [
    "#include",
    "stdio.h",
    "stdlib.h",
    "int",
    "char",
    "float",
    "double",
    "void",
    "main",
    "printf",
    "scanf",
    "if",
    "else",
    "for",
    "while",
    "return"
  ],

  cpp: [
    "#include",
    "iostream",
    "using namespace",
    "std",
    "cout",
    "cin",
    "string",
    "vector",
    "int",
    "float",
    "double",
    "if",
    "else",
    "for",
    "while",
    "return",
    "class"
  ],

  java: [
    "public",
    "private",
    "protected",
    "class",
    "static",
    "void",
    "int",
    "double",
    "String",
    "boolean",
    "if",
    "else",
    "for",
    "while",
    "return",
    "System.out.println",
    "new"
  ],

  mysql: [
    "SELECT",
    "FROM",
    "WHERE",
    "INSERT INTO",
    "VALUES",
    "UPDATE",
    "DELETE",
    "CREATE TABLE",
    "ALTER TABLE",
    "DROP TABLE",
    "JOIN",
    "ORDER BY",
    "GROUP BY",
    "LIMIT",
    "AND",
    "OR",
    "PRIMARY KEY",
    "INT",
    "VARCHAR"
  ]
};

function setupEditor() {

  editor = CodeMirror.fromTextArea(
    document.getElementById("codeEditor"),
    {
      theme: "material-darker",
      lineNumbers: true,
      lineWrapping: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      tabSize: 2,
      indentUnit: 2,
      mode: "htmlmixed",
      extraKeys: {
        "Ctrl-Space": showSuggestions,
        "Cmd-Space": showSuggestions
      }
    }
  );

  editor.setValue(state.code.html);

  editor.on("change", () => {
    state.code[currentLanguage] = editor.getValue();
    saveState();

    if (
      currentLanguage === "html" ||
      currentLanguage === "css" ||
      currentLanguage === "javascript"
    ) {
      updatePreview();
    }
  });

  setupHtmlAutoClose();
  setupPlaygroundControls();
  updateEditorMode();
  updatePreview();
}

/* ---------------------------------------------------------
   LANGUAGE / EDITOR
--------------------------------------------------------- */

function setupPlaygroundControls() {

  document.getElementById("languageSelect")
    .addEventListener("change", event => {
      switchLanguage(event.target.value);
    });

  document.querySelectorAll(".code-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const lang = tab.dataset.codeTab;

      if (
        lang === "html" ||
        lang === "css" ||
        lang === "javascript"
      ) {
        switchLanguage(lang);

        document.getElementById("languageSelect").value = lang;
      }
    });
  });

  document.getElementById("runCodeBtn")
    .addEventListener("click", () => {

      state.codingPractice++;
      saveState();

      addActivity(
        "Practiced " + languageNames[currentLanguage],
        "⌘"
      );

      if (
        currentLanguage === "html" ||
        currentLanguage === "css" ||
        currentLanguage === "javascript"
      ) {
        updatePreview();
        showToast("Code executed successfully.");
      } else {
        showToast(
          languageNames[currentLanguage] +
          " needs a backend compiler."
        );
      }

      updateJourney();
    });

  document.getElementById("refreshPreview")
    .addEventListener("click", updatePreview);

  document.getElementById("suggestBtn")
    .addEventListener("click", showSuggestions);

  document.getElementById("copyCodeBtn")
    .addEventListener("click", copyCode);

  document.getElementById("clearCodeBtn")
    .addEventListener("click", clearCode);

  document.getElementById("resetCodeBtn")
    .addEventListener("click", resetCode);

  document.getElementById("saveCodeBtn")
    .addEventListener("click", saveCurrentCode);

  document.getElementById("publishBtn")
    .addEventListener("click", createPublishLink);

  document.getElementById("closePublish")
    .addEventListener("click", closePublish);

  document.getElementById("copyPublishLink")
    .addEventListener("click", copyPublishLink);

  document.getElementById("openPublished")
    .addEventListener("click", openPublished);

  editor.on("keydown", (cm, event) => {
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "space"
    ) {
      event.preventDefault();
      showSuggestions();
    }
  });
}

function switchLanguage(language) {

  state.code[currentLanguage] = editor.getValue();
  currentLanguage = language;

  saveState();

  editor.setValue(state.code[language] || defaultCode[language]);

  updateEditorMode();

  document.getElementById("languageSelect").value = language;
  setText(
    "currentLanguage",
    languageNames[language].toUpperCase()
  );

  document.querySelectorAll(".code-tab").forEach(tab => {
    tab.classList.toggle(
      "active",
      tab.dataset.codeTab === language
    );
  });

  updatePreview();

  setTimeout(() => {
    editor.focus();
  }, 50);
}

function updateEditorMode() {

  let mode = "text/plain";

  if (currentLanguage === "html") {
    mode = "htmlmixed";
  } else if (currentLanguage === "css") {
    mode = "css";
  } else if (currentLanguage === "javascript") {
    mode = "javascript";
  } else if (
    currentLanguage === "python310" ||
    currentLanguage === "python38ml" ||
    currentLanguage === "python39"
  ) {
    mode = "python";
  } else if (
    currentLanguage === "c" ||
    currentLanguage === "cpp" ||
    currentLanguage === "java"
  ) {
    mode = "text/x-csrc";
  } else if (currentLanguage === "mysql") {
    mode = "text/x-sql";
  }

  editor.setOption("mode", mode);

  setText(
    "currentLanguage",
    languageNames[currentLanguage].toUpperCase()
  );

  const backendMessage =
    document.getElementById("backendMessage");

  const browserLanguage =
    currentLanguage === "html" ||
    currentLanguage === "css" ||
    currentLanguage === "javascript";

  backendMessage.classList.toggle(
    "show",
    !browserLanguage
  );
}

/* ---------------------------------------------------------
   REAL SUGGESTIONS
--------------------------------------------------------- */

function showSuggestions() {

  if (!editor) return;

  const list = suggestionData[currentLanguage] || [];

  const cursor = editor.getCursor();
  const line = editor.getLine(cursor.line);

  const before = line.slice(0, cursor.ch);

  const match = before.match(/[A-Za-z_#.-][\w#.-]*$/);
  const typed = match ? match[0] : "";

  const filtered = list
    .filter(item => {
      if (!typed) return true;

      return item
        .toLowerCase()
        .startsWith(typed.toLowerCase());
    })
    .slice(0, 30);

  if (!filtered.length) {
    showToast("No suggestions found.");
    return;
  }

  CodeMirror.showHint(
    editor,
    () => {

      const from = CodeMirror.Pos(
        cursor.line,
        cursor.ch - typed.length
      );

      const to = CodeMirror.Pos(
        cursor.line,
        cursor.ch
      );

      return {
        list: filtered,
        from,
        to
      };
    },
    {
      completeSingle: false
    }
  );
}

/* ---------------------------------------------------------
   HTML AUTOMATIC CLOSING TAG
--------------------------------------------------------- */

function setupHtmlAutoClose() {

  let changing = false;

  editor.on("change", (cm, change) => {

    if (changing) return;
    if (currentLanguage !== "html") return;
    if (change.origin !== "+input") return;

    const text = cm.getValue();
    const cursor = cm.getCursor();

    if (cursor.ch === 0) return;

    const line = cm.getLine(cursor.line);
    const previousChar = line[cursor.ch - 1];

    if (previousChar !== ">") return;

    const before = line.slice(0, cursor.ch);

    const match = before.match(
      /<([A-Za-z][A-Za-z0-9-]*)(?:\s[^<>]*)?>$/
    );

    if (!match) return;

    const tag = match[1].toLowerCase();

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

    if (voidTags.includes(tag)) return;

    const after = cm.getRange(
      cursor,
      CodeMirror.Pos(cursor.line, cursor.ch + 2)
    );

    if (after.startsWith("</" + tag)) return;

    changing = true;

    cm.replaceRange(
      `</${tag}>`,
      cursor
    );

    cm.setCursor(cursor);

    changing = false;
  });
}

/* ---------------------------------------------------------
   CODE ACTIONS
--------------------------------------------------------- */

function clearCode() {

  if (!editor) return;

  editor.setValue("");

  state.code[currentLanguage] = "";
  saveState();

  updatePreview();
  showToast("Code cleared.");
}

function resetCode() {

  if (!editor) return;

  editor.setValue(defaultCode[currentLanguage]);

  state.code[currentLanguage] =
    defaultCode[currentLanguage];

  saveState();

  updatePreview();
  showToast("Code reset.");
}

function saveCurrentCode() {

  const title =
    languageNames[currentLanguage] + " Code";

  if (!state.saved.includes(title)) {
    state.saved.push(title);
  }

  saveState();
  renderSaved();

  addActivity(
    "Saved " + title,
    "☆"
  );

  showToast("Code saved.");
}

async function copyCode() {

  try {
    await navigator.clipboard.writeText(
      editor.getValue()
    );

    showToast("Code copied.");
  } catch {
    showToast("Copy failed.");
  }
}

/* ---------------------------------------------------------
   LIVE WEBSITE PREVIEW
--------------------------------------------------------- */

function updatePreview() {

  if (!editor) return;

  const frame = document.getElementById("previewFrame");
  const message = document.getElementById("backendMessage");

  const browserLanguage =
    currentLanguage === "html" ||
    currentLanguage === "css" ||
    currentLanguage === "javascript";

  message.classList.toggle(
    "show",
    !browserLanguage
  );

  if (!browserLanguage) {
    frame.srcdoc = "";
    return;
  }

  let html = state.code.html || "";
  let css = state.code.css || "";
  let js = state.code.javascript || "";

  if (currentLanguage === "css") {
    html = `
<!DOCTYPE html>
<html>
<head>
<style>${css}</style>
</head>
<body>
  <h1>CSS Preview</h1>
  <p>Edit your CSS to style this page.</p>
  <button>Example Button</button>
</body>
</html>`;
  }

  if (currentLanguage === "javascript") {
    html = `
<!DOCTYPE html>
<html>
<head>
<style>
body {
  font-family: Arial;
  padding: 30px;
}
</style>
</head>
<body>
<h1>JavaScript Preview</h1>
<p>Open the browser console to see console output.</p>
<script>
${js.replace(/<\/script>/gi, "<\\/script>")}
<\/script>
</body>
</html>`;
  }

  if (currentLanguage === "html") {
    if (!/<html[\s>]/i.test(html)) {
      html = `
<!DOCTYPE html>
<html>
<head>
<style>
${css}
</style>
</head>
<body>
${html}
<script>
${js.replace(/<\/script>/gi, "<\\/script>")}
<\/script>
</body>
</html>`;
    } else {
      if (!/<style[\s>]/i.test(html)) {
        html = html.replace(
          /<\/head>/i,
          `<style>${css}</style></head>`
        );
      }

      if (!/<script[\s>]/i.test(html) && js.trim()) {
        html = html.replace(
          /<\/body>/i,
          `<script>${js.replace(/<\/script>/gi, "<\\/script>")}<\/script></body>`
        );
      }
    }
  }

  frame.srcdoc = html;
}

/* ---------------------------------------------------------
   PUBLISH WEBSITE
--------------------------------------------------------- */

function getProjectData() {

  return {
    html: state.code.html || "",
    css: state.code.css || "",
    javascript: state.code.javascript || "",
    title: "Student Website"
  };
}

function createPublishLink() {

  const project = getProjectData();

  try {

    const compressed =
      LZString.compressToEncodedURIComponent(
        JSON.stringify(project)
      );

    /*
      IMPORTANT:
      We deliberately use the real Academy URL.
      We NEVER use about:srcdoc here.
    */

    const url =
      ACADEMY_URL +
      "#project=" +
      compressed;

    document.getElementById("publishLink").value = url;

    document.getElementById("publishPanel")
      .classList.add("show");

  } catch (error) {
    showToast("Could not create publish link.");
  }
}

function closePublish() {
  document.getElementById("publishPanel")
    .classList.remove("show");
}

async function copyPublishLink() {

  const input =
    document.getElementById("publishLink");

  try {

    await navigator.clipboard.writeText(input.value);

    showToast("Website link copied! 🔗");

  } catch {
    input.select();
    document.execCommand("copy");
    showToast("Website link copied! 🔗");
  }
}

function openPublished() {

  const url =
    document.getElementById("publishLink").value;

  if (url) {
    window.open(url, "_blank");
  }
}

/* ---------------------------------------------------------
   LOAD PUBLISHED PROJECT
--------------------------------------------------------- */

function loadPublishedProject() {

  const hash = window.location.hash;

  if (!hash.startsWith("#project=")) {
    return;
  }

  const compressed =
    hash.substring("#project=".length);

  try {

    const json =
      LZString.decompressFromEncodedURIComponent(
        compressed
      );

    if (!json) return;

    const project = JSON.parse(json);

    /*
      IMPORTANT:
      When a shared project is opened,
      show ONLY the finished website.
      Do NOT show the academy editor.
    */

    showPublishedWebsite(project);

  } catch (error) {
    console.error(error);
    showToast("Invalid project link.");
  }
}

function showPublishedWebsite(project) {

  document.body.innerHTML = "";

  const wrapper = document.createElement("div");

  wrapper.id = "publishedWebsite";

  wrapper.innerHTML = `
    <iframe
      id="publishedFrame"
      style="
        width:100vw;
        height:100vh;
        border:0;
        display:block;
        background:white;
      "
      sandbox="allow-scripts"
    ></iframe>
  `;

  document.body.appendChild(wrapper);

  const frame =
    document.getElementById("publishedFrame");

  let html = project.html || "";

  const css = project.css || "";
  const js = project.javascript || "";

  if (!/<html[\s>]/i.test(html)) {

    html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
${css}
</style>
</head>
<body>
${html}
<script>
${js.replace(/<\/script>/gi, "<\\/script>")}
<\/script>
</body>
</html>`;
  } else {

    if (!/<style[\s>]/i.test(html)) {
      html = html.replace(
        /<\/head>/i,
        `<style>${css}</style></head>`
      );
    }

    if (js.trim()) {
      html = html.replace(
        /<\/body>/i,
        `<script>${js.replace(/<\/script>/gi, "<\\/script>")}<\/script></body>`
      );
    }
  }

  frame.srcdoc = html;
}

/* ---------------------------------------------------------
   SAVED
--------------------------------------------------------- */

function setupSaved() {

  document.querySelectorAll(".resource-save")
    .forEach(button => {

      button.addEventListener("click", () => {

        const name = button.dataset.save;

        if (state.saved.includes(name)) {

          state.saved =
            state.saved.filter(item => item !== name);

          button.classList.remove("saved");
          button.textContent = "☆";

          showToast("Removed from saved.");

        } else {

          state.saved.push(name);

          button.classList.add("saved");
          button.textContent = "★";

          addActivity(
            "Saved " + name,
            "☆"
          );

          showToast("Saved.");
        }

        state.notesOpened++;
        saveState();

        renderSaved();
        updateJourney();
      });
    });

  renderSaved();
}

function renderSaved() {

  const box =
    document.getElementById("savedList");

  if (!box) return;

  if (!state.saved.length) {

    box.innerHTML = `
      <div class="empty-state">
        <div>☆</div>
        <h3>Nothing saved yet</h3>
        <p>Save notes, resources or code to see them here.</p>
      </div>
    `;

    return;
  }

  box.innerHTML =
    state.saved.map((item,index) => `
      <div class="saved-item">
        <div>
          <strong>${escapeHtml(item)}</strong>
          <small>Saved learning resource</small>
        </div>

        <button
          class="remove-saved"
          data-index="${index}">
          Remove
        </button>
      </div>
    `).join("");

  document.querySelectorAll(".remove-saved")
    .forEach(button => {

      button.addEventListener("click", () => {

        const index =
          Number(button.dataset.index);

        state.saved.splice(index,1);
        saveState();

        renderSaved();
        updateJourney();

        showToast("Removed.");
      });
    });
}

/* ---------------------------------------------------------
   VIDEOS
--------------------------------------------------------- */

function setupVideos() {

  document.querySelectorAll(".video-watch")
    .forEach(button => {

      button.addEventListener("click", () => {

        if (!button.classList.contains("watched")) {

          button.classList.add("watched");
          button.textContent = "Watched ✓";

          state.videosWatched++;

          addActivity(
            "Watched " + button.dataset.video,
            "▶"
          );

          saveState();
          updateJourney();

          showToast("Video marked as watched.");
        }
      });
    });
}

/* ---------------------------------------------------------
   DOUBTS
--------------------------------------------------------- */

function setupDoubts() {

  const input =
    document.getElementById("doubtInput");

  const counter =
    document.getElementById("doubtCounter");

  input.addEventListener("input", () => {
    counter.textContent =
      input.value.length + " / 500";
  });

  document.getElementById("submitDoubt")
    .addEventListener("click", submitDoubt);

  renderDoubts();
}

function submitDoubt() {

  const input =
    document.getElementById("doubtInput");

  const text =
    input.value.trim();

  if (!text) {
    showToast("Please write your doubt.");
    return;
  }

  if (text.length > 500) {
    showToast("Please keep your doubt under 500 characters.");
    return;
  }

  state.doubts.unshift({
    text,
    date: new Date().toLocaleString()
  });

  state.doubtsAsked++;

  saveState();

  addActivity(
    "Asked a doubt",
    "?"
  );

  input.value = "";
  document.getElementById("doubtCounter").textContent = "0 / 500";

  renderDoubts();
  updateJourney();

  showToast("Doubt saved successfully.");
}

function renderDoubts() {

  const box =
    document.getElementById("doubtHistory");

  if (!state.doubts.length) {

    box.innerHTML = `
      <div class="empty-activity">
        No doubts asked yet.
      </div>
    `;

    return;
  }

  box.innerHTML =
    state.doubts.slice(0,10)
      .map(doubt => `
        <div class="doubt-history-item">
          <strong>${escapeHtml(doubt.text)}</strong>
          <small>${escapeHtml(doubt.date)} • Waiting for instructor reply</small>
        </div>
      `)
      .join("");
}

/* ---------------------------------------------------------
   AI ASSISTANT
--------------------------------------------------------- */

function setupAI() {

  const input =
    document.getElementById("aiInput");

  document.getElementById("sendAiBtn")
    .addEventListener("click", () => {

      askAI(input.value.trim());

    });

  input.addEventListener("keydown", event => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      askAI(input.value.trim());
    }

  });

  document.querySelectorAll("[data-ai]")
    .forEach(button => {

      button.addEventListener("click", () => {

        const question =
          button.dataset.ai;

        askAI(question);
      });
    });

  document.getElementById("clearAiChat")
    .addEventListener("click", clearAIChat);
}

function askAI(question) {

  if (!question) {
    showToast("Type a question first.");
    return;
  }

  addUserMessage(question);

  document.getElementById("aiInput").value = "";

  state.aiQuestions++;
  saveState();

  setText(
    "aiQuestions",
    state.aiQuestions
  );

  const chat =
    document.getElementById("aiChat");

  const typing =
    document.createElement("div");

  typing.className =
    "ai-message assistant-message";

  typing.innerHTML = `
    <div class="message-avatar">✦</div>
    <div class="message-content">
      <span class="message-name">DS AI</span>
      <div class="bubble">
        <span class="typing-dots">● ● ●</span>
      </div>
    </div>
  `;

  chat.appendChild(typing);
  chat.scrollTop = chat.scrollHeight;

  setTimeout(() => {

    typing.remove();

    const answer =
      generateLearningAnswer(question);

    addAssistantMessage(answer);

    addActivity(
      "Asked DS AI a question",
      "✦"
    );

    updateJourney();

  }, 700);
}

function addUserMessage(text) {

  const chat =
    document.getElementById("aiChat");

  const message =
    document.createElement("div");

  message.className =
    "ai-message user-message";

  message.innerHTML = `
    <div class="message-content">
      <span class="message-name">YOU</span>
      <div class="bubble">
        ${escapeHtml(text)}
      </div>
    </div>
    <div class="message-avatar">
      ${firstLetter(state.name || "S")}
    </div>
  `;

  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

function addAssistantMessage(text) {

  const chat =
    document.getElementById("aiChat");

  const message =
    document.createElement("div");

  message.className =
    "ai-message assistant-message";

  message.innerHTML = `
    <div class="message-avatar">✦</div>
    <div class="message-content">
      <span class="message-name">DS AI</span>
      <div class="bubble">${text}</div>
    </div>
  `;

  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

function clearAIChat() {

  const chat =
    document.getElementById("aiChat");

  chat.innerHTML = `
    <div class="ai-message assistant-message">
      <div class="message-avatar">✦</div>
      <div class="message-content">
        <span class="message-name">DS AI</span>
        <div class="bubble">
          Conversation cleared. 👋
          <br><br>
          Ask me a new learning question whenever you're ready.
        </div>
      </div>
    </div>
  `;
}

function generateLearningAnswer(question) {

  const q = question.toLowerCase();

  if (
    q.includes("html") &&
    (q.includes("explain") || q.includes("what"))
  ) {
    return `
      <strong>HTML means HyperText Markup Language.</strong>
      <br><br>
      It is used to create the structure of a webpage.
      <br><br>
      Example:
      <pre>&lt;h1&gt;Hello&lt;/h1&gt;
&lt;p&gt;Welcome to my website&lt;/p&gt;</pre>
      <br>
      <strong>Easy way to remember:</strong>
      HTML = structure of the website.
    `;
  }

  if (q.includes("css")) {
    return `
      <strong>CSS is used to style HTML.</strong>
      <br><br>
      HTML creates the element and CSS controls how it looks.
      <br><br>
      Example:
      <pre>h1 {
  color: blue;
  font-size: 30px;
}</pre>
      <br>
      <strong>Remember:</strong> HTML = structure, CSS = design.
    `;
  }

  if (
    q.includes("javascript") ||
    q.includes("java script")
  ) {
    return `
      <strong>JavaScript adds behavior to a webpage.</strong>
      <br><br>
      For example, you can use JavaScript when a user clicks a button.
      <br><br>
      <pre>function sayHello() {
  alert("Hello!");
}</pre>
      <br>
      HTML gives structure, CSS gives style and JavaScript gives interaction.
    `;
  }

  if (q.includes("python")) {
    return `
      <strong>Python is a programming language.</strong>
      <br><br>
      It is popular for programming, automation, data science, AI and machine learning.
      <br><br>
      Example:
      <pre>name = "Darshan"
print(name)</pre>
      <br>
      Start by learning variables, conditions, loops and functions.
    `;
  }

  if (
    q.includes("ai") ||
    q.includes("artificial intelligence")
  ) {
    return `
      <strong>Artificial Intelligence (AI)</strong> is the field of creating computer systems that can perform tasks that normally require human-like abilities such as recognizing patterns, understanding information and making predictions.
      <br><br>
      <strong>Simple example:</strong> A recommendation system can learn patterns from data and suggest content.
      <br><br>
      AI is a broad field. Machine Learning is one approach used within AI, and Generative AI focuses on creating new content such as text, images, audio or code.
    `;
  }

  if (
    q.includes("machine learning") ||
    q.includes("ml")
  ) {
    return `
      <strong>Machine Learning (ML)</strong> is a way of building systems that learn patterns from data.
      <br><br>
      A simple flow is:
      <br>
      <strong>Data → Learning → Model → Prediction</strong>
      <br><br>
      In supervised learning, the training data contains known answers called labels.
    `;
  }

  if (
    q.includes("function")
  ) {
    return `
      A <strong>function</strong> is a reusable block of code that performs a particular task.
      <br><br>
      JavaScript example:
      <pre>function add(a, b) {
  return a + b;
}</pre>
      <br>
      You can call it using:
      <pre>add(10, 20);</pre>
    `;
  }

  if (
    q.includes("class attribute") ||
    q.includes("class in html")
  ) {
    return `
      The HTML <strong>class</strong> attribute is used to give one or more elements a common name.
      <br><br>
      Example:
      <pre>&lt;p class="highlight"&gt;Hello&lt;/p&gt;</pre>
      <br>
      Then CSS can select it using:
      <pre>.highlight {
  color: blue;
}</pre>
      <br>
      The <strong>.</strong> before a class name is used in CSS.
    `;
  }

  if (
    q.includes("id")
  ) {
    return `
      The HTML <strong>id</strong> attribute identifies a particular element.
      <br><br>
      Example:
      <pre>&lt;section id="home"&gt;
  Home
&lt;/section&gt;</pre>
      <br>
      CSS can select it using <strong>#home</strong>.
    `;
  }

  if (
    q.includes("loop")
  ) {
    return `
      A <strong>loop</strong> repeats a block of code.
      <br><br>
      Example in JavaScript:
      <pre>for (let i = 0; i &lt; 5; i++) {
  console.log(i);
}</pre>
      <br>
      The loop runs while its condition is true.
    `;
  }

  return `
    That's a good learning question. 👍
    <br><br>
    Try breaking the topic into three parts:
    <br>
    <strong>1.</strong> What is it?
    <br>
    <strong>2.</strong> Why is it used?
    <br>
    <strong>3.</strong> Can we build a small example?
    <br><br>
    If you're learning programming, send me the exact concept or code you're confused about and I'll explain it in simple English with an example.
  `;
}

/* ---------------------------------------------------------
   TOP SAVE
--------------------------------------------------------- */

function setupTopSave() {

  document.getElementById("topSaveBtn")
    .addEventListener("click", () => {

      showSection("saved");
      showToast("Opening saved resources.");
    });
}

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

function setText(id, value) {

  const element =
    document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

function escapeHtml(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

let toastTimer;

function showToast(message) {

  const toast =
    document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2300);
}

/* ---------------------------------------------------------
   INITIALIZE
--------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  /*
    If this is a published project,
    show only the student's website.
  */

  if (window.location.hash.startsWith("#project=")) {
    loadPublishedProject();
    return;
  }

  registerOpen();

  setupNamePopup();
  setupNavigation();
  setupMobileMenu();

  setupEditor();

  setupSaved();
  setupVideos();
  setupDoubts();
  setupAI();
  setupTopSave();

  updateStudentName();
  updateJourney();
  renderSaved();

  document.getElementById("home").classList.add("active");

  setTimeout(() => {
    if (editor) {
      editor.refresh();
    }
  }, 300);
});
/* =========================
   NIGHT MODE
========================= */

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
  const savedTheme = localStorage.getItem("darshanAcademyTheme");

  if (savedTheme === "dark") {
    document.body.classList.add("night-mode");
    themeToggle.textContent = "☀️";
    themeToggle.title = "Day Mode";
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("night-mode");

    const isDark = document.body.classList.contains("night-mode");

    localStorage.setItem(
      "darshanAcademyTheme",
      isDark ? "dark" : "light"
    );

    themeToggle.textContent = isDark ? "☀️" : "🌙";
    themeToggle.title = isDark ? "Day Mode" : "Night Mode";
  });
}
