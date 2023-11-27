import {expect} from "chai";
import {startServer} from "./sliderunner.js";
import {getCurrentProjectFolder} from "./shared/os_utils.js";


describe('slide runner test',   function() {

    it('should add two numbers', async () => {

        const folder = getCurrentProjectFolder() + "/dist";
      await startServer(folder)
    });

});