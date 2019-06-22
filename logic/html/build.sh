#!/bin/bash

while true; do
    node build_pug.js src out
    cp -r static out

    printf "Build done at %s\n\n" "`date`"

    inotifywait -r -e modify -e move -e create -e delete .
done
