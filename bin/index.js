#!/usr/bin/env node

'use strict'

import {fileExists} from "../src/shared/os_utils.js";

async function main(params, folderPath) {



}



console.log("Hello World")
console.log(process.argv.slice(2))
console.log(process.cwd())


    function getFile() {
        return new Promise((resolve,reject)=>{

            fs.readFile('package.json', (err, data) => {
                if (err) throw err;
                resolve(data)
            });
        })
    }

(async () => {


    try {
        const params =process.argv.slice(2);
        if(params.length === 0){
            console.log("Please provide a filename")
            process.exit(1);
        }
        const filename = params[0];
        if(fileExists(filename)){
            console.log("File  Exists" + filename)
            process.exit(0);
        }else {
            console.log("File Does not Exist" + filename)
            process.exit(1);
        }
//        await main(process.argv.slice(2)[0],process.cwd());


    }catch (err) {
        console.log("Unable to Execute Command" , err)

        process.exit(1);
    }

})();