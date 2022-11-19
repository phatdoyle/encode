import { Group5Token__factory } from "./../typechain-types/factories/contracts/ERC20Votes.sol/Group5Token__factory";
import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

async function deploy() {
  // use ethers to connect to goerli and wallet to create a signer
  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ALCHEMY_API_KEY,
    infura: process.env.INFURA_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
  });
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  const signer = wallet.connect(provider);
  const balance = await signer.getBalance();
  console.log(
    `Working on Goerli Testnet connected to wallet ${signer.address} with balance of ${balance}`
  );
  // connect to token contract onchain with signer and contract address passed in from cli argument
  const tokenFactory = new Group5Token__factory(signer);
  const tokenContract = await tokenFactory.attach(process.argv[2]);
  const initTokens = await tokenContract.balanceOf(signer.address);
  const delegateAddress = process.argv[3];
  const initDelPower = await tokenContract.getVotes(delegateAddress);
  const initSignPower = await tokenContract.getVotes(signer.address);
  console.log(
    `Account ${signer.address} currently has ${initTokens} G5 tokens`
  );
  console.log(
    `Account ${signer.address} currently has ${initSignPower} voting power`
  );
  signer.address !== delegateAddress &&
    console.log(
      `Account ${delegateAddress} currently has ${initDelPower} voting power`
    );
  console.log(`Delegating to ${delegateAddress}...`);
  // delegate voting power from signer to address from cli args
  const delegateTx = await tokenContract.delegate(delegateAddress);
  await delegateTx.wait();
  const afterDelPower = await tokenContract.getVotes(delegateAddress);
  const afterSignPower = await tokenContract.getVotes(signer.address);
  console.log(
    `Account ${signer.address} now has ${afterSignPower} voting power`
  );
  signer.address !== delegateAddress &&
    console.log(
      `Account ${delegateAddress} now has ${afterDelPower} voting power`
    );
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
