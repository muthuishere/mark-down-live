#!/usr/bin/env node

'use strict'

import {fileExists, getCurrentProjectFolder, getFullPath} from "../src/shared/os_utils.js";
import {stopSourceWatcher, watchFile} from "../src/sourcewatcher.js";
import {startServer} from "../src/sliderunner.js";
import {openApp} from "../src/browser/entrypoint.js";
async function main(filename) {

    if(fileExists(filename)){

        process.on('SIGINT', cleanup);  // Ctrl+C in terminal
        process.on('SIGTERM', cleanup); // Termination request from the OS
        process.on('exit', cleanup);    // Normal exit


        const fullPath = getFullPath(filename);
        watchFile(fullPath);
        // start live Server
        const folder = getCurrentProjectFolder() + "/dist";
        //
        // setTimeout(async ()=>{
        //      openApp("http://localhost:9500")
        // }, 1000); // Wait for 2 seconds after the last change

        await startServer(folder)




    }else {
        console.log("File Does not Exist" + filename)
        process.exit(1);
    }

}


function cleanup() {
    console.log("Cleaning up before exit");
    stopSourceWatcher();
    process.exit(0);
}

(async () => {


    try {
        const params =process.argv.slice(2);
        if(params.length === 0){
            console.log("Please provide a filename")
            process.exit(1);
        }
        const filename = params[0];
       await main(filename);


    }catch (err) {
        console.log("Unable to Execute Command" , err)

        process.exit(1);
    }

})();