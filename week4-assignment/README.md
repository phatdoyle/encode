# Weekend Project
* Form groups of 3 to 5 students
* Complete the projects together
* Create a voting dApp to cast votes, delegate and query results on chain
* Request voting tokens to be minted upon claim
* (bonus) Store a list of recent votes in the backend and display that on frontend


## Frontend Application: 
`cd encode/week4-assignment/frontend`
`npm i` | `yarn install`
`npm run start`

To-Do's
- [X] Connect Wallet Button (via injected web3 provider)
- [X] Create Wallet Button (see class example)
- [X] Instantiate instance of voting contract on frontend via ethers.js
- [ ] Create function to call `castVote` function in contract. 
- [ ] Create function to call `delegateVotes` function in contract. 
- [ ] Create function to call query results from the contract (Need to look more at how that data is stored). 


## Backend Application: 
`cd encode/week4-assignment/api`
`npm i` | `yarn install`
`npm run start:dev`

To-Do's
- [ ] Instantiate instance of voting contract on frontend via ethers.js
- [ ] Create post route to `castVote` function in contract. 
- [ ] Create post route to `delegateVotes` function in contract. 
- [ ] Create get route to `queryVotes` * need to look at exact contract names.  



## Smart Contracts: 
This should all be done from last weeks assignment. 
