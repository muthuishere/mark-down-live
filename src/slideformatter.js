import marpCLI from '@marp-team/marp-cli/lib/marp-cli.js';
import fs from 'fs';
import fsPromises from 'fs/promises';

import path from 'path';
import {logger} from "./shared/logger.js";
import {getCurrentProjectFolder} from "./shared/os_utils.js";

function copyFilesByExtension(sourceDir, targetDir, extensions) {
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    copyFilesRecursive(sourceDir, targetDir);

    function copyFilesRecursive(currentSourceDir, currentTargetDir) {
        const files = fs.readdirSync(currentSourceDir, { withFileTypes: true });

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
const formatContents = (data) => {
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
        return `1. [${header}](#${newLine})`;;
    });

    // Convert the processed matches to an array and join by new line
    return processedMatches.join('\n');

};

const replaceContentsInMarkdown = (markdownFile, resultFile) => {


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

        console.log("Formatted data:", formattedData);

        // Replace ###CONTENTS### with the formatted text
        const updatedData = data.replace('###CONTENTS###', formattedData);

        // Write the updated data to the result file
        fs.writeFile(resultFile, updatedData, 'utf8', (err) => {
            if (err) {
                reject("Error writing to the result file:"+ err.toString());
                return;
            }
            console.log(`File has been saved as ${resultFile}`);
            resolve(resultFile);
        });
    });
    });
};


export async function formatAndBuild(markdownFile) {

    console.log("formatting", markdownFile);
    // get parent folder from markdown file
    // get folder name
    const folder = path.dirname(markdownFile);
    console.log(folder);

    if (fs.existsSync(markdownFile) === false)
        throw new Error("Markdown file does not exist!");

    const srcfolder = path.dirname(markdownFile);

    console.log(folder);

    // get file name on

    // Example usage:
//replaceContentsInMarkdown('./docs/full-testcontainer.md', 'formatted-testcontainer.md');


    const outputfolder = getCurrentProjectFolder() + "/dist/"

    if (fs.existsSync(outputfolder) === false)
        fs.mkdirSync(outputfolder, {recursive: true});

    const resultFile = outputfolder + path.basename(markdownFile);
    ;


// Capture the arguments passed from the package.json script
    //   const [markdownFile, resultFile,srcfolder,outputfolder] = process.argv.slice(2);
// ${npm_package_config_output_folder}
// Check if the necessary arguments are provided

    await copyFilesByExtension(srcfolder, outputfolder, ['png', 'svg', 'jpg']);
    logger.info("copy files from " + srcfolder + " to " + outputfolder);
    await replaceContentsInMarkdown(markdownFile, resultFile);
    logger.info("replace contents in " + markdownFile + " to " + resultFile);
   await convertToHtml(resultFile);

const  indexFile=   await createMarpitIndexFile(resultFile);
await convertToHtml(indexFile);
return resultFile;
}


export async function createMarpitIndexFile(inputFilePath) {
    try {

        // Read the input file
        const data = await fsPromises.readFile(inputFilePath, 'utf8');

        // Split the content into sections using '---'
        const sections = data.split(/---\s*/);

        // The first section should be the header
        const header = sections[0] +  '\n'  + sections[1] +  '\n';

        // The last section should be the content of the last slide
        const lastSlideContent = sections[sections.length - 1];

        // Prepare the content for index.md
        let newIndexContent = `---\n${header}\n---\n${lastSlideContent}`;

        newIndexContent=        newIndexContent.replace("paginate: \"true\"","paginate: \"false\"");

        // Determine the path for index.md in the same directory
        const directory = path.dirname(inputFilePath);
        const indexFilePath = path.join(directory, 'index.md');

        // Write the new index.md file
        await fsPromises.writeFile(indexFilePath, newIndexContent, 'utf8');
        console.log('index.md has been created successfully');
        return indexFilePath;
    } catch (err) {
        console.error('Error:', err);
    }
}



export async function convertToHtml(filename) {

    console.log("converting to html",filename);
    const folder = path.dirname(filename);
    const basename = path.basename(filename);
    const outputfolder = getCurrentProjectFolder() + "/dist"  ;
    const outputfile = outputfolder + "/" + basename.replace(".md",".html");


    const args = [filename, '-o', outputfile];
console.log("args",args);
// Invoke the cliInterface function with the arguments
await    marpCLI.cliInterface(args)
    console.log('Done!');

// // Invoke the cliInterface function with the arguments
//     marpCLI.cliInterface(args).then(() => {
//         console.log('Done!');
//     }).catch((err) => {
//         console.error(err);
//     });
//


}