import fs from 'fs';
import {formatAndBuildBufferFile, formatAndBuildInitialFile} from "./htmlcreator.js";
import path from "path";


import {openFileInSystem} from "./shared/os_utils.js";
import {cancelCurrentBuild, getIndexUrl, isBuildingStatus, startBuilding, stopBuilding} from "./shared/config.js";
import {logger} from "./shared/logger.js";
import chalk from "chalk";

let timeout;
let watcher

let changeQueue = [];
let debounceTimer = null;

function startWatching(filenameWithFullPath) {


    logger.info(`Watching for file changes... ${filenameWithFullPath}`);
    const folder = path.dirname(filenameWithFullPath);
    const filename = path.basename(filenameWithFullPath);

    watcher = fs.watch(filenameWithFullPath, (eventType, currentFile) => {
        const inp = path.basename(currentFile);
        logger.debug(`inp: ${inp} filename: ${filenameWithFullPath}  currentFile: ${currentFile}`);


        const isSameFile = filename === inp;

        if (!isSameFile) {
            logger.debug(`Ignoring Event type is: ${eventType} Filename provided: ${filename} Same file: ${isSameFile}  ${filenameWithFullPath} ${inp}`);
            return;
        }

        logger.debug(`File changed Event type is: ${eventType} Filename provided: ${filename} Same file: ${isSameFile}`);

        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        debounceTimer = setTimeout(() => {
            logger.debug(`Debounce timer triggered`);
            enqueueChange(filenameWithFullPath);
            processNextChange();
        }, 100); // Debounce period
    });

    watcher.on('error', (err) => {
        logger.error('Error: ' + err);
    });


}

function enqueueChange(filename) {
    if (isBuildingStatus()) {
        // Signal to cancel the current build
        logger.debug(`cancelCurrentBuild`);
        cancelCurrentBuild();
    }


    changeQueue.push(filename);

}

async function processNextChange() {

    try {

        if (changeQueue.length === 0) {
            return;
        }


        const filename = changeQueue.shift();
        startBuilding()


        await formatAndBuildBufferFile(filename);
        // send to websocket
        logger.info(chalk.green('Changes applied to presentation.'));

    } catch (err) {
        console.error(err)
        logger.error('Error during formatAndBuild:' + err);
    } finally {
        stopBuilding()


        if (changeQueue.length > 0) {
            // Process the next change in the queue
            processNextChange();
        }
    }
}


export function watchFile(filename) {
    // formatAndBuildInitialFile(filename);(filename).then(() => {

    formatAndBuildInitialFile(filename).then(() => {

        openFileInSystem(getIndexUrl())

        startWatching(filename)

    }).catch((err) => {
        logger.error(err)
    });

    //   console.log('Watching for file changes...');

}

export function stopSourceWatcher() {
    if (watcher) {
        watcher.close();
        logger.debug('Stopped watching the file.');
    }

    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
    if (changeQueue.length > 0) {
        changeQueue = [];
    }

}