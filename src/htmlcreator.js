import fsPromises from 'fs/promises';

import path from 'path';
import {logger} from "./shared/logger.js";
import {getFullPresentationUrl, getIndexUrl, shouldCancelCurrentBuild} from "./shared/config.js";
import chalk from "chalk";
import {convertToHtmlWithFileName, getOutputFolder} from "./shared/slidebuild.js";
import generateFullPresentation from './generator/FullPresentationGenerator.js';
import generateTypeWritingIndex from './generator/TypewriteIndexGenerator.js';
import {sendMessageToWebSockets} from "./AppServer.js";

const BUFFER_FILE_NAME = "buffer.html";

export async function getIndexSlideContent(markDownFilePath) {
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


    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}


async function saveIndexFile(markdownFile) {
    const indexContent = await getIndexSlideContent(markdownFile);
    const outputfolder = getOutputFolder()
    const indexFilePath = path.join(outputfolder, 'index.md');

    // Write the new index.md file
    await fsPromises.writeFile(indexFilePath, indexContent, 'utf8');
    return indexFilePath;
}


export async function formatAndBuildInitialFile(markdownFile) {


    const outputfolder = getOutputFolder()
    const markdownFileFullPath = outputfolder + path.basename(markdownFile);

    const indexFilePath = await saveIndexFile(markdownFile);


    await generateTypeWritingIndex(indexFilePath, "index.html");

    await generateFullPresentation(markdownFile);


    logger.info(chalk.green("full presentation available on " + getFullPresentationUrl(markdownFile)))
    logger.info(chalk.green("Live presentation available on " + getIndexUrl()))

    // open Index File


    return markdownFileFullPath;
}


async function sendBufferUpdatedMessage() {
    const outputfolder = getOutputFolder()
    const outputfile = outputfolder + BUFFER_FILE_NAME;

    const content = await fsPromises.readFile(outputfile, 'utf8');
    await sendMessageToWebSockets({"filename": BUFFER_FILE_NAME, "action": "updateIndexPage", payload: content});


}

export async function formatAndBuildBufferFile(markdownFile) {


    const outputfolder = getOutputFolder()


    const markdownFileFullPath = outputfolder + path.basename(markdownFile);

    const indexFilePath = await saveIndexFile(markdownFile);

    if (shouldCancelCurrentBuild()) {
        // Clean up if necessary
        throw new Error('Build was canceled');
    }

    await convertToHtmlWithFileName(indexFilePath, BUFFER_FILE_NAME);
    if (shouldCancelCurrentBuild()) {
        // Clean up if necessary
        throw new Error('Build was canceled');
    }

    await sendBufferUpdatedMessage();


    setTimeout(async () => {

        if (shouldCancelCurrentBuild()) {
            return
        }
        await generateFullPresentation(markdownFile);
        await generateTypeWritingIndex(indexFilePath, "index.html");

    }, 100);


    return markdownFileFullPath;


}


