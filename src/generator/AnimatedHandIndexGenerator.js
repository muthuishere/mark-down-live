

import {getCurrentProjectFolder} from "../shared/os_utils.js";
import {copyAssetsFrom, generateHtmlWithScript} from "../shared/slidebuild.js";

export default async function generate(indexFilePath, generatedFileName = "handicon.html") {
    try {


        const assetsFolder = getCurrentProjectFolder() + "/assets"
        await copyAssetsFrom(assetsFolder);
        //
        const scriptFile = assetsFolder+ "/handicon.template.js"
        await    generateHtmlWithScript(indexFilePath,scriptFile,generatedFileName);
        console.log('handicon.md has been created successfully');
        return indexFilePath;
    } catch (err) {
        console.error('Error:', err);
    }
}
