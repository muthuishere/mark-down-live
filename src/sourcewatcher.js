import fs from 'fs';
import {formatAndBuild} from "./htmlcreator.js";
import {getFullPath} from "./shared/os_utils.js";
import path from "path";

let timeout;
let watcher
let isBuilding = false;
let changeQueue = [];
let debounceTimer = null;

function startWatching(filenameWithFullPath) {

    console.log(`Watching for file changes... ${filenameWithFullPath}`);
   const folder = path.dirname(filenameWithFullPath);
    const filename = path.basename(filenameWithFullPath);

    watcher = fs.watch(filenameWithFullPath, (eventType, currentFile) => {
        const inp = path.basename(currentFile);
        console.log(`inp: ${inp} filename: ${filenameWithFullPath}  currentFile: ${currentFile}`);


        const isSameFile = filename === inp;

        if (!isSameFile) {
            console.log(`Ignoring Event type is: ${eventType} Filename provided: ${filename} Same file: ${isSameFile}  ${filenameWithFullPath} ${inp}`);
            return;
        }

        console.log(`File changed Event type is: ${eventType} Filename provided: ${filename} Same file: ${isSameFile}`);

        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        debounceTimer = setTimeout(() => {
            enqueueChange(filenameWithFullPath);
            processNextChange();
        }, 2000); // Debounce period
    });

    watcher.on('error', (err) => {
        console.log('Error: ' + err);
    });
}

function enqueueChange(filename) {
    if (!isBuilding) {
        changeQueue.push(filename);
    }
}

async function processNextChange() {
    if (isBuilding || changeQueue.length === 0) {
        return;
    }

    const filename = changeQueue.shift();
    isBuilding = true;

    try {
        await formatAndBuild(filename);
    } catch (err) {
        console.error('Error during formatAndBuild:', err);
    } finally {
        isBuilding = false;
        if (changeQueue.length > 0) {
            // Process the next change in the queue
            processNextChange();
        }
    }
}

export  function watchFile(filename) {

     formatAndBuild(filename).then(() => {

         startWatching(filename)

     }).catch((err) => {
            console.log(err)
     });

    //   console.log('Watching for file changes...');

}

export function stopSourceWatcher() {
    if (watcher) {
        watcher.close();
        console.log('Stopped watching the file.');
    }

    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
    if(changeQueue.length > 0){
        changeQueue = [];
    }

}