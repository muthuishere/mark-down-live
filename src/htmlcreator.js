import fs from 'fs';
import fsPromises from 'fs/promises';

import path from 'path';
import {logger} from "./shared/logger.js";
import {getFullPresentationUrl, getIndexUrl} from "./shared/config.js";
import chalk from "chalk";
import {getOutputFolder} from "./shared/slidebuild.js";
import generateFullPresentation from './generator/FullPresentationGenerator.js';
import generateMainIndex from './generator/MainIndexGenerator.js';
import generateTypeWritingIndex from './generator/TypewriteIndexGenerator.js';

export  async function getIndexSlideContent(markDownFilePath) {
    try {

        // Read the input file
        const data = await fsPromises.readFile(markDownFilePath, 'utf8');

        // Split the content into sections using '---'
        const sections = data.split(/---\s*/);

        // The first section should be the header
        const header = sections[0] + '\n' + sections[1] + '\n';

        // The last section should be the content of the last slide
        const lastSlideContent = sections[sections.length - 1];

        // Prepare the content for index.md
        let newIndexContent = `---\n${header}\n---\n${lastSlideContent}`;

        newIndexContent = newIndexContent.replace("paginate: \"true\"", "paginate: \"false\"");
        return newIndexContent;

        // Determine the path for index.md in the same directory
        // const directory = path.dirname(markDownFilePath);
        // const indexFilePath = path.join(directory, 'index.md');
        //
        // // Write the new index.md file
        // await fsPromises.writeFile(indexFilePath, newIndexContent, 'utf8');
        // const assetsFolder = getCurrentProjectFolder() + "/assets"
        // await copyAssetsFrom(assetsFolder);
        //

        // console.log('index.md has been created successfully');
        // return indexFilePath;
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}


async function saveIndexFile( markdownFile) {
    const indexContent = await    getIndexSlideContent(markdownFile);
    const outputfolder = getOutputFolder()
    const indexFilePath = path.join(outputfolder, 'index.md');

    // Write the new index.md file
    await fsPromises.writeFile(indexFilePath, indexContent, 'utf8');
    return indexFilePath;
}

export async function formatAndBuild(markdownFile) {

    // console.log("formatting", markdownFile);
    // get parent folder from markdown file
    // get folder name
    const folder = path.dirname(markdownFile);


    if (fs.existsSync(markdownFile) === false)
        throw new Error("Markdown file does not exist!");

    const outputfolder = getOutputFolder()
    const markdownFileFullPath = outputfolder + path.basename(markdownFile);

   const  indexFilePath= await saveIndexFile(markdownFile);


    await generateTypeWritingIndex(indexFilePath ,"index.html");

    // if( 1 === 1)
    //     return


    // await generateAnimatedHandIndex(indexFilePath);

    setTimeout(async () => {

        await generateMainIndex(indexFilePath,"plain.html");
        await generateFullPresentation(markdownFile);

    }, 100);


   logger.info(chalk.green("full presentation available on "+getFullPresentationUrl(markdownFile)))
    logger.info(chalk.green("Live presentation available on " + getIndexUrl()))

    return markdownFileFullPath;
}


