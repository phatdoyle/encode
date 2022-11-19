import { Group5Token__factory } from "../typechain-types/factories/contracts/ERC20Votes.sol/Group5Token__factory";
import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
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
  const voteAddress = process.argv[3];
  const initTokens = await tokenContract.balanceOf(voteAddress);
  const lastBlock = await provider.getBlock("latest");
  const voteBlock = process.argv[4] ?? lastBlock.number - 1;
  const power = await tokenContract.getPastVotes(voteAddress, voteBlock);
  console.log(
    `Account ${voteAddress} has ${initTokens} tokens and a voting power of ${power} at block ${voteBlock}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
