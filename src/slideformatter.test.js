import {formatAndBuild} from "./slideformatter.js";
import fs from 'fs';
import { expect } from 'chai';
import {getCurrentProjectFolder} from "./shared/os_utils.js";
describe('slideformatter', () => {
    it('should format a slide', async () => {
        //testdata/mockdocs/full-testcontainer.md
        const markdownFile = getCurrentProjectFolder() +'/testdata/mockdocs/full-testcontainer.md';

        await formatAndBuild(markdownFile);

       // expect file to be available in dist folder
        const result = fs.readFileSync('./dist/full-testcontainer.md', 'utf8');
        expect(result).not.to.be.null;


    });
});;