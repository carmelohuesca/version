const fs = require('fs');
const path = require('path');
const { SHA256, SHA512, SHA1 } = require('crypto-js');
const CryptoJs = require('crypto-js');
class Audit {

    constructor() {
        this.run('car');
        // this.run('product');
    }

    run = (filename) => {
        console.log('audit is running!');
        const f = this.getFile(path.join(__dirname, '../', 'src', filename + '.js'));
        console.log(f);
        const hash = SHA256(f);
        const sha1 = SHA1(f);
        const sha512 = SHA512(f);
        console.log(hash.toString(CryptoJs.enc.Hex));
        console.log(sha1.toString(CryptoJs.enc.Hex));
        console.log(sha512.toString(CryptoJs.enc.Hex));
    }

    getFile = filename => fs.readFileSync(filename, 'utf8');

}

console.log('audit is loaded!');

new Audit();

module.exports = { Audit }; 