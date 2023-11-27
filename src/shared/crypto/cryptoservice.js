import {CryptoRepository} from "./CryptoRepository.js";
import {getAppFolderPathForFile} from "../os_utils.js";

export const cryptoFile = getAppFolderPathForFile('.githuborgapiCrypto.json');
let cryptoRepository = new CryptoRepository(cryptoFile)
export function encryptValue(value) {
    return cryptoRepository.encrypt(value)
}

export function decryptValue(encryptedValue) {
    return cryptoRepository.decrypt(encryptedValue)
}

