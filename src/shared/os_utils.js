import {exec, spawn} from 'child_process'
import commandExists from "command-exists";
import {fileURLToPath} from "url";

import path from "path";
import os from "os";
import fs from 'fs';
import chalk from "chalk";
import {deleteLogFiles} from "./logger.js";

const isWin = process.platform === "win32";



export function runProcess(command, args) {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args);
        process.stdout.on('data', (data) => {
            console.log(data.toString());
        });
        process.stderr.on('data', (data) => {
            console.error(data.toString());
        });
        process.on('close', (code) => {
            resolve(code);
        });
    });
}


export function isSudo() {

    return isWin ? true : (process.getuid && process.getuid() === 0);
}


export async function  doesOsHasCommand(cmd){
    try {
        await commandExists(cmd)
        return true
    }catch (e) {
        return  false
    }


}

export  function  fileExists(file){
return fs.existsSync(file)

}

export function getCurrentProjectFolder(){
    const __filename = fileURLToPath(import.meta.url);
    const dirname = path.dirname(__filename);
    const folder =     path.resolve(dirname, '../../')
    return folder;
}

export function getFullPath(filename) {
    return path.isAbsolute(filename)
        ? filename
        : path.join(process.cwd(), filename);
}

export function openFileInSystem(filePath) {
    return new Promise(resolve => {
        let command;

        switch (os.platform()) {
            case 'win32': // Windows
                command = `start ${filePath.replace(/ /g, "\\ ")}`;
                break;
            case 'darwin': // macOS
                command = `open "${filePath}"`;
                break;
            case 'linux': // Linux
                command = `xdg-open "${filePath}"`;
                break;
            default:
                console.log(chalk.red(`Platform not supported: ${os.platform()}`));
                resolve();
                return;
        }

        exec(command, (err) => {
            if (err) {
                console.log(chalk.red(`Failed to open file: ${filePath}`, err));
                resolve();
                return;
            }
            console.log(chalk.green(`File opened successfully: ${filePath}`));
            resolve();
        });
    });
}
