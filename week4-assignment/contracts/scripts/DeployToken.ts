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
  console.log("Deploying ERC20voting token...");
  // get token factory and use it to deploy an instance of token contract
  const tokenFactory = new Group5Token__factory(signer);
  const tokenContract = await tokenFactory.deploy();
  await tokenContract.deployed();
  console.log(
    `The ERC20 voting token smart contract was deployed at ${tokenContract.address}`
  );
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
