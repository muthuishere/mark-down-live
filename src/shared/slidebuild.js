import fs, {promises as fsPromises} from "fs";
import path from "path";
import marpCLI from '@marp-team/marp-cli/lib/marp-cli.js';
import {getCurrentProjectFolder} from "./os_utils.js";
import chalk from "chalk";

let projectRunningFolder = null;

export function setProjectRunningFolder(folder){

    if (fs.existsSync(folder) === false)
        throw new Error("Folder does not exist " + folder)

    projectRunningFolder = folder;

}
export function getOutputFolder() {

      let outputfolder = getCurrentProjectFolder() + "/dist/";
   // let outputfolder = getHomeFolder() + "/.slidewatcher/";

    //get home folder
    // const homedir = getHomeFolder() + "/.slidewatcher/";
    // if(projectRunningFolder !== null){
    //     outputfolder = projectRunningFolder + "/dist/";
    // }

    console.log("Output Folder " + outputfolder)
     // outputfolder = outputfolder

    if (fs.existsSync(outputfolder) === false)
        fs.mkdirSync(outputfolder, {recursive: true})
    return outputfolder;
    //Serving "/Users/muthuishere/.slidewatcher/" at http://127.0.0.1:9500
    //[  INFO ] Converting 1 markdown...
    // [  INFO ] ../../../.slidewatcher/programming.md => dist/programming.html
    // All the files located on /Users/muthuishere/.slidewatcher/
    // Output Folder /Users/muthuishere/.slidewatcher/
    // converting to html /Users/muthuishere/.slidewatcher/index.md
    // [  INFO ] Converting 1 markdown...
    // [  INFO ] ../../../.slidewatcher/index.md => dist/index.html



//    Serving "/Users/muthuishere/muthu/gitworkspace/slidepresenter/dist/" at http://127.0.0.1:9500

}

export async function copyAssetsToOutputFolder(srcfolder) {
    const outputfolder = getOutputFolder()

    await copyFilesByExtension(srcfolder, outputfolder, ['png','gif', 'svg', 'jpg','css','scss']);

}




export function copyFilesByExtension(sourceDir, targetDir, extensions) {
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, {recursive: true});
    }

    copyFilesRecursive(sourceDir, targetDir);

    function copyFilesRecursive(currentSourceDir, currentTargetDir) {
        const files = fs.readdirSync(currentSourceDir, {withFileTypes: true});

        for (const file of files) {
            if (file.isDirectory()) {
                const newSourceDir = path.join(currentSourceDir, file.name);
                const newTargetDir = path.join(currentTargetDir, file.name);
                if (!fs.existsSync(newTargetDir)) {
                    fs.mkdirSync(newTargetDir);
                }
                copyFilesRecursive(newSourceDir, newTargetDir);
            } else {
                const extname = path.extname(file.name).slice(1); // Remove the leading dot
                if (extensions.includes(extname)) {
                    const sourceFile = path.join(currentSourceDir, file.name);
                    const targetFile = path.join(currentTargetDir, file.name);
                    fs.copyFileSync(sourceFile, targetFile);
                }
            }
        }
    }
}


// Example usage:


// Sample function to replace ###CONTENTS###
export const formatContents = (data) => {
    // Use a regular expression to match lines that start with '#', followed by a space, followed by one to three numbers, another space, and then a '-'

    const regex = /^#\s[1-9]{1,3}\s-.*$/gm;
    const matches = data.match(regex);

    if (!matches) {
        return "";
    }
    const processedMatches = matches.map(line => {
        // Remove starting '#'
        const header = line.replace(/^#/, '').trim().split('-')[1].trim();
        let newLine = line.replace(/^#/, '').trim()
        // Convert to lowercase
        newLine = newLine.toLowerCase();
        // Replace spaces with '-'
        newLine = newLine.replace(/\s+/g, '-');
        return `1. [${header}](#${newLine})`;
        ;
    });

    // Convert the processed matches to an array and join by new line
    return processedMatches.join('\n');

};

export const replaceContentsInMarkdown = (markdownFile, resultFile) => {


    return new Promise((resolve, reject) => {


        // Check if the input file exists
        if (!fs.existsSync(markdownFile)) {
            reject("Markdown file does not exist!");
            return;
        }

        // Read the file
        fs.readFile(markdownFile, 'utf8', (err, data) => {
            if (err) {
                reject("Error reading the file:" + err.toString());
                return;
            }

            const formattedData = formatContents(data);

            // console.log("Formatted data:", formattedData);

            // Replace ###CONTENTS### with the formatted text
            const updatedData = data.replace('###CONTENTS###', formattedData);

            // Write the updated data to the result file
            fs.writeFile(resultFile, updatedData, 'utf8', (err) => {
                if (err) {
                    reject("Error writing to the result file:" + err.toString());
                    return;
                }
                // console.log(`File has been saved as ${resultFile}`);
                resolve(resultFile);
            });
        });
    });
};



export async function convertToHtml(filename) {

     console.log("converting to html",filename);
    const folder = path.dirname(filename);
    const basename = path.basename(filename);
    const outputfolder = getOutputFolder()
    let htmlFile = basename.replace(".md", ".html");
    const outputfile = outputfolder  + htmlFile;



    const args = [filename, '-o', outputfile];

    // console.log("converting to html",args);

    console.log(chalk.green("Full presentation available on " + outputfile))

    await marpCLI.cliInterface(args)
    return htmlFile;





}

export async function generateHtmlWithScript(filename, scriptFile, generatedFileName  ) {
    // console.log("Converting to HTML", filename);
    const outputfolder = getOutputFolder()
    const tempHtmlFile = outputfolder + "temp.html";
    const finalHtmlFile = outputfolder + generatedFileName;

    // Use Marp CLI to convert to temp.html
    const args = [filename, '-o', tempHtmlFile];
    await marpCLI.cliInterface(args);

    // Read the temp HTML file
    let htmlContent = await fsPromises.readFile(tempHtmlFile, 'utf8');

    //read the script file
    let scriptContent = await fsPromises.readFile(scriptFile, 'utf8');

    // Script to be inserted
    const scriptTag = '<script>' + scriptContent + '</script>';

    // Insert the script tag before the closing </body> tag
    htmlContent = htmlContent.replace('</body>', `${scriptTag}\n</body>`);

    console.log("Writing to index.html", finalHtmlFile);
    // Write the modified content to index.html
    await fsPromises.writeFile(finalHtmlFile, htmlContent, 'utf8');

    // Delete temp.html
    await fsPromises.unlink(tempHtmlFile);

    return finalHtmlFile;
}