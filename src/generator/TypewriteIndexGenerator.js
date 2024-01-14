

import {getCurrentProjectFolder} from "../shared/os_utils.js";
import {copyAssetsFrom, generateHtmlWithMultipleScripts, generateHtmlWithScript} from "../shared/slidebuild.js";
import chalk, {Chalk} from "chalk";

export default async function generate(indexFilePath, generatedFileName = "type.html") {
    try {


        const assetsFolder = getCurrentProjectFolder() + "/assets"
        await copyAssetsFrom(assetsFolder);
        //
        const scriptFile = assetsFolder+ "/type.template.js"
        const urls =[ "https://unpkg.com/typewriter-effect@latest/dist/core.js"]
        await    generateHtmlWithMultipleScripts(urls,indexFilePath,scriptFile,generatedFileName);
        // console.log('type.md has been created successfully');
        return indexFilePath;
    } catch (err) {
        console.log(chalk.red( 'Error when generating  :' + generatedFileName + err));
    }
}
