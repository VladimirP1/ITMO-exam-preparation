var pug = require('pug');
var fs = require('fs');
var process = require('process');

var input = process.argv[2];
var output = process.argv[3];

var watched = new Map();



function build() {
    var options = {"encoding" : 'utf8'};

    var files = walk(input);

    try {
        fs.mkdirSync(output);
    } catch (error) {
        console.log(error);
    }


    var i;
    for (i = 0; i < files.length; i++) {
        try {
            var path = files[i];
            var for_mkdir = path.replace(new RegExp("/[^\/]*$"), '')
            var used = true;
            if (files[i].endsWith(".pug")) {
                console.log("Processing " + path);
                var result = pug.renderFile(path);
                fs.mkdirSync(output + '/' + for_mkdir, {"recursive" : true});
                fs.writeFileSync(output + '/' + files[i].replace(new RegExp(".pug$"), ".html"), result, options);
            } else if(files[i].endsWith(".css")) {
                fs.mkdirSync(output + '/' + for_mkdir, {"recursive" : true});
                fs.writeFileSync(
                    output + '/' + files[i],
                    fs.readFileSync(path)
                );
            } else {
                used = false;
            }
            if (used && !watched.has(path)) {
                watched.set(path, fs.watchFile(path, build));
            }
        } catch(e) {
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

build()