import {getCurrentProjectFolder} from "../shared/os_utils.js";
import {copyAssetsToOutputFolder, getOutputFolder} from "../shared/slidebuild.js";
import chalk from "chalk";
import {promises as fsPromises} from "fs";
import marpCLI from '@marp-team/marp-cli/lib/marp-cli.js';

export default async function generate(indexFilePath, generatedFileName = "type.html") {
    try {


        const assetsFolder = getCurrentProjectFolder() + "/assets"
        await copyAssetsToOutputFolder(assetsFolder);
        //
        const injectScriptFile = assetsFolder+ "/type.template.js"
        const hideScriptFile = assetsFolder+ "/hide.template.js"
        const urls =[ "https://unpkg.com/typewriter-effect@latest/dist/core.js"]
        await    generateHtmlWithMultipleScripts(urls,indexFilePath,hideScriptFile,injectScriptFile,generatedFileName);
        // console.log('type.md has been created successfully');
        return indexFilePath;
    } catch (err) {
        console.log(chalk.red( 'Error when generating  :' + generatedFileName + err));
    }
}

export async function generateHtmlWithMultipleScripts(urls,filename, hideScriptFile, injectScriptFile, generatedFileName  ) {
    console.log("Converting to HTML", filename);
    const outputfolder = getOutputFolder()
    const tempHtmlFile = outputfolder + "temp.html";
    const finalHtmlFile = outputfolder + generatedFileName;

    // Use Marp CLI to convert to temp.html
    const args = [filename, '-o', tempHtmlFile];
    await marpCLI.cliInterface(args);

    // Read the temp HTML file
    let htmlContent = await fsPromises.readFile(tempHtmlFile, 'utf8');

    //read the script file
    let injectScriptContent = await fsPromises.readFile(injectScriptFile, 'utf8');
    let hideScriptContent = await fsPromises.readFile(hideScriptFile, 'utf8');

    // Script to be inserted
    let scriptTag = '<script>' + hideScriptContent + '</script>';

    urls.forEach(url => {
        scriptTag = scriptTag + '<script src="' + url + '"></script>';
    })

    scriptTag = scriptTag + '<script>' + injectScriptContent + '</script>';

    // Insert the script tag before the closing </body> tag
    htmlContent = htmlContent.replace('</body>', `${scriptTag}\n</body>`);

    // console.log("Writing to index.html", finalHtmlFile);
    // Write the modified content to index.html
    await fsPromises.writeFile(finalHtmlFile, htmlContent, 'utf8');

    // Delete temp.html
    await fsPromises.unlink(tempHtmlFile);

    return finalHtmlFile;
}