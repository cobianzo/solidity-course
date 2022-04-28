const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());  // the provider could be replaced by another one. In this case we use the ganache Network as a testing Network.
const { interface, bytecode } = require("../compile"); // check compile.js, where we use the solidity lib to compile the index.sol and grab the compiled code.

let accounts;
let inboxContract;
beforeEach( async function(){
  
    // fetch all the test accounts that ganache has created for us inside the web3 lib.
    accounts = await web3.eth.getAccounts().on('error', console.error);;

    // use the first account to deploy the contract, using the compiled code and the interface.
    const firstAccount = accounts[0];
    inboxContract = await new web3.eth.Contract( JSON.parse( interface ) )
        .deploy({ 
            data: bytecode,
            arguments: ['Hi there!'] })
        .send({ from: firstAccount, gas: '1000000' })
        .on('error', console.error);
} );

describe('Inbox', function(){
    
    it('deploy our Inbox contract: ', () => {
        console.log(inboxContract);

    } );
})