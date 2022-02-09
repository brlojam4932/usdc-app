import { ethers } from "ethers";
import { useState, useEffect } from 'react';
import './App.css';
import RealToken from './artifacts/contracts/RealToken.sol/RealToken.json';
import TxList from "./TxList";
import "bootswatch/dist/darkly/bootstrap.min.css";

// https://youtu.be/a0osIaAOFSE
// the complete guide to full stack ehtereum development - tutorial for beginners

//https://youtu.be/38WUVVoMZKM
// read/write/events

// ERC20 functions explained
//https://ethereum.org/en/developers/tutorials/understand-the-erc-20-token-smart-contract/#:~:text=The%20ERC%2D20%20standard%20allows,spend%20on%20behalf%20of%20owner%20.

//contract address - paste into input
//const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
// on Robsten: 0xA03776A76f2dA35EdE6AA7199f7A427F969B3145

function App() {

  const [txs, setTxs] = useState([]);
  const [contractListened, setContractListened] = useState();
  const [error, setError] = useState(false);
  const [contractAddress, setContractAddress] = useState("-");
  const [contractInfo, setContractInfo] = useState({
    address: "-",
    tokenName: "-",
    tokenSymbol: "-",
    totalSupply: "-",
  });

  const [balanceInfo, setBalanceInfo] = useState({
    address: "-",
    balance: "-"
  })

  const [isApproved, setIsApproved] = useState(false);
  const [allowanceAmount, setAllowanceAmount] = useState();
  const [isAllowanceMsg, setIsAllowanceMsg] = useState(false);
  const [isTransferFrom, setIsTransferFrom] = useState(false);
  const [isTransfer, setIsTransfer] = useState(false);


  useEffect(() => {
    if (contractInfo.address !== "-") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const erc20 = new ethers.Contract(
        contractInfo.address,
        RealToken.abi,
        provider
      );

      //event Transfer(address indexed from, address indexed to, uint256 value);

      erc20.on("Transfer", (from, to, amount, event) => {
        console.log({ from, to, amount, event });

        setTxs((currentTxs) => [
          ...currentTxs,
          {
            txHash: event.transactionHash,
            from,
            to,
            amount: String(amount)
          }
        ]);
      });
      setContractListened(erc20);

      return () => {
        contractListened.removeAllListeners();
      };

    }
  }, [contractInfo.address]);


  // Get token info: name, symbol and totalSupply
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const erc20 = new ethers.Contract(data.get(contractAddress), RealToken.abi, provider);

    const tokenName = await erc20.name();
    const tokenSymbol = await erc20.symbol();
    const totalSupply = await erc20.totalSupply();

    setContractInfo({
      address: data.get(contractAddress),
      tokenName,
      tokenSymbol,
      totalSupply,
    });
    setContractAddress(data);
  };


  // function balanceOf(address account) external view returns (uint256)

  const getMyBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const erc20 = new ethers.Contract(contractInfo.address, RealToken.abi, provider);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    const balance = await erc20.balanceOf(signerAddress);

    setBalanceInfo({
      address: signerAddress,
      balance: String(balance)
    });
  };



  //function transfer(address recipient, uint256 amount) external returns (bool);

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      if (!window.ethereum) return alert("Please install or sign-in to Metamask");
      const data = new FormData(e.target);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const erc20 = new ethers.Contract(contractInfo.address, RealToken.abi, signer);
      await provider.send("eth_requestAccounts", []);
      const transaction = await erc20.transfer(data.get("recipient"), data.get("amount"));
      await transaction.wait();
      console.log('Success! -- recipient recieved amount');
      setIsTransfer(true);
    } catch (error) {
      console.log(error);
      //if (error) return alert('transfer amount exceeds balance');
      setError(true);
    };

  };


  // function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
  // address a, b & c -> a is the sender, b is the spender, c is the recipient
  // address b can send to address c on a's behalf

  const handleTransferFrom = async (e) => {
    e.preventDefault();
    try {
      if (!window.ethereum) return alert("Please install or sign-in to Metamask");
      const data = new FormData(e.target);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const erc20 = new ethers.Contract(contractInfo.address, RealToken.abi, signer);
      await provider.send("eth_requestAccounts", [])
      const transactionFrom = await erc20.transferFrom(data.get("sender"), data.get("recipient"), data.get("amount"));
      await transactionFrom.wait();
      console.log("transferFrom -- success");
      setIsTransferFrom(true);
    } catch (error) {
      console.log(error);
      setError(true);
      //if (error) return alert("transfer from amount exceeds balance");
    };

  };


  //function approve(address spender, uint256 amount) external returns (bool);
  // address a, b & c -> address a approves address b, the spender

  const handleApprove = async (e) => {
    e.preventDefault();
    try {
      if (!window.ethereum) return alert("Please install or sign-in to Metamask");
      const data = new FormData(e.target);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const erc20 = new ethers.Contract(contractInfo.address, RealToken.abi, signer);
      const transaction = await erc20.approve(data.get("spender"), data.get("amount"));
      await transaction.wait();
      //console.log("Success! -- approved");
      setIsApproved(true);
    } catch (error) {
      console.log(error);
      if (error) return alert("error, make sure is a different address other than your own");
    }
  }


  // function allowance(address owner, address spender) external view returns (uint256);
  // address a is owner and address b is the spender -> checks the balance owner allows spender to spend

  const handleAllowance = async (e) => {
    e.preventDefault();
    try {
      if (!window.ethereum) return alert("Please install or sign-in to Metamask");
      const data = new FormData(e.target);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const erc20 = new ethers.Contract(contractInfo.address, RealToken.abi, provider);
      const signer = provider.getSigner();
      const owner = await signer.getAddress();
      console.log(owner);
      const allowance = await erc20.allowance(data.get("owner"), data.get("spender"));
      console.log(allowance.toString());
      setIsAllowanceMsg(true);
      setAllowanceAmount(allowance.toString());

      return allowance;

    } catch (error) {
      console.log(error);
      if (error) return alert("Input correct address");
    }

  }

  return (
    <div className="container">
      <div>
        <form className="m-4" onSubmit={handleSubmit}>
          <div className="credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-darkgrey">
            <main className="mt-4 p-4">
              <h1 className="text-xl font-semibold text-info text-left">
                Smart Contract UI
              </h1>
              <p><small className="text-muted">Read from a smart contract, approve, transfer, transfer from and recieve transaction messages from the blockchain.</small> </p>
              <br />
              <div>
                  <h6 className="card-subtitle mb-2 text-muted">contract</h6>
                <div className="my-3">
                  <input
                    type="text"
                    name={contractAddress}
                    className="input p-1"
                    placeholder="ERC20 contract address"
                    style={{ background: "#1f1f1f", borderStyle: "solid 1px", borderColor: "#7bc3ed", borderRadius: "5px", color: "white" }}
                  />
                </div>
              </div>
            </main>
            <footer className="p-4">
              <button
                type="submit"
                className="btn btn-outline-success"
              >
                Get token info
              </button>
            </footer>
            <div className="px-4">
              <div className="overflow-x-auto">
                <table className="table w-full text-primary">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Symbol</th>
                      <th>Total supply</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>{contractInfo.tokenName}</th>
                      <td>{contractInfo.tokenSymbol}</td>
                      <td>{String(contractInfo.totalSupply)}</td>
                      <td>{contractInfo.deployedAt}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-4">
              <button
                onClick={getMyBalance}
                type="submit"
                className="btn btn-outline-success"
              >
                Get my balance
              </button>
            </div>
            <div className="px-4">
              <div className="overflow-x-auto">
                <table className="table w-full text-primary">
                  <thead>
                    <tr>
                      <th>Address</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>{balanceInfo.address}</th>
                      <td>{balanceInfo.balance}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </form>
        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-darkgrey">
          <div className="mt-4 p-4">
            <h3 className="text-xl font-semibold text-info text-left">
              Transactions / Transfers
            </h3>
            {/* transfer */}
            <div className="card">
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-muted">transfer</h6>
                <form onSubmit={handleTransfer}>
                  <div className="my-3">
                    <div>
                      <h6 className="card-subtitle mb-2 text-muted">recipient</h6>
                    </div>
                    <input
                      type="text"
                      name="recipient"
                      className="input p-1"
                      placeholder="Recipient address"
                      style={{ background: "#1f1f1f", border: "1px solid grey", borderRadius: "4px", color: "white" }}
                    />
                  </div>
                  <div className="my-3">
                    <div>
                      <h6 className="card-subtitle mb-2 text-muted">amount</h6>
                    </div>
                    <input
                      type="text"
                      name="amount"
                      className="input p-1"
                      placeholder="Amount to transfer"
                      style={{ background: "#1f1f1f", border: "1px solid grey", borderRadius: "4px", color: "white" }}
                    />
                  </div>
                  <footer className="p-4">
                    <button
                      type="submit"
                      className="btn btn-outline-info"
                    >
                      Transfer
                    </button>
                    <div className="my-4 mb-2">
                      {isTransfer &&
                        <div className="alert alert-dismissible alert-success">
                          <button type="button" className="btn-close" data-bs-dismiss="alert" onClick={() => setIsTransfer(false)}></button>
                          <strong>Well Done!</strong> Your transfer has been completed.
                        </div>
                      }

                      {error &&
                        <div className="alert alert-dismissible alert-danger">
                          <button type="button" className="btn-close" data-bs-dismiss="alert" onClick={() => setError(false)}></button>
                          <strong>Oh snap!</strong> and try submitting again. Your balance must be sufficient.
                        </div>
                      }
                    </div>
                  </footer>
                </form>
              </div>
            </div>
            <br />
            {/* approve */}
            <div className="card">
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-muted">approve</h6>
                <form onSubmit={handleApprove}>
                  <div className="my-3">
                    <div>
                      <h6 className="card-subtitle mb-2 text-muted">spender</h6>
                    </div>
                    <input
                      type="text"
                      name="spender"
                      className="input p-1"
                      placeholder="Spender address"
                      style={{ background: "#1f1f1f", border: "1px solid grey", borderRadius: "4px", color: "white" }}
                    />
                  </div>
                  <div className="my-3">
                    <div>
                      <h6 className="card-subtitle mb-2 text-muted">amount</h6>
                    </div>
                    <input
                      type="text"
                      name="amount"
                      className="input p-1"
                      placeholder="Amount to approve"
                      style={{ background: "#1f1f1f", border: "1px solid grey", borderRadius: "4px", color: "white" }}
                    />
                  </div>
                  <footer className="p-4">
                    <button
                      type="submit"
                      className="btn btn-outline-info"
                    >
                      Approve
                    </button>
                    <div className="my-4 mb-2">
                      {isApproved &&
                        <div className="alert alert-dismissible alert-success">
                          <button type="button" className="btn-close" data-bs-dismiss="alert" onClick={() => setIsApproved(false)}></button>
                          <strong>Well Done!</strong> You have successfully approved spender.
                        </div>
                      }
                    </div>
                  </footer>
                </form>
              </div>
            </div>
            <br />
            {/* allowance */}
            <div className="card">
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-muted">allowance</h6>
                <form onSubmit={handleAllowance}>
                  <div className="my-3">
                    <div>
                      <h6 className="card-subtitle mb-2 text-muted">owner</h6>
                    </div>
                    <input
                      type="text"
                      name="owner"
                      className="input p-1"
                      placeholder="Owner address"
                      style={{ background: "#1f1f1f", border: "1px solid grey", borderRadius: "4px", color: "white" }}
                    />

                  </div>
                  <div className="my-3">
                    <div>
                      <h6 className="card-subtitle mb-2 text-muted">spender</h6>
                    </div>
                    <input
                      type="text"
                      name="spender"
                      className="input p-1"
                      placeholder="Spender address"
                      style={{ background: "#1f1f1f", border: "1px solid grey", borderRadius: "4px", color: "white" }}
                    />
                  </div>
                  <footer className="p-4">
                    <button
                      type="submit"
                      className="btn btn-outline-info"
                    >
                      Allowance
                    </button>
                    <div className="my-3">
                      {isAllowanceMsg &&
                        <div className="alert alert-dismissible alert-warning">
                          <button type="button" className="btn-close" data-bs-dismiss="alert" onClick={() => setIsAllowanceMsg(false)}></button>
                          Spender can spend this amount:{" "}{allowanceAmount}{" "}
                        </div>
                      }
                    </div>
                  </footer>
                </form>
              </div>
            </div>
            <br />
            {/* transfer from */}
            <div className="card">
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-muted">transfer from</h6>
                <form onSubmit={handleTransferFrom}>
                  <div className="my-3">
                    <div>
                      <h6 className="card-subtitle mb-2 text-muted">sender</h6>
                    </div>
                    <input
                      type="text"
                      name="sender"
                      className="input p-1"
                      placeholder="Sender address"
                      style={{ background: "#1f1f1f", border: "1px solid grey", borderRadius: "4px", color: "white" }}
                    />
                  </div>
                  <div className="my-3">
                    <div>
                      <h6 className="card-subtitle mb-2 text-muted">recipient</h6>
                    </div>
                    <input
                      type="text"
                      name="recipient"
                      className="input p-1"
                      placeholder="Recipient address"
                      style={{ background: "#1f1f1f", border: "1px solid grey", borderRadius: "4px", color: "white" }}
                    />
                  </div>
                  <div className="my-3">
                    <div>
                      <h6 className="card-subtitle mb-2 text-muted">amount</h6>
                    </div>
                    <input
                      type="text"
                      name="amount"
                      className="input p-1"
                      placeholder="Amount to transfer"
                      style={{ background: "#1f1f1f", border: "1px solid grey", borderRadius: "4px", color: "white" }}
                    />
                  </div>
                  <footer className="p-4">
                    <button
                      type="submit"
                      className="btn btn-outline-info"
                    >
                      Transfer from
                    </button>
                    <div className="my-4 mb-2">
                      {isTransferFrom &&
                        <div className="alert alert-dismissible alert-success">
                          <button type="button" className="btn-close" data-bs-dismiss="alert" onClick={() => setIsTransferFrom(false)}></button>
                          <strong>Well Done!</strong> Your transfer has been completed.
                        </div>
                      }
                      {error &&
                        <div className="alert alert-dismissible alert-danger">
                          <button type="button" className="btn-close" data-bs-dismiss="alert" onClick={() => setError(false)}></button>
                          <strong>Error!</strong> Transfer amount exceeds balance.
                        </div>
                      }
                    </div>
                  </footer>
                </form>
              </div>
            </div>


          </div>
        </div>
      </div>
      <div>
        {/* Tx List */}
        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-darkgrey">
          <div className="mt-4 p-4">
            <h3 className="text-xl font-semibold text-info text-left">
              Recent Transactions
            </h3>
            <p>
              <TxList txs={txs} />
            </p>
          </div>
        </div>
      </div>
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


// start React
// npm 

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


