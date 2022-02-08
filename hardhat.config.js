require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
console.log(process.env) // remove this after you've confirmed it working

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
    ropsten: {
      url: "https://ropsten.infura.io/v3/c7b095b87e9740878089365fc78e778d",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};

//https://youtu.be/a0osIaAOFSE

// this would go in the Robsten object above...
// accounts: [`0x${process.env.ACCOUNT_KEY}`]

// in cmd line...
// set ACCOUNT_KEY="c854a90630e28a52f889391c443f66eb6541cf9372b972b733a857302d514144"
// youtuber writes in cmd line: source ~/.zshrc
// i don't know what that means but he says we "reference" - i did not try it so it did not work

// ========== steps ==============
// npx create-react-app usdc-app
// cd usdc-app
// npm i -D hardhat
// npm i @nomiclabs/hardhat-waffle
// npx hardhat
// install suggested plug-ins

// for smart contracts: npm i @openzeppelin/contracts

