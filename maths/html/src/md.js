
var loaded = function() {
    let elements = document.getElementsByClassName("md");

    let replacer = function(prefix, suffix) {
        return function(str, text, offset, s) {
            return prefix + text + suffix;
        }
    }

    let styleReplacer = function(style) {
        return replacer('<span style="' + style + '">','</span>');
    }

    let replacements = {
        '__(.*?)__': styleReplacer("font-weight:bold;"),
        '\\*\\*(.*?)\\*\\*': styleReplacer("font-style:italic;"),
        '!!(.*?)!!': styleReplacer("color:darkred;font-weight:bold;"),
        '~~~(.*?)~~~': styleReplacer("text-decoration:underline;")
    };

    let i, j;
    for(i = 0; i < elements.length; i++) {
        let element = elements[i];
        for(j = 0; j < Object.keys(replacements).length; j++) {
            let key = Object.keys(replacements)[j];
            let repl = replacements[key];

            element.innerHTML = 
                element.innerHTML.
                    replace(
                        RegExp(key, 'g'), 
                        repl
                    );
        }
    }
}

document.addEventListener("DOMContentLoaded", loaded);