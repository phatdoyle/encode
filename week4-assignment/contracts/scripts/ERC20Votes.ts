import { ethers } from "hardhat";
import { Group5Token__factory } from "../typechain-types";

const MINT_VALUE = ethers.utils.parseEther("10");

async function main() {
  const accounts = await ethers.getSigners();
  // Deploy contract
  const contractFactory = new Group5Token__factory(accounts[0]);
  const contract = await contractFactory.deploy();
  await contract.deployed();
  console.log(`Token contract deployed at ${contract.address}`);
  // Mint some tokens
  const mintTx = await contract
    .connect(accounts[1])
    .buyTokens({ value: MINT_VALUE.mul(2) });
  await mintTx.wait();
  console.log(
    `Minted ${MINT_VALUE.toString()} decimal units to account ${
      accounts[1].address
    }`
  );
  const balanceBN = await contract.balanceOf(accounts[1].address);
  console.log(
    `Account ${
      accounts[1].address
    } has ${balanceBN.toString()} decimal units of MyToken`
  );
  // Check the voting power
  const votes = await contract.getVotes(accounts[1].address);
  console.log(
    `Account ${
      accounts[1].address
    } has ${votes.toString()} uints of voting power
    before self delegating`
  );
  // Self delgate
  const delegatTx = await contract
    .connect(accounts[1])
    .delegate(accounts[1].address);
  await delegatTx.wait();
  // Check the voting power
  const votesAfter = await contract.getVotes(accounts[1].address);
  console.log(
    `Account ${
      accounts[1].address
    } has ${votesAfter.toString()} uints of voting power
    after self delegating`
  );
  // Transfer tokens
  const transferTx = await contract
    .connect(accounts[1])
    .transfer(accounts[2].address, MINT_VALUE.div(2));
  await transferTx.wait();
  // Check the voting power
  const votes1AfterTransfer = await contract.getVotes(accounts[1].address);
  console.log(
    `Account ${
      accounts[1].address
    } has ${votes1AfterTransfer.toString()} uints of voting power
    after transferring tokens`
  );
  // Check the voting power
  const votes2AfterTransfer = await contract.getVotes(accounts[2].address);
  console.log(
    `Account ${
      accounts[2].address
    } has ${votes2AfterTransfer.toString()} uints of voting power
    after transferring tokens`
  );
  // Check past voting power
  const lastBlock = await ethers.provider.getBlock("latest");
  console.log(`Current block number is ${lastBlock.number}`);
  const pastVotes = await contract.getPastVotes(
    accounts[1].address,
    lastBlock.number - 1
  );
  console.log(
    `Account ${
      accounts[1].address
    } had ${pastVotes.toString()} units of voting power at previous block`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
