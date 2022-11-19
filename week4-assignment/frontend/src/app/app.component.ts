import { Component } from '@angular/core';
import {ethers} from 'ethers'
import tokenJson from "../assets/MyToken.json";
import { HttpClient } from '@angular/common/http';

const ERC20VOTES_TOKEN_ADDRESS = "0xd6CD9823d1b9a8F215Fc0230FF712CbA57c53d40"


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})



export class AppComponent {
  wallet: ethers.Wallet | undefined;
  walletAddress: any | undefined; 
  provider: ethers.providers.BaseProvider | undefined | any;
  etherBalance: number |string | undefined
  tokenContract: ethers.Contract | undefined;
  tokenBalance: number | undefined;
  votePower: number | undefined;
  tokenContractAddress: string | undefined; 
  latestBlock: any | undefined; 
  network: any | undefined


  constructor(private http: HttpClient) { 
    this.http.get<any>("http://localhost:3000/token-address").subscribe((ans)=>{
      console.log(ans)
      this.tokenContractAddress = ans.result
    })
    this.http.get<any>("http://localhost:3000/last-block").subscribe((ans)=>{
      console.log(ans)
      this.latestBlock = ans.number
    })
  }

  //DONE
  async createWallet() {
    this.provider = ethers.providers.getDefaultProvider('goerli');
    this.network = ethers.providers.getNetwork('goerli').name

    this.wallet = ethers.Wallet.createRandom().connect(this.provider);
    this.walletAddress =  await ethers.Wallet.createRandom().connect(this.provider).getAddress();
    console.log(this.wallet)
    console.log(this.tokenContractAddress)
    if(this.tokenContractAddress){
      this.tokenContract = new ethers.Contract(
        this.tokenContractAddress,
        tokenJson.abi,
        this.wallet
      );
      this.wallet.getBalance().then((balanceBn) => {
        this.etherBalance = parseFloat(ethers.utils.formatEther(balanceBn));
      });
      this.tokenContract['balanceOf'](this.wallet.address).then(
        (tokenBalanceBn:any) => {
          console.log(tokenBalanceBn)
          this.tokenBalance = parseFloat(
            ethers.utils.formatEther(tokenBalanceBn)
          );
        }
      );
      this.tokenContract['getVotes'](this.wallet.address).then(
        (votePowerBn:any) => {
          this.votePower = parseFloat(ethers.utils.formatEther(votePowerBn)) + 5;
        }
      );
    }
  }

  //Connect Via Metamask
  async connectWallet(){
    if(this.tokenContractAddress){
        //connecting to injected web3 provider. 
        this.provider = new ethers.providers.Web3Provider(window.ethereum)
        //requesting list of accounts from injected web3
        await this.provider.send("eth_requestAccounts", []);
        //Getting Wallet object. 
        this.wallet  = await this.provider.getSigner();
        this.walletAddress = await this.wallet?.getAddress()

        this.tokenContract = new ethers.Contract(
          this.tokenContractAddress,
          tokenJson.abi,
          this.wallet
        );
        this.wallet?.getBalance().then((balanceBn) => {
          this.etherBalance = parseFloat(ethers.utils.formatEther(balanceBn)).toPrecision(4);
        });

        this.tokenContract['balanceOf'](this.walletAddress()).then(
          (tokenBalanceBn:any) => {
            this.tokenBalance = parseFloat(
              ethers.utils.formatEther(tokenBalanceBn)
            );
          }
        );
        this.tokenContract['getVotes'](this.walletAddress).then(
          (votePowerBn:any) => {
            this.votePower = parseFloat(ethers.utils.formatEther(votePowerBn)) + 5;
          }
        );
        
    }
   
  }

  //TO-DO: 
  vote(voteId: string){
    console.log("trying to vote" + voteId)
  }

  request(){
    this.http.post<any>("http://localhost:3000/request-token", {}).subscribe((ans)=> {
      console.log(ans)
    })
  }
}
