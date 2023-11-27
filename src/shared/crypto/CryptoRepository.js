import os from "os";
import fs from "fs";
import crypto from "crypto";

export class CryptoRepository {
    constructor(cryptoFile) {

        this.cryptoFile = cryptoFile;

        if (fs.existsSync(this.cryptoFile)) {
            const input = this.readFromFile();
            this.cryptoData = JSON.parse(input);
        }else{
            this.cryptoData=this.generateCryptoHash();
            this.syncWithFile()
        }
    }

    getSecret() {

            return this.cryptoData.hash;
    }


    encrypt(value){
        const secret=this.getSecret()
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secret, 'hex'), iv);
        let encrypted = cipher.update(value, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + encrypted;
    }

    decrypt(encryptedValue){
        const secret=this.getSecret()
        const iv = Buffer.from(encryptedValue.slice(0, 32), 'hex');
        const encrypted = encryptedValue.slice(32);
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secret, 'hex'), iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }


    syncWithFile() {
        // sync crypto with the database
        fs.writeFileSync(this.cryptoFile, JSON.stringify(this.cryptoData));
    }
    readFromFile() {
        // sync crypto with the database
        return fs.readFileSync(this.cryptoFile, 'utf8')
    }

    clearAll(){
        this.crypto={}
        fs.writeFileSync(this.cryptoFile,JSON.stringify({}))
    }


    generateCryptoHash(){
        const hostname = os.hostname();
        const cpus = os.cpus();
        const networkInterfaces = os.networkInterfaces();

        const systemInfo = {
            hostname,
            cpus,
            networkInterfaces,
        };

        const hash = crypto.createHash('sha256');
        hash.update(JSON.stringify(systemInfo));
        return {"hash": hash.digest('hex')};
    }
}

