const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());  // the provider could be replaced by another one. In this case we use the ganache Network as a testing Network.
const { interface, bytecode } = require("../compile"); // check compile.js, where we use the solidity lib to compile the index.sol and grab the compiled code.

let accounts;
let inboxContract;
let INITIAL_MESSAGE = "Hi there!";
beforeEach( async () => {
  
    // fetch all the test accounts that ganache has created for us inside the web3 lib.
    accounts = await web3.eth.getAccounts();

    // use the first account to deploy the contract, using the compiled code and the interface.
    const firstAccount = accounts[0];
    inboxContract = await new web3.eth.Contract( JSON.parse( interface ) )
        .deploy({ 
            data: bytecode,
            arguments: [ INITIAL_MESSAGE ] })
        .send({ from: firstAccount, gas: '1000000' })
        .on('error', console.error);
} );

describe('Inbox', () => {
    
    it('deploy our Inbox contract: ', () => {
        assert.ok( inboxContract.options.address );
    } );

    it('Check default message after creation', async () => {
        const message = await inboxContract.methods.message().call();
        assert.equal(message, INITIAL_MESSAGE);
    });
    it("can change the message", async () => {

        const NEW_MESSAGE = "BYE BYE!";
        const transaction = await inboxContract.methods.setMessage(NEW_MESSAGE).send({ from: accounts[0] }); // call() is used to send the transaction to the network.
        const msgRetrieved   = await inboxContract.methods.message().call();
        console.log('<>>>>', transaction.transactionHash);
        assert.equal(msgRetrieved, NEW_MESSAGE);

        // await inboxContract.methods.setMessage("bye").send({ from: accounts[0] });
        // const message = await inboxContract.methods.message().call();
        // assert.equal(message, "bye");
      });
})