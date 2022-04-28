const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const {interface, bytecode} = require("./compile");
require('dotenv').config();

const provider = new HDWalletProvider(
    process.env.METAMASK_MNEMONIC,
    'https://rinkeby.infura.io/v3/bdae6f3a69a14752b96941a42bb29aec'
);

const web3 = new Web3(provider); // we have the instance of the web3 lib, with the provider.


// 1. get teh accounts in the network with our mneumonic. We need to do in a function in order to use async. (I like it more than promise)
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    // get the instance of our contract, just deployed.
    const result = await new web3.eth.Contract( JSON.parse(interface) )
            .deploy( { data: bytecode, arguments: [ 'Hi TTHERE'] } )
            .send( { gas: '1000000', from: accounts[0] } );
        
    console.log('Contract deployed to', result.options.address); // from the instance we can know the address of the contract.

    provider.engine.stop();
}
deploy(); 