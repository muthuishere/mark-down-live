import winston from "winston";

import {promises as fs} from 'fs';
import path from 'path';

import {fileExists, getCurrentProjectFolder} from "./os_utils.js";

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {service: 'slidepresenter'},
    transports: [

        new winston.transports.File({filename: getLogFolder() + '/error.log', level: 'error'}),
        new winston.transports.File({filename: getLogFolder() + '/app.log'}),
    ],
});

// If we're not in test then log to the `console` with the formatr
//  console.log("Environment",process.env.NODE_ENV)

if (process.env.NODE_ENV === 'test') {
    logger.level = 'debug';
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

// Replace this with the path to your log files
const logDirectory = getLogFolder();

// Async arrow function to delete all .log files
export const deleteLogFiles = async () => {
    try {
        const files = await fs.readdir(logDirectory);
        for (const file of files) {
            if (path.extname(file) === '.log') {
                await fs.unlink(path.join(logDirectory, file));

            }
        }
    } catch (err) {
        console.error(`Error occurred: ${err.message}`);
    }
};

export function getLogFolder() {
    return getCurrentProjectFolder() + "/logs";
}

export async function initLogFolder() {
    let s = getCurrentProjectFolder() + "/logs";
    const isExists = await fileExists(s);

    if (!isExists) {
        await fs.mkdir(s, {recursive: true});
    }
    return s;
}

initLogFolder().then(r => console.log("Log folder created at " + r)).catch(e => console.error(e))