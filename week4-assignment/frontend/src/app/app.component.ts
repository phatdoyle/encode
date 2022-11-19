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
  provider: ethers.providers.BaseProvider | undefined;
  etherBalance: number |undefined
  tokenContract: ethers.Contract | undefined;
  tokenBalance: number | undefined;
  votePower: number | undefined;
  tokenContractAddress: string | undefined; 

  constructor(private http: HttpClient) { 
    this.http.get<any>("http://localhost:3000/token-address").subscribe((ans)=>{
      console.log(ans)
      this.tokenContractAddress = ans.result
    })
  }

  //DONE
  createWallet() {
    this.provider = ethers.providers.getDefaultProvider('goerli');
    this.wallet = ethers.Wallet.createRandom().connect(this.provider);
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
