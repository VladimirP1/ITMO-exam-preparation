var pug = require('pug');
var fs = require('fs');
var process = require('process');
var path = require('path');
var katex = require('katex');

var input = process.argv[2];
var output = process.argv[3];

function mkdir_and_write(file_path, result) {
    const options = {"encoding" : 'utf8'};

    let dir_path = path.dirname(file_path);

    fs.mkdirSync(dir_path, {"recursive" : true});
    fs.writeFileSync(file_path, result, options);
}

function build() {

    console.log("\033[2J\033[1;1H");

    try {
        fs.mkdirSync(output, {"recursive" : true});
    } catch (error) {
        console.log(error);
    }

    let files = walk(input);

    let i;
    for (i = 0; i < files.length; i++) {
        let cpath = files[i];
        try {
            if (files[i].endsWith(".pug")) {
                let rel = function() {
                    let rel = path.relative(path.dirname(cpath), input);
                    if (rel == "") { rel = "./"; } else { rel += "/"; } return rel; 
                };

                let result = pug.renderFile(cpath, {
                    //"sources_abs": path.resolve(input),
                    "sources_rel": rel()
                });

                //result = katex_run(result);
                
                mkdir_and_write(output + '/' + cpath.replace(new RegExp(".pug$"), ".html"), result);
            } else if(files[i].endsWith(".css")) {
                let result = fs.readFileSync(cpath);
                mkdir_and_write(output + '/' + cpath, result);
            }
        } catch(e) {
            console.log("Error while processing file: " + cpath);
            console.log(e);
        }
    }
}

var walk = function(dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            /* Recurse into a subdirectory */
            results = results.concat(walk(file));
        } else { 
            /* Is a file */
            results.push(file);
        }
    });
    return results;
}

var katex_run = function(content) {
    console.log(content);
    let replacer = function(str, text, offset, s) {
        console.log(arguments);

        let html = katex.renderToString(text, {
            throwOnError: false
        });

        console.log(html);
        return html;
    }

    return content.replace(/\$(.*?)\$/gm, replacer);
}

build();
