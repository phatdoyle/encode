import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from "./assets/MyERC20.json";

export class PaymentOrder{
  value: number;
  id: number;
  secret: string;
}

export class CreatePaymentOrderDto {
  value: number;
  secret: string
}

export class RequestPaymentOrderDto {
  id: number;
  secret: string;
  receiver: string;
}

const ERC20VOTES_TOKEN_ADDRESS = "0xd6CD9823d1b9a8F215Fc0230FF712CbA57c53d40"

@Injectable()
export class AppService {
  
  provider: ethers.providers.BaseProvider; 
  erc20ContractFactor: ethers.ContractFactory;
  erc20Contract: ethers.Contract;
  paymentOrder: PaymentOrder[];

  constructor(){
    this.provider = ethers.getDefaultProvider('goerli')
    this.erc20ContractFactor = new ethers.ContractFactory(tokenJson.abi, tokenJson.bytecode);
    this.paymentOrder = [];
    this.erc20Contract = this.erc20ContractFactor.attach(ERC20VOTES_TOKEN_ADDRESS)
    //const signer = ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
  }

  getBlock(blockNumberOrTag: string = 'latest'): Promise<ethers.providers.Block> {
    return this.provider.getBlock(blockNumberOrTag);
  }

  async getTotalSupply(address:string): Promise <number>{
    const contractInstance = this.erc20ContractFactor.attach(address).connect(this.provider)
    const totalSupply = await contractInstance.totalSupply();
    return parseFloat(ethers.utils.formatEther(totalSupply))
  }

  async getAllowance(contractAddress:string, from:string, to:string): Promise <number>{
    const contractInstance = this.erc20ContractFactor.attach(contractAddress).connect(this.provider)
    const allowance = await contractInstance.allowance(from, to);
    return parseFloat(ethers.utils.formatEther(allowance))
  }

  getPaymentOrder(id: number){
    const paymentOrder =  this.paymentOrder[id];

    return {value: paymentOrder.value, id: paymentOrder.id}
  }

  createPaymentOrder(value: number, secret: string){
    const newPaymentOrder = new PaymentOrder();
    newPaymentOrder.value = value;
    newPaymentOrder.secret = secret;
    newPaymentOrder.id = this.paymentOrder.length;
    this.paymentOrder.push(newPaymentOrder)
    return newPaymentOrder.id
  }

  async requestPaymentOrder(id: number, secret: string, receiver: string){
    const paymentOrder = this.paymentOrder[id]
     if(secret != paymentOrder.secret) throw new Error("wrong Secret")
     const signer = ethers.Wallet.createRandom().connect(this.provider);
     const contractInstance = this.erc20ContractFactor.attach("addres in dotenv file").connect(signer)
     const tx = await contractInstance.mint(receiver)
     return tx.wait()

  }

  requestTokens(){
    return true;
  }

  getTokenContract(){
    return ERC20VOTES_TOKEN_ADDRESS
  }

}