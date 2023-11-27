import fs from 'fs';
import {formatAndBuild} from "./slideformatter.js";
import {getFullPath} from "./shared/os_utils.js";
let timeout;
let watcher


export function watchFile(filename){

    formatAndBuild(filename)



     watcher  =fs.watch(filename, (eventType, currentFile) => {

         const inp = getFullPath(currentFile)
         const isSameFile = filename === inp;

         console.log(`Event type is: ${eventType} Filename provided: ${filename} arrived ${inp} Same file: ${isSameFile}`);
        if (isSameFile == false){
             console.log("Ignoring this file change event")
             return;
         }

         console.log("File changed, formatting and building")
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(()=>{

            formatAndBuild(filename)
        }, 1000); // Wait for 2 seconds after the last change
    });

    console.log('Watching for file changes...');

}

export function stopSourceWatcher() {
    if (watcher) {
        watcher.close();
        console.log('Stopped watching the file.');
    }
}