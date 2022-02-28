require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
//console.log(process.env) // remove this after you've confirmed it working

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
// ethereum node from infura and the exported, accounts key from metamask account number x

// https://youtu.be/KDYJC85eS5M?t=1264
// .env set up - watch video

module.exports = {
  solidity: "0.8.3",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    // url can also be saves in the .env file
    // url: process.env.ROPSTEN_RPC_URL || "",
    ropsten: {
      url: process.env.ROPSTEN_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY]
      // accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY]
    }
  }
};
// Evants and Logging in Solidity - Patrick from Chainlink

// to verify with ether scan - at this time 
// https://youtu.be/KDYJC85eS5M

//https://youtu.be/a0osIaAOFSE
// at time...
// https://youtu.be/KDYJC85eS5M?t=1201

// this would go in the Robsten object above...
// accounts: [`0x${process.env.ACCOUNT_KEY}`]


// ========== steps ==============
// npx create-react-app usdc-app
// cd usdc-app
// npm i -D hardhat
// npm i @nomiclabs/hardhat-waffle
// npx hardhat
// install suggested plug-ins

// for smart contracts: npm i @openzeppelin/contracts

