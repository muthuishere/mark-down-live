import fs from 'fs';
import {formatAndBuild} from "./slideformatter.js";
import {getFullPath} from "./shared/os_utils.js";
import path from "path";

let timeout;
let watcher


export function watchFile(filename) {

    formatAndBuild(filename)
    const basename = path.basename(filename)


    watcher = fs.watch(filename, (eventType, currentFile) => {

        const inp = path.basename(currentFile)
        const isSameFile = basename === inp;

        // get only file name from path

        // const basename = path.basename(filename)

        if (isSameFile == false) {

            console.log(`Ignoring Event type is: ${eventType} Filename provided: ${basename} Same file: ${isSameFile}`);

            return;
        }

        console.log(`File changed Event type is: ${eventType} Filename provided: ${basename} Same file: ${isSameFile}`);
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {

            formatAndBuild(filename)
        }, 1000); // Wait for 2 seconds after the last change
    });

 //   console.log('Watching for file changes...');

}

export function stopSourceWatcher() {
    if (watcher) {
        watcher.close();
        console.log('Stopped watching the file.');
    }
}