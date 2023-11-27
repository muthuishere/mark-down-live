
import {openApp} from "./entrypoint.js";
describe('Entrypoint Tests', () => {
    it('Entrypoint should open a new electron Windowe', async () => {


       await openApp("http://localhost:9500")



    });


});;