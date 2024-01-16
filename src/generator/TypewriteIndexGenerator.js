import {getCurrentProjectFolder} from "../shared/os_utils.js";
import {copyAssetsToOutputFolder, getOutputFolder} from "../shared/slidebuild.js";
import chalk from "chalk";
import {promises as fsPromises} from "fs";
import marpCLI from '@marp-team/marp-cli/lib/marp-cli.js';

export default async function generate(indexFilePath, generatedFileName = "type.html") {
    try {


        const assetsFolder = getCurrentProjectFolder() + "/assets"
        await copyAssetsToOutputFolder(assetsFolder);

        await generateHtmlWithMultipleScripts(indexFilePath, generatedFileName);
        // console.log('type.md has been created successfully');
        return indexFilePath;
    } catch (err) {
        console.log(chalk.red('Error when generating  :' + generatedFileName + err));
    }
}

async function generateHtmlContent(tempHtmlFile) {
    const assetsFolder = getCurrentProjectFolder() + "/assets"
    let htmlContent = await fsPromises.readFile(tempHtmlFile, 'utf8');

    //read the script file
    let injectScriptContent = await fsPromises.readFile(assetsFolder + "/type.template.js", 'utf8');
    let moduleScriptContent = await fsPromises.readFile(assetsFolder + "/type.module.template.js", 'utf8');
    let hideScriptContent = await fsPromises.readFile(assetsFolder + "/hide.template.js", 'utf8');

    // Script to be inserted
    let scriptTag = '<script>' + hideScriptContent + '</script>';
    scriptTag = scriptTag + '<script type="module">' + moduleScriptContent + '</script>';
    scriptTag = scriptTag + '<script src="' + "https://unpkg.com/typewriter-effect@latest/dist/core.js" + '"></script>';


    scriptTag = scriptTag + '<script>' + injectScriptContent + '</script>';


    return htmlContent.replace('</body>', `${scriptTag}\n</body>`);
}

export async function generateHtmlWithMultipleScripts(filename, generatedFileName) {
    const assetsFolder = getCurrentProjectFolder() + "/assets"


    console.log("Converting to HTML", filename);
    const outputfolder = getOutputFolder()
    const tempHtmlFile = outputfolder + "temp.html";
    const finalHtmlFile = outputfolder + generatedFileName;

    // Use Marp CLI to convert to temp.html
    const args = [filename, '-o', tempHtmlFile];
    await marpCLI.cliInterface(args);

    // Read the temp HTML file
    let htmlContent = await generateHtmlContent(tempHtmlFile);

    // console.log("Writing to index.html", finalHtmlFile);
    // Write the modified content to index.html
    await fsPromises.writeFile(finalHtmlFile, htmlContent, 'utf8');

    // Delete temp.html
    await fsPromises.unlink(tempHtmlFile);

    return finalHtmlFile;
}