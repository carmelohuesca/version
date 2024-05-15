const fs = require('fs');
const path = require('path');
const files = fs.readdirSync(__dirname).filter(file => file !== 'index.js');
const loader = () => files.forEach(file => require(path.join(__dirname, file)))
loader();

module.exports = { loader };