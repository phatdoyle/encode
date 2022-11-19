import { TokenizedBallot__factory } from "./../typechain-types/factories/contracts/TokenizedBallot.sol/TokenizedBallot__factory";
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
  const ballotFactory = new TokenizedBallot__factory(signer);
  const ballotContract = await ballotFactory.attach(process.argv[2]);
  console.log("Sending vote...");
  const voteTx = await ballotContract.vote(process.argv[3], process.argv[4]);
  voteTx.wait();
  console.log("vote complete");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
