/* ================================= */
/* COURSE FUNCTION */
/* ================================= */

function openCourse(courseName) {

    alert(
        "Opening " +
        courseName +
        " course..."
    );


    /*
        You can later replace this
        with your actual YouTube
        playlist link.
    */

    window.open(
        "https://www.youtube.com/@darshanacademy-z6c/playlists",
        "_blank"
    );
}


/* ================================= */
/* VIDEO FUNCTION */
/* ================================= */

function openVideo() {

    window.open(
        "https://youtube.com/@darshanacademy-z6c",
        "_blank"
    );

}


/* ================================= */
/* CODE EDITOR */
/* ================================= */


/*
    Store the default HTML code.
*/

let htmlCode = `
<!DOCTYPE html>

<html>

<head>

    <title>
        My Website
    </title>

</head>

<body>

    <h1>
        Hello Darshan Academy!
    </h1>

    <p>
        Start building your website.
    </p>

</body>

</html>
`;


/*
    Store CSS code.
*/

let cssCode = `
body {

    font-family: Arial;

    padding: 30px;

    text-align: center;

}

h1 {

    color: purple;

}
`;


/*
    Store JavaScript code.
*/

let javascriptCode = `
console.log("Hello Darshan Academy!");
`;


/*
    Get the textarea.
*/

const editor =
    document.getElementById(
        "codeEditor"
    );


/*
    Show HTML when page opens.
*/

editor.value = htmlCode;


/* ================================= */
/* SHOW HTML */
/* ================================= */

function showHTML() {

    editor.value = htmlCode;

}


/* ================================= */
/* SHOW CSS */
/* ================================= */

function showCSS() {

    editor.value = cssCode;

}


/* ================================= */
/* SHOW JAVASCRIPT */
/* ================================= */

function showJS() {

    editor.value = javascriptCode;

}


/* ================================= */
/* RUN CODE */
/* ================================= */

function runCode() {

    /*
        Get the code
        written by the student.
    */

    const code =
        editor.value;


    /*
        Show the code
        inside the iframe.
    */

    const output =
        document.getElementById(
            "output"
        );


    output.srcdoc = code;

}


/* ================================= */
/* CLEAR CODE */
/* ================================= */

function clearCode() {

    editor.value = "";

}


/* ================================= */
/* RESET CODE */
/* ================================= */

function resetCode() {

    editor.value =
        htmlCode;

}


/* ================================= */
/* SAVE CODE WHEN LEAVING */
/* ================================= */

editor.addEventListener(
    "input",
    function () {

        htmlCode =
            editor.value;

    }
);


/* ================================= */
/* SIMPLE PAGE LOAD MESSAGE */
/* ================================= */

console.log(
    "Darshan Academy website loaded successfully!"
);
