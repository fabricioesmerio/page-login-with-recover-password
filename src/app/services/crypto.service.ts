import * as CryptoJS from "crypto-js";


export class CryptoService {

    private key = CryptoJS.enc.Utf8.parse( 'QwErTGfPcDWkjRyggKWaOC==' );
    private iv = CryptoJS.enc.Utf8.parse( 'UhW$n$4vGHiJ$uVr' );
    // private iv = 'UhW$n$4vGHiJ$uVr';
    // private key = 'QwErTGfPcDWkjRyggKWaOC==';
    
    constructor() {
        
    }

    encrypt(value: string) {
        let valueEncrypt = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value), this.key, {
            keySize: 128 /8,
            iv: this.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })
        return valueEncrypt.toString();
    }

    decrypt(encryptText: string) {
        let decrypted = CryptoJS.AES.decrypt(encryptText.trim(), this.key, {
            keySize: 128 / 8,
            iv: this.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding
        })
        return decrypted.toString(CryptoJS.enc.Utf8)
    }
}