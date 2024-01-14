import {convertToHtml, copyAssetsFrom, getOutputFolder, replaceContentsInMarkdown} from "../shared/slidebuild.js";
import path from "path";

export default async function generate( markdownFile) {


    const srcfolder = path.dirname(markdownFile);
    await copyAssetsFrom(srcfolder);
    const outputfolder = getOutputFolder()
    const resultFile = outputfolder + path.basename(markdownFile);
    // logger.info("copy files from " + srcfolder + " to " + outputfolder);
    await replaceContentsInMarkdown(markdownFile, resultFile);
    // logger.info("replace contents in " + markdownFile + " to " + resultFile);
    await convertToHtml(resultFile);

    return resultFile;
}