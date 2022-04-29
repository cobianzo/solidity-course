const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require("../compile");

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
});
describe("Lottery Contract", () => {
  it("deploys a contract", () => {
    assert.ok(lottery.options.address);
  });

  it("allows one account to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
  });

  it("allows multiple accounts to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.02", "ether"),
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei("0.02", "ether"),
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(3, players.length);
  });

  it("requires a minimum amount of ether to enter", async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 0,
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("only manager can call pickWinner", async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("dont allow picking a winner if no players", async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[0],
      });
      assert(false);
    } catch (err) {
      assert(err);
    }

  })


  it("sends money to the winner and resets the players array", async () => {
    // enter 1 account with 2 weis
    const PLAYER_BET = web3.utils.toWei("2", "ether"); // in weis
    const GAS_SPENT_POSSIBLY = web3.utils.toWei("0.2", "ether"); // in weis

    // Let's pay with a bet
    await lottery.methods.enter().send({
      from: accounts[0],
      value: PLAYER_BET,
    });

    // First test: the balance in the contract should be equal to the sum of all bets (in this case 1 bet)
    let allPlayersBets = PLAYER_BET; // if more players, this will be the sum of all bets.
    let balance = await lottery.methods.getBalance().call();
    assert(allPlayersBets == balance, 'balance is not equal to player bet'); 
    
    // fond the balance in the network for that account before picking a winner.
    const initialBalance = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    // compare the balance of the winner. There is only one participant so the account 0 will be the winner.
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initialBalance;

    // the winning money is slightly less that 2 due to the gas cost.
    
    const allOk = difference > (allPlayersBets - GAS_SPENT_POSSIBLY);
    assert(allOk, 'balance is not equal to player bet');
    
    // Second check: balance after payment to winner should be 0.
    balance = await lottery.methods.getBalance().call();
    assert(0 == balance, 'balance in the contract has not been emptied'); 
    
  });
});
