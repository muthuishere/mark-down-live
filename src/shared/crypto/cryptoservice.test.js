import {decryptValue, encryptValue} from "./cryptoservice.js";
import {expect} from "chai";

describe("crypto Service tests",()=>{

    it("should encrypt and decrypt",()=>{

        const value = "Halo this is a sample {}"
        const encrypted  = encryptValue(value)
        console.log(encrypted)
        const  decrypted = decryptValue(encrypted)
        expect(decrypted).to.be.equal(value)
    })

})
