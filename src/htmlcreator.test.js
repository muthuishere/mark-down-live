import {startServer} from "./server.js";
import {getCurrentProjectFolder} from "./shared/os_utils.js";


describe('slide runner test',   function() {

    it('should add two numbers', async () => {

        const folder = getCurrentProjectFolder() + "/dist";
      await startServer(folder)
    });

});