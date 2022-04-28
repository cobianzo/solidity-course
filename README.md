Code for the first smart contract in solidity.
===
Getting used to the environment:
---
Using the test Network in remix.ethereum.org, with the Javascript VM.  
- In that case there are no delays because validating the proof of work takes miliseconds.  
Creating account in Chrome extension Metamask, using the test Network Rinkeby
- We grab some test eth before we start. 
- Remix is good for starting and a quick set up of things, but at some point we want to test, git control etc. So we'll move into visual studio code to keep on editing things.

Creating our own network
---
- first testing with ganache (simulates the config in local of a node inside a network)
- Once it works in this testing environment, we go and try in a real Rinkeby network, the one we have set up in Metamask plugin. In this case we need to create a node, and instead of set up our computer as a node of the Rinkeby network, we use Infura to create that node, creating deploy.js
- Install Truffle with npi


The flow of things:
---
1) `package.json` - see all the libraries that we use with __npm__.  
2) `ourcontract.sol` - The source code, that we will compile into the assembler (bytecode) and legible code (ABI).  
2.1) `compile.js` - this will compila that __.sol__ file: We `export const { interface, bytecode }`
3) `test/ourcontract.test.js` - creation of the js interface with our contract: It is a combination of: 
3.1) __Web3__ js library, installed with npm.  
3.2) __Provider__, in the case of testing it is 'garache'.  (tiny local test network, transactions happen instantaniously)
3.3) With __mocha__ we run tests from the terminal (`npm run test`)
4) `deploy.js` - same as test, but the provider consists in:
4.1) `HDWalletProvider` npm library
4.2) mnemonic 12 words of our metamask account to create the addressess and unlock the account.
4.3) __Infura__ node, via an endpoint. Our node app will connect to the node to publish the contract.