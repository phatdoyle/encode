import { Component } from '@angular/core';
import {ethers} from 'ethers'
import tokenJson from "../assets/MyToken.json";
import ballotJson from "../assets/TokenizedBallot.json";
import { HttpClient } from '@angular/common/http';


//Group #5 Token Address
const ERC20VOTES_TOKEN_ADDRESS = "0x0CBBA32981898231078CDAD4c621D734492CF02D"
const TOKENIZED_BALLOT_ADDRESS = '0x4139f19c196D3A51f2Bd8D3386cE2BcFB086e961'


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
  ballotContract?: ethers.Contract | undefined;
  tokenBalance: number | undefined;
  votePower: number | undefined;
  tokenContractAddress: string | undefined;
  ballotContractAddress: string| undefined; 
  latestBlock: any | undefined; 
  network: any | undefined
  proposal1: any | undefined
  proposal2: any | undefined
  proposal3: any | undefined
  proposal4: any | undefined


  constructor(private http: HttpClient) { 
    this.http.get<any>("http://localhost:3000/token-address").subscribe((ans)=>{
      this.tokenContractAddress = ans.result
    })
    this.http.get<any>("http://localhost:3000/last-block").subscribe((ans)=>{
      this.latestBlock = ans.number
    })
    this.http.get<any>("http://localhost:3000/ballot-address").subscribe((ans)=>{
      console.log(ans.result)
      this.ballotContractAddress = ans.result
    })
    this.http.get<any>("http://localhost:3000/proposals/0").subscribe((ans)=>{
      console.log(ans)
      this.proposal1 = ans.result
    })
    this.http.get<any>("http://localhost:3000/proposals/1").subscribe((ans)=>{
      console.log(ans)
      this.proposal2 = ans.result
    })
    this.http.get<any>("http://localhost:3000/proposals/2").subscribe((ans)=>{
      console.log(ans)
      this.proposal3 = ans.result
    })
    this.http.get<any>("http://localhost:3000/proposals/3").subscribe((ans)=>{
      console.log(ans)
      this.proposal4 = ans.result
    })
 
  }

  //DONE
  async createWallet() {
    this.provider = ethers.providers.getDefaultProvider('goerli');
    this.network = ethers.providers.getNetwork('goerli').name

    this.wallet = ethers.Wallet.createRandom().connect(this.provider);
    this.walletAddress =  await ethers.Wallet.createRandom().connect(this.provider).getAddress();
  
    if(this.tokenContractAddress){


        //Instantiate Token Contract
        this.tokenContract = new ethers.Contract(
          this.tokenContractAddress,
          tokenJson.abi,
          this.wallet
        );
        
        //Instantiate Ballot Contract
        this.ballotContract = new ethers.Contract(
          this.tokenContractAddress,
          ballotJson.abi,
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

  //Connect Via Metamask
  async connectWallet(){
    if(this.tokenContractAddress && this.ballotContractAddress){
        //connecting to injected web3 provider. 
        this.provider = new ethers.providers.Web3Provider(window.ethereum)
        this.network = ethers.providers.getNetwork('goerli').name
        //requesting list of accounts from injected web3
        await this.provider.send("eth_requestAccounts", []);
        //Getting Wallet object. 
        this.wallet  = await this.provider.getSigner();
        this.walletAddress = await this.wallet?.getAddress()

        //Instantiate Token Contract
        this.tokenContract = new ethers.Contract(
          this.tokenContractAddress,
          tokenJson.abi,
          this.wallet
        );
        console.log("contract", this.tokenContractAddress)
        //Instantiate Ballot Contract
        this.ballotContract = await new ethers.Contract(
          this.ballotContractAddress,
          ballotJson.abi,
          this.wallet
        );

        console.log("ballot", this.ballotContractAddress)
        

        this.wallet?.getBalance().then((balanceBn) => {
          this.etherBalance = parseFloat(ethers.utils.formatEther(balanceBn)).toPrecision(4);
        });

        this.tokenContract['balanceOf'](this.walletAddress).then(
          (tokenBalanceBn:any) => {
            this.tokenBalance = parseFloat(
              ethers.utils.formatEther(tokenBalanceBn)
            );
          }
        );
        this.tokenContract['getVotes'](this.walletAddress).then(
          (votePowerBn:any) => {
            this.votePower = parseFloat(ethers.utils.formatEther(votePowerBn));
            console.log(this.votePower)
          }
        );
        
     
    }
   
  }

    //Cast Vote
  vote(proposalId: any, amount: any ){
      if(this.ballotContract){
        console.log(this.ballotContract['vote'])
        this.ballotContract['vote'](proposalId, amount)
      }
  }

  delegateVotes(address:string){
    if(this.tokenContract){
      this.tokenContract['delegate'](address)
    }
  }

  request(){
    this.http.post<any>("http://localhost:3000/request-token", {}).subscribe((ans)=> {
      console.log(ans)
    })
  }
}
