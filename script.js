(() => {

'use strict';


/* =========================
   BASIC SETTINGS
========================= */

const URL_BASE =
'https://darshandboss083-cpu.github.io/darshan-academy/';


const K = {

  name:'da_name',

  theme:'da_theme',

  activity:'da_activity',

  saved:'da_saved',

  code:'da_code',

  doubts:'da_doubts'

};


const DEF = {

  html:
`<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>

<body>

  <h1>Hello Darshan Academy!</h1>

  <p>
    Start building your website.
  </p>

</body>
</html>`,

  css:
`body {
  font-family: Arial;
  padding: 30px;
}

h1 {
  color: purple;
}`,

  javascript:
`console.log("Hello Darshan Academy!");`

};


/* =========================
   SUGGESTIONS
========================= */

const S = {

  python312:[
    'def',
    'return',
    'if',
    'elif',
    'else',
    'for',
    'while',
    'import',
    'print',
    'range',
    'list',
    'dict',
    'True',
    'False',
    'None'
  ],

  html:[
    'html',
    'head',
    'body',
    'title',
    'div',
    'section',
    'h1',
    'h2',
    'p',
    'a',
    'button',
    'img',
    'class',
    'id',
    'href',
    'src',
    'alt'
  ],

  css:[
    'display',
    'color',
    'background',
    'padding',
    'margin',
    'font-size',
    'font-family',
    'width',
    'height',
    'border',
    'border-radius',
    'box-shadow',
    'flex',
    'grid',
    'gap',
    'position'
  ],

  javascript:[
    'const',
    'let',
    'var',
    'function',
    'return',
    'if',
    'else',
    'for',
    'while',
    'document',
    'querySelector',
    'getElementById',
    'addEventListener',
    'classList',
    'innerHTML',
    'console.log'
  ],

  python310:[
    'def',
    'return',
    'if',
    'elif',
    'else',
    'for',
    'while',
    'import',
    'print',
    'range',
    'list',
    'dict',
    'True',
    'False',
    'None'
  ],

  python39:[
    'def',
    'return',
    'if',
    'else',
    'for',
    'while',
    'import',
    'print',
    'range'
  ],

  c:[
    '#include',
    'stdio.h',
    'main',
    'printf',
    'scanf',
    'int',
    'float',
    'char',
    'return',
    'if',
    'else',
    'for',
    'while'
  ],

  cpp:[
    '#include',
    'iostream',
    'vector',
    'string',
    'using',
    'namespace',
    'std',
    'cout',
    'cin',
    'class',
    'public',
    'int',
    'return'
  ],

  java:[
    'public',
    'private',
    'class',
    'static',
    'void',
    'main',
    'String',
    'int',
    'double',
    'boolean',
    'new',
    'System.out.println',
    'return'
  ],

  mysql:[
    'SELECT',
    'FROM',
    'WHERE',
    'INSERT',
    'INTO',
    'VALUES',
    'UPDATE',
    'SET',
    'DELETE',
    'CREATE',
    'TABLE',
    'JOIN',
    'GROUP BY',
    'ORDER BY',
    'LIMIT'
  ]

};


/* =========================
   CODEMIRROR MODES
========================= */

const MOD = {

  html:'text/html',

  css:'css',

  javascript:'javascript',

  python312:'python',

  python310:'python',

  python39:'python',

  c:'text/x-csrc',

  cpp:'text/x-c++src',

  csharp:'text/x-csharp',

  java:'text/x-java',

  kotlin:'text/x-java',

  go:'text/x-csrc',

  rust:'text/x-csrc',

  php:'text/x-php',

  ruby:'text/x-ruby',

  swift:'text/x-c++src',

  typescript:'javascript',

  sql:'text/x-sql',

  mysql:'text/x-mysql',

  postgresql:'text/x-sql',

  r:'text/x-rsrc',

  matlab:'text/x-octave',

  scala:'text/x-scala',

  dart:'text/x-dart',

  lua:'text/x-lua',

  perl:'text/x-perl',

  haskell:'text/x-haskell',

  shell:'shell',

  bash:'shell',

  powershell:'powershell',

  objectivec:'text/x-objectivec',

  julia:'text/x-julia',

  fortran:'text/x-fortran',

  cobol:'text/x-cobol',

  assembly:'text/x-asm'

};


/* =========================
   HELPERS
========================= */

const $ =
id => document.getElementById(id);

const all =
selector =>
[...document.querySelectorAll(selector)];


const json = (key, fallback) => {

  try {

    return JSON.parse(
      localStorage.getItem(key)
    ) ?? fallback;

  } catch {

    return fallback;

  }

};


const put = (key, value) => {

  localStorage.setItem(
    key,
    JSON.stringify(value)
  );

};


/* =========================
   TOAST
========================= */

function toast(message){

  $('toast').textContent =
    message;

  $('toast').classList.add(
    'show'
  );

  clearTimeout(
    window.tt
  );

  window.tt =
    setTimeout(
      () =>
        $('toast')
          .classList
          .remove('show'),
      2200
    );

}


/* =========================
   ACTIVITY
========================= */

function activity(){

  let a =
    json(
      K.activity,
      {
        start:
          new Date()
            .toISOString()
            .slice(0,10),

        days:[],

        actions:[],

        coding:0,

        lessons:0,

        videos:0,

        notes:0,

        doubts:0
      }
    );


  const today =
    new Date()
      .toISOString()
      .slice(0,10);


  if(
    !a.days.includes(today)
  ){

    a.days.push(today);

  }


  put(
    K.activity,
    a
  );


  return a;

}


function act(text){

  let a =
    activity();


  a.actions.unshift({

    t:text,

    d:
      new Date()
        .toLocaleString()

  });


  a.actions =
    a.actions.slice(0,15);


  put(
    K.activity,
    a
  );


  journey();

}


/* =========================
   NAVIGATION
========================= */

function nav(page){

  all('.page')
    .forEach(
      x =>
        x.classList.remove(
          'active'
        )
    );


  const selected =
    $('page-' + page);


  if(selected){

    selected.classList.add(
      'active'
    );

  }


  all('.nav')
    .forEach(
      x =>
        x.classList.toggle(
          'active',
          x.dataset.page === page
        )
    );


  $('side')
    .classList
    .remove('open');


  if(page === 'journey'){

    journey();

  }

}


all('.nav')
  .forEach(
    button =>
      button.onclick =
        () =>
          nav(
            button.dataset.page
          )
  );


all('[data-go]')
  .forEach(
    button =>
      button.onclick =
        () =>
          nav(
            button.dataset.go
          )
  );


$('mobile').onclick =
  () =>
    $('side')
      .classList
      .toggle('open');


/* =========================
   COURSES / VIDEOS / NOTES
========================= */

function renderCards(){

  const data = [

    [
      'HTML & CSS',
      'Build webpages from the basics.'
    ],

    [
      'JavaScript',
      'Learn browser logic and events.'
    ],

    [
      'Python',
      'Start programming with Python.'
    ],

    [
      'AI / ML',
      'Learn machine learning concepts.'
    ],

    [
      'Engineering',
      'Strengthen technical fundamentals.'
    ],

    [
      'Projects',
      'Turn learning into projects.'
    ]

  ];


  $('courses').innerHTML =

    data
      .map(
        (x,i) =>

        `<article class="card">

          <div class="eyebrow">
            COURSE ${i+1}
          </div>

          <h3>
            ${x[0]}
          </h3>

          <p>
            ${x[1]}
          </p>

          <button
            class="btn secondary"
            onclick="window.DA.lesson('${x[0]}')"
          >
            Open Course →
          </button>

        </article>`

      )
      .join('');


  $('videos').innerHTML =

    [
      'Welcome to Darshan Academy',
      'Web Development Lessons',
      'AI / ML Lessons'
    ]

      .map(
        x =>

        `<article class="card">

          <h3>
            ▶ ${x}
          </h3>

          <p>
            YouTube lesson placeholder —
            add your video URL here later.
          </p>

          <a
            class="btn secondary"
            target="_blank"
            href="https://youtube.com/@darshanacademy-z6c?si=i3MVR4Ne1t9wch-I"
          >
            Open YouTube ↗
          </a>

        </article>`

      )
      .join('');


  /*
    =========================================
    GOOGLE DRIVE NOTES
    =========================================
  */

  $('notes').innerHTML = [

    [
      'HTML Notes',

      'HTML elements, headings, links, images and basic structure.',

      'https://drive.google.com/drive/folders/1jleiOmq5Ty0ZIFbqoAvj0WbjYwgzuTWB'
    ],

    [
      'CSS Notes',

      'CSS selectors, colors, spacing, borders and layouts.',

      'https://drive.google.com/drive/folders/1EaAjMdErE_poAY98r8nTxtC5oqTfl5xF'
    ],

    [
      'JavaScript Notes',

      'JavaScript variables, functions, conditions, events and loops.',

      'https://drive.google.com/drive/folders/1qUehvfjD2HENVrZrQws88OBl0lPTuSwz'
    ]

  ]

  .map(

    x =>

    `<article class="card">

      <h3>
        ▤ ${x[0]}
      </h3>

      <p>
        ${x[1]}
      </p>

      <a
        class="btn secondary"
        href="${x[2]}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Open Notes ↗
      </a>

    </article>`

  )

  .join('');

}


/* =========================
   PUBLIC DA FUNCTIONS
========================= */

window.DA = {

  lesson:
    course => {

      let a =
        activity();

      a.lessons++;

      put(
        K.activity,
        a
      );

      act(
        'Opened course: ' +
        course
      );

      toast(
        'Course opened'
      );

    },


  note:
    () => {

      let a =
        activity();

      a.notes++;

      put(
        K.activity,
        a
      );

      act(
        'Opened notes'
      );

      toast(
        'Notes opened'
      );

    }

};


/* =========================
   CODE EDITOR
========================= */

let current =
  'html';


let editors =
  {};


function hint(cm, list){

  const cursor =
    cm.getCursor();


  const token =
    cm.getTokenAt(
      cursor
    );


  const word =
    token.string || '';


  CodeMirror.showHint(

    cm,

    () => ({

      list:
        list.filter(
          x =>
            x
              .toLowerCase()
              .startsWith(
                word.toLowerCase()
              )
        ),

      from:
        CodeMirror.Pos(
          cursor.line,
          token.start
        ),

      to:
        CodeMirror.Pos(
          cursor.line,
          cursor.ch
        )

    }),

    {
      completeSingle:false
    }

  );

}


/* =========================
   AUTO CLOSE HTML
========================= */

function htmlClose(cm){

  let lock =
    false;


  cm.on(
    'change',
    (m,ch) => {

      if(
        lock ||
        !ch.text ||
        ch.text[0] !== '>' ||
        ch.text.length !== 1
      ){

        return;

      }


      const pos =
        m.getCursor();


      const before =
        m
          .getLine(pos.line)
          .slice(
            0,
            pos.ch
          );


      const match =
        before.match(
          /<([A-Za-z][\w-]*)(?:\s[^<>]*)?>$/
        );


      if(!match){

        return;

      }


      const tag =
        match[1]
          .toLowerCase();


      const voidTags = [

        'br',
        'img',
        'input',
        'meta',
        'link',
        'hr',
        'area',
        'base',
        'embed',
        'source',
        'track',
        'wbr'

      ];


      if(
        voidTags.includes(tag) ||
        /\/\s*>$/.test(before)
      ){

        return;

      }


      lock =
        true;


      m.replaceRange(
        `</${tag}>`,
        pos,
        pos,
        'autoClose'
      );


      m.setCursor(
        pos
      );


      lock =
        false;

    }
  );

}


/* =========================
   CREATE EDITOR
========================= */

function create(lang){

  if(editors[lang]){

    return editors[lang];

  }


  const cm =
    CodeMirror.fromTextArea(

      $('code'),

      {

        mode:
          MOD[lang],

        theme:
          'material-darker',

        lineNumbers:
          true,

        autoCloseBrackets:
          true,

        tabSize:
          2,

        extraKeys:{

          'Ctrl-Space':
            editor =>
              hint(
                editor,
                S[lang] || []
              )

        }

      }

    );


  cm.setValue(

    json(
      K.code,
      DEF
    )[lang]

    ??
    DEF[lang]
    ??
    ''

  );


  cm.on(
    'change',
    saveCode
  );


  if(lang === 'html'){

    htmlClose(cm);

  }


  editors[lang] =
    cm;


  return cm;

}


/* =========================
   SAVE CODE
========================= */

function saveCode(){

  let o = {};


  Object.keys(editors)
    .forEach(
      key =>
        o[key] =
          editors[key]
            .getValue()
    );


  put(
    K.code,
    o
  );


  $('editorState')
    .textContent =
      'Saved locally';

}


/* =========================
   CHANGE LANGUAGE
========================= */

function language(lang){

  saveCode();


  current =
    lang;


  const cm =
    create(lang);


  all('.CodeMirror')
    .forEach(
      x =>
        x.style.display =
          'none'
    );


  cm
    .getWrapperElement()
    .style.display =
      'block';


  cm.setOption(
    'mode',
    MOD[lang]
  );


  cm.setValue(

    json(
      K.code,
      DEF
    )[lang]

    ??
    DEF[lang]
    ??
    ''

  );


  cm.clearHistory();


  cm.refresh();


  $('editorLang')
    .textContent =
      lang.toUpperCase();


  all('.tab')
    .forEach(
      x =>
        x.classList.toggle(
          'active',
          x.dataset.lang === lang
        )
    );


  const web =
    [
      'html',
      'css',
      'javascript'
    ].includes(lang);


  $('preview')
    .classList
    .toggle(
      'hidden',
      !web
    );


  $('compiler')
    .classList
    .toggle(
      'hidden',
      web
    );

}


/* =========================
   RUN WEB CODE
========================= */

function run(){

  if(
    ![
      'html',
      'css',
      'javascript'
    ].includes(current)
  ){

    toast(
      'Real execution needs a backend/compiler'
    );

    $('runStatus')
      .textContent =
        'Backend/compiler required';

    return;

  }


  const o = {

    html:
      editors.html.getValue(),

    css:
      editors.css.getValue(),

    javascript:
      editors.javascript.getValue()

  };


  let d =
    o.html;


  if(
    !/<html/i.test(d)
  ){

    d =

`<!doctype html>

<html>

<head>

<style>
${o.css}
</style>

</head>

<body>

${o.html}

<script>

${o.javascript.replace(
  /<\/script>/gi,
  '<\\/script>'
)}

<\/script>

</body>

</html>`;

  }

  else{

    d =
      d.replace(
        /<\/head>/i,
        `<style>${o.css}</style></head>`
      )

      .replace(
        /<\/body>/i,
        `<script>${o.javascript.replace(
          /<\/script>/gi,
          '<\\/script>'
        )}<\/script></body>`
      );

  }


  $('preview')
    .srcdoc =
      d;


  $('runStatus')
    .textContent =
      'Website preview updated';


  let a =
    activity();


  a.coding++;


  put(
    K.activity,
    a
  );


  act(
    'Ran web code'
  );

}


/* =========================
   PLAYGROUND BUTTONS
========================= */

all('.tab')
  .forEach(
    button =>

      button.onclick =
        () => {

          $('lang').value =
            button.dataset.lang;

          language(
            button.dataset.lang
          );

        }
  );


$('lang').onchange =
  event =>
    language(
      event.target.value
    );


$('suggest').onclick =
  () =>
    hint(
      editors[current],
      S[current] || []
    );


$('run').onclick =
  run;


$('refresh').onclick =
  run;


$('copy').onclick =
  async () => {

    await navigator.clipboard.writeText(
      editors[current].getValue()
    );

    toast(
      'Code copied'
    );

  };


$('clear').onclick =
  () =>
    editors[current]
      .setValue('');


$('reset').onclick =
  () =>
    editors[current]
      .setValue(
        DEF[current] || ''
      );


$('save').onclick =
  () => {

    saveCode();


    let s =
      json(
        K.saved,
        []
      );


    if(
      !s.includes(
        'code:' + current
      )
    ){

      s.push(
        'code:' + current
      );

    }


    put(
      K.saved,
      s
    );


    toast(
      'Code saved'
    );


    journey();

  };


/* =========================
   PUBLISH PROJECT
========================= */

function publish(){

  saveCode();


  const project = {

    html:
      editors.html.getValue(),

    css:
      editors.css.getValue(),

    javascript:
      editors.javascript.getValue()

  };


  const encoded =
    LZString
      .compressToEncodedURIComponent(
        JSON.stringify(project)
      );


  $('publishUrl')
    .value =
      URL_BASE +
      '#project=' +
      encoded;


  $('publishBox')
    .classList
    .remove('hidden');


  act(
    'Created project share link'
  );

}


$('publish').onclick =
  publish;


$('copyLink').onclick =
  async () => {

    await navigator.clipboard.writeText(
      $('publishUrl').value
    );

    toast(
      'Link copied'
    );

  };


$('share').onclick =
  () => {

    if(
      navigator.share
    ){

      navigator.share({

        title:
          'Darshan Academy Project',

        url:
          $('publishUrl').value

      });

    }

    else{

      $('copyLink').click();

    }

  };


$('closePublish').onclick =
  () =>
    $('publishBox')
      .classList
      .add('hidden');


/* =========================
   LOAD SHARED PROJECT
========================= */

function loadProject(){

  if(
    !location.hash.startsWith(
      '#project='
    )
  ){

    return;

  }


  try{

    const project =

      JSON.parse(

        LZString
          .decompressFromEncodedURIComponent(
            location.hash.slice(9)
          )

      );


    let o =
      json(
        K.code,
        DEF
      );


    Object.assign(
      o,
      project
    );


    put(
      K.code,
      o
    );


    nav(
      'playground'
    );


    setTimeout(
      () => {

        language(
          'html'
        );

        run();

        toast(
          'Shared project loaded'
        );

      },
      150
    );

  }

  catch{

    toast(
      'Invalid project link'
    );

  }

}


/* =========================
   DOUBTS
========================= */

$('submitDoubt').onclick =
  () => {

    const text =
      $('doubt')
        .value
        .trim();


    if(!text){

      toast(
        'Type your doubt'
      );

      return;

    }


    let doubts =
      json(
        K.doubts,
        []
      );


    doubts.unshift({

      x:text,

      date:
        new Date()
          .toLocaleString()

    });


    put(
      K.doubts,
      doubts
    );


    $('doubt')
      .value =
        '';


    let a =
      activity();


    a.doubts++;


    put(
      K.activity,
      a
    );


    act(
      'Asked a doubt'
    );


    renderDoubts();


    toast(
      'Doubt saved locally'
    );

  };


function renderDoubts(){

  const doubts =
    json(
      K.doubts,
      []
    );


  $('doubtList')
    .innerHTML =

      doubts
        .map(

          x =>

          `<div class="card">

            <b>
              Your doubt
            </b>

            <p>
              ${x.x}
            </p>

            <small>
              ${x.date}
            </small>

            <p>
              ↳ Waiting for instructor reply
            </p>

          </div>`

        )
        .join('')

      ||

      '<p>No doubts yet.</p>';

}


/* =========================
   LOCAL AI ASSISTANT
========================= */

function ai(question){

  const q =
    question.toLowerCase();


  if(
    /^(hi|hello|hey|hii|how are you)/
      .test(q)
  ){

    return `
      I'm fine! 😊
      What are you learning today?
    `;

  }


  if(
    q.includes('html')
  ){

    return `
      HTML provides webpage structure.
      Use elements such as h1, p,
      div, a and button.
    `;

  }


  if(
    q.includes('css')
  ){

    return `
      CSS controls appearance.
      Learn selectors, box model,
      flexbox, grid and responsive design.
    `;

  }


  if(
    q.includes('javascript')
  ){

    return `
      JavaScript adds behaviour.
      Learn variables, functions,
      conditions, loops, DOM and events.
    `;

  }


  if(
    q.includes('python')
  ){

    return `
      Python basics include variables,
      data types, conditions, loops,
      functions, lists and dictionaries.
    `;

  }


  return `
    Ask me a specific coding question
    about HTML, CSS, JavaScript,
    Python, C, C++, Java or MySQL.
  `;

}


function sendAI(){

  const question =
    $('aiInput')
      .value
      .trim();


  if(!question){

    return;

  }


  $('aiMessages')
    .innerHTML +=

    `<div class="ai-msg">

      <b>
        You
      </b>

      <p>
        ${question}
      </p>

    </div>`;


  setTimeout(

    () => {

      $('aiMessages')
        .innerHTML +=

        `<div class="ai-msg">

          <b>
            Darshan Academy AI
          </b>

          <p>
            ${ai(question)}
          </p>

        </div>`;

    },

    300

  );


  $('aiInput')
    .value =
      '';

}


$('aiSend').onclick =
  sendAI;


$('aiInput').onkeydown =
  event => {

    if(
      event.key === 'Enter'
    ){

      sendAI();

    }

  };


/* =========================
   JOURNEY
========================= */

function journey(){

  let a =
    activity();


  let saved =
    json(
      K.saved,
      []
    );


  const days =
    a.days.length;


  let progress =

    Math.min(

      100,

      a.lessons * 5 +

      a.coding * 2 +

      a.notes * 3 +

      a.videos * 4 +

      saved.length * 2

    );


  let dates =
    [...new Set(a.days)]
      .sort();


  let longest =
    0;


  let runCount =
    0;


  for(
    let i=0;
    i<dates.length;
    i++
  ){

    if(
      i &&
      (
        (
          new Date(dates[i]) -
          new Date(dates[i-1])
        ) /
        86400000
      ) !== 1
    ){

      runCount =
        0;

    }


    runCount++;


    longest =
      Math.max(
        longest,
        runCount
      );

  }


  const today =
    new Date()
      .toISOString()
      .slice(0,10);


  let currentStreak =
    dates.at(-1) === today
      ? runCount
      : 0;


  const stats = [

    [
      'Days since started',
      Math.floor(
        (
          Date.now() -
          new Date(a.start)
        ) /
        86400000
      ) + 1
    ],

    [
      'Current streak',
      currentStreak
    ],

    [
      'Longest streak',
      longest
    ],

    [
      'Days opened',
      days
    ],

    [
      'Coding practice',
      a.coding
    ],

    [
      'Lessons',
      a.lessons
    ],

    [
      'Videos watched',
      a.videos
    ],

    [
      'Notes opened',
      a.notes
    ],

    [
      'Saved',
      saved.length
    ],

    [
      'Doubts',
      a.doubts
    ]

  ];


  $('stats')
    .innerHTML =

      stats
        .map(

          x =>

          `<div class="stat">

            <span class="muted">
              ${x[0]}
            </span>

            <strong>
              ${x[1]}
            </strong>

          </div>`

        )
        .join('');


  $('journeyBar')
    .style
    .width =
      progress + '%';


  $('journeyProgress')
    .textContent =
      progress + '%';


  $('activity')
    .innerHTML =

      a.actions
        .map(

          x =>

          `<div class="card">

            <b>
              ${x.t}
            </b>

            <small>
              ${x.d}
            </small>

          </div>`

        )
        .join('')

      ||

      '<p>No activity yet.</p>';

}


/* =========================
   THEME
========================= */

$('theme').onclick =
  () => {

    document.body
      .classList
      .toggle('light');


    put(
      K.theme,
      document.body
        .classList
        .contains('light')
    );

  };


if(
  json(
    K.theme,
    false
  )
){

  document.body
    .classList
    .add('light');

}


/* =========================
   NAME SETUP
========================= */

function nameSetup(){

  const name =
    localStorage
      .getItem(
        K.name
      )
      || '';


  $('name')
    .value =
      name;


  $('welcome')
    .classList
    .add('show');


  setTimeout(

    () =>
      $('name')
        .focus(),

    400

  );

}


function setName(name){

  name =
    name.trim();


  if(!name){

    return;

  }


  localStorage.setItem(
    K.name,
    name
  );


  $('student')
    .textContent =
      name;


  $('avatar')
    .textContent =
      name[0]
        .toUpperCase();


  $('welcome')
    .classList
    .remove('show');

}


$('nameForm').onsubmit =
  event => {

    event.preventDefault();


    setName(
      $('name').value
    );


    act(
      'Started learning journey'
    );


    toast(
      'Welcome to Darshan Academy!'
    );

  };


/* =========================
   START WEBSITE
========================= */

$('year')
  .textContent =
    new Date()
      .getFullYear();


renderCards();

renderDoubts();

create('html');

create('css');

create('javascript');

language('html');

journey();

nameSetup();

loadProject();


})();
