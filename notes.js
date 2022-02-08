

// npm run start

// ========== steps ==============
// npx create-react-app usdc-app
// cd usdc-app
// npm i -D hardhat
// npx hardhat
// install suggested plug-ins

// for smart contracts: npm i @openzeppelin/contracts

// npx hardhat compile
// npx hardhat node
// new window

// deploy to localhost
// npx hardhat run scripts/deploy.js --network localhost
// can check the node window for activity


// start React
// npm start

// ---------ropsten-----------
// deploy to ropsten
// npx hardhat run scripts/deploy.js --network ropsten



// compile again
// npx hardhat compile

// deployed to -> artifacts/Token.sol/Token.json

// update scripts/deploy.js with the new contract details

// he deploys to local host again
/*

Token deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
*/

// import Contract Address to metamask as a new token


//=====================Console================================
 // npx hardhat console

  // > const Greeter = await hre.ethers.getContractFactory("Greeter");

  // > const greeter = await Greeter.deploy("Hello, Hardhat!");
  // Deploying a Greeter with greeting: Hello, Hardhat!

  //> console.log(await greeter.greet())
  // Hello, Hardhat!

  // > console.log(await greeter.setGreeting("hola hardhat "))
  //Changing greeting from 'Hello, Hardhat!' to 'hola hardhat '



/*
-------------------REAL TOKEN------------------------

> const RealToken = await hre.ethers.getContractFactory("RealToken")
undefined
> const realtoken = await RealToken.deploy()
> console.log(await realtoken.deployed())
----------------------------------------------------------
functions: {
  'allowance(address,address)': [FunctionFragment],
  'approve(address,uint256)': [FunctionFragment],
  'balanceOf(address)': [FunctionFragment],
  'decimals()': [FunctionFragment],
  'decreaseAllowance(address,uint256)': [FunctionFragment],
  'increaseAllowance(address,uint256)': [FunctionFragment],
  'name()': [FunctionFragment],
  'symbol()': [FunctionFragment],
  'totalSupply()': [FunctionFragment],
  'transfer(address,uint256)': [FunctionFragment],
  'transferFrom(address,address,uint256)': [FunctionFragment]
},
errors: {},
events: {
  'Approval(address,address,uint256)': [EventFragment],
  'Transfer(address,address,uint256)': [EventFragment]

----------------------------------------------------------
> console.log(await realtoken.name())
RealToken

> console.log(await realtoken.symbol())
RETK
*/





//------------------Real token contract--------------------
// It appears the transferFrom function works by the msg.sender address, allowing a second address to spend on it's behalf. In Remix...

// step 1 (approve)
// Address msg.sender(addr #1) approves another address(addr #2) to spend a given amount, hence the allowance.

// function approve(address spender, uint256 amount) external returns (bool);

// step 2 (allowance)
// Check the balance of the allowance
// function allowance(address owner, address spender) external view returns (uint256);

// step 3 (transferFrom)
// From the second account's address(addr #2), the "sender" is the first address(msg.sender).

// sender: msg.sender(addr #1)
// recipient: this will be a third address(addr #3)
// amount: this amount needs to be equal or less than the allowance

//function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

// So addr #1, allowed addr #2, to spend and send funds to addr #3, on it's behalf.


