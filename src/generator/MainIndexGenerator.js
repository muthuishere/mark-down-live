import {getCurrentProjectFolder} from "../shared/os_utils.js";
import {generateHtmlWithScript} from "../shared/slidebuild.js";

export default async function generate(indexFilePath, generatedFileName = "index.html") {
    try {

        // // Read the input file
        // const data = await fsPromises.readFile(inputFilePath, 'utf8');
        //
        // // Split the content into sections using '---'
        // const sections = data.split(/---\s*/);
        //
        // // The first section should be the header
        // const header = sections[0] + '\n' + sections[1] + '\n';
        //
        // // The last section should be the content of the last slide
        // const lastSlideContent = sections[sections.length - 1];
        //
        // // Prepare the content for index.md
        // let newIndexContent = `---\n${header}\n---\n${lastSlideContent}`;
        //
        // newIndexContent = newIndexContent.replace("paginate: \"true\"", "paginate: \"false\"");
        //
        // // Determine the path for index.md in the same directory
        // const directory = path.dirname(inputFilePath);
        // const indexFilePath = path.join(directory, 'index.md');
        //
        // // Write the new index.md file
        // await fsPromises.writeFile(indexFilePath, newIndexContent, 'utf8');
        const assetsFolder = getCurrentProjectFolder() + "/assets"
        // await copyAssetsFrom(assetsFolder);
        //
        const scriptFile = assetsFolder+ "/plain.template.js"
        await    generateHtmlWithScript(indexFilePath,scriptFile,generatedFileName);
        // console.log('index.md has been created successfully');
        return indexFilePath;
    } catch (err) {
        console.error('Error:', err);
    }
}
