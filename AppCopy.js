import { ethers } from "ethers";
import { useState, useEffect } from 'react';
import './App.css';
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import RealToken from './artifacts/contracts/RealToken.sol/RealToken.json';

// https://youtu.be/a0osIaAOFSE
// the complete guide to full stack ehtereum development - tutorial for beginners

// ERC20 functions explained
//https://ethereum.org/en/developers/tutorials/understand-the-erc-20-token-smart-contract/#:~:text=The%20ERC%2D20%20standard%20allows,spend%20on%20behalf%20of%20owner%20.

//contract address
const greeterAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const tokenAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [txComplete, setTxComplete] = useState(false);
  const [addressOwner, setAddressOwner] = useState(" ");
  const [addressRecipient, setAddressRecipient] = useState(" ");
  const [addressSpender, setAddressSpender] = useState(" ");
  const [addressSender, setAddressSender] = useState(" ");
  const [transferFromAmount, setTransferFromAmount] = useState();

  const [amount, setAmount] = useState();
  const [contractInfo, setContractInfo] = useState([]);

  const [allowanceAmount, setAllowanceAmount] = useState();
  const [allowanceApprove, setAllowanceApprove] = useState(false);

  const [tokenName, setTokenName] = useState(" ");
  const [tokenSymbol, setTokenSymbol] = useState(" ");
  const [tokenTotalSupply, setTokenTotalSupply] = useState([]);
 

  const [greeting, setGreetingValue] = useState(" ");
  const [fetched, setFetched] = useState(" ");
  const [newTransaction, newSetTransaction] = useState(false);

  const requestAccount = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }


  // function balanceOf(address account) external view returns (uint256);

  const getBalance = async () => {
    // if window.ethereum is not undefined, request accounts
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      // create new provider and new Contract instance(address, abi, provider)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, RealToken.abi, provider);
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
      setContractInfo(balance.toString());

      const name = await contract.name();
      console.log("Name: ", name);
      setTokenName(name);

      const symbol = await contract.symbol();
      console.log("Symbol: ", symbol);
      setTokenSymbol(symbol);

      const totalSupply = await contract.totalSupply();
      console.log("Total Supply: ", totalSupply.toString());
      setTokenTotalSupply(totalSupply.toString());

    }
  }

  //function approve(address spender, uint256 amount) external returns (bool);

  const sendApprove = async () => {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, RealToken.abi, signer);
      const transaction = await contract.approve(addressSpender, amount);
      await transaction.wait();
      console.log("Approved: ", addressSpender);
      setAllowanceApprove(true);
    }
  };


  // function allowance(address owner, address spender) external view returns (uint256);

  const getAllowance = async () => {
    if (typeof window.ethereum !== "undefined") {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, RealToken.abi, provider);
      const balance = await contract.balanceOf(account);
      console.log(balance);
      const allowance = await contract.allowance(addressOwner, addressSpender);
      console.log("Allowance: ", allowance.toString());
      setAllowanceAmount(allowance.toString());
    }
  }



  //function transfer(address recipient, uint256 amount) external returns (bool);

  const transferCoins = async () => {
    // if window.ethereum is not equal to undefined, then metamask is connected and we can wait for our request
    try {
      if (!window.ethereum) return alert("Please install Metamask");
      await requestAccount();
      // create new provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // create new contract instance and add address, abi & signer
      const contract = new ethers.Contract(tokenAddress, RealToken.abi, signer);
      // send transaction to recipient with correct amount
      const transaction = await contract.transfer(addressRecipient, amount);
      // wait for tx to execute and complete
      await transaction.wait();
      console.log(`${amount} Coins successfully sent to ${addressRecipient}`);
      newSetTransaction(true);
    } catch (error) {
      console.log(error);
      if(error) return alert("amount exceeds balance");
    }
  }

  //function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

  const transferCoinsFrom = async () => {
    try {
      if (!window.ethereum) return alert("Please install Metamask");
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, RealToken.abi, signer);
      const transactionFrom = await contract.transferFrom(addressSender, addressRecipient, transferFromAmount);
      setIsLoading(true);
      await transactionFrom.wait();
      setIsLoading(false);
      console.log(`Success! -- ${transferFromAmount} was sent to ${addressRecipient}`);
      setTxComplete(true);
    } catch (error) {
      console.log(error);
      if(error) return alert("amount exceeds balance, allowance or wrong account");
    }
  }

  const fetchGreeting = async () => {
    if (typeof window.ethereum !== "undefined") { // check for metamask
      // new provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // contract instance - pass address, abi, provider
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
      // return values
      try {
        const data = await contract.greet()
        setFetched(data);
        console.log('data: ', data)
      } catch (error) {
        console.log("error: ", error)
      }
    }

  }

  // TRANSACTION
  const setGreeting = async () => {
    if (!greeting) return // check for a greeting
    if (typeof window.ethereum !== 'undefined') { // check for metamask
      await requestAccount() // wait for user to connect
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(); // approve
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer); // new instance, this time with signer
      const transaction = await contract.setGreeting(greeting); // user input
      setGreetingValue(""); // clear
      await transaction.wait(); // wait for confirmation
      fetchGreeting(); //logout new value
    }

  }


  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input
          onChange={(e) => setGreetingValue(e.target.value)}
          placeholder="Set greeting"
          value={greeting}
        />
        <div>
          <h1>{fetched}</h1>
        </div>
        <br />
        {/* account info */}
        <button onClick={getBalance}>Account Details / Balance</button>
        <div>
          <div>
            <h6>Balance $ {contractInfo}</h6>
          </div>
          <div>
            <h6>Token: {tokenName}</h6>
          </div>
          <div>
            <h6>Symbol: {tokenSymbol}</h6>
          </div>
          <div>
            <h6>Total Supply: {tokenTotalSupply}</h6>
          </div>
        </div>
        <br />
        {/* transfer */}
        <input onChange={(e) => setAddressRecipient(e.target.value)} placeholder="Recipient" />
        <input onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <button onClick={transferCoins}>Transfer Coins</button>
        <div>
          {newTransaction &&
            <h6>{amount} Coins successfully sent to {addressRecipient}</h6>
          }
        </div>
        <br />
        {/* approve */}
        <input onChange={(e) => setAddressSpender(e.target.value)} placeholder="Spender" />
        <input onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <button onClick={sendApprove}>Approve</button>
        <div>
          {allowanceApprove &&
            <h6>Account: {addressSpender} -- Approved to spend!</h6>
          }
        </div>
        <br />
        {/* allowance */}
        <input onChange={(e) => setAddressOwner(e.target.value)} placeholder="Owner" />
        <input onChange={(e) => setAddressSpender(e.target.value)} placeholder="Spender" />
        <button onClick={getAllowance}>Allowance</button>
        <div>
          {allowanceAmount &&
            <h6>Amount you are allowed to spend: $ {allowanceAmount}</h6>
          }
        </div>
        <br />
        {/* transfer from */}
        <input onChange={(e) => setAddressSender(e.target.value)} placeholder="Spender" />
        <input onChange={(e) => setAddressRecipient(e.target.value)} placeholder="Recipient" />
        <input onChange={(e) => setTransferFromAmount(e.target.value)} placeholder="Amount" />
        <button onClick={transferCoinsFrom}>Transfer from</button>
        <div>
          {txComplete && (
            <h6>Success! -- tx sent to {addressRecipient}</h6>
          )}
        </div>
      

      </header>
    </div>
  );
}

export default App;

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

// deploy to localhost
// npx hardhat run scripts/deploy.js --network localhost
// contract address deployed: 0x5FbDB2315678afecb367f032d93F642f64180aa3

// start React
// npm 

// ---------ropsten-----------
// deploy to ropsten
//npx hardhat run scripts/deploy.js --network ropsten

// Greeter deployed to: 0x8AA7620B1503Db110bF306d701Ff92b77A0C513a

// compile again
// npx hardhat compile

// deployed to -> artifacts/Token.sol/Token.json

// update scripts/deploy.js with the new contract details

// he deploys to local host again
/*
Greeter deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Token deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
*/

// import Contract Address to metamask as a new token