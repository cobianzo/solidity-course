const path  = require('path');
const fs    = require('fs');
const solc  = require('solc'); // from package solc, previously installed. 

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

const export_this = solc.compile(source, 1).contracts[':Inbox'];

module.exports = export_this; // we use it in the test file to create the contract with this sol source code.