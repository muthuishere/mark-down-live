import fs from 'fs';
import {formatAndBuild} from "./slideformatter.js";
let timeout;
let watcher


export function watchFile(filename){

    formatAndBuild(filename)


     watcher  =fs.watch(filename, (eventType, inp) => {
         console.log(`event type is: ${eventType}`);
         console.log(`filename provided: ${inp}`);

         if (eventType =='change' && inp !== filename){
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