const hre = require("hardhat");

//  https://youtu.be/KDYJC85eS5M
// Events and Logging in Solidity

// https://github.com/smartcontractkit/hardhat-starter-kit/blob/main/test/unit/APIConsumer_unit_test.js

async function main() {
  await hre.run("compile");

  // deployment
  const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.deploy();
  await simpleStorage.deployed();
  console.log(simpleStorage.address);

  // npx hardhat run scripts/deploy_and_store.js
  // call the deployed contract (not the hardhat console, just a regular node)
  const transactionResponse = await simpleStorage.store(1); // store new favorite number using our store function form our contract
  const transactionReceipt = await transactionResponse.wait();
  //console.log(transactionReceipt);
  // npx hardhat run scripts/deploy_and_store.js
  // we get back tx block, tx hash, events, args

  console.log(transactionReceipt.events[0].args.oldNumber.toString());
  console.log(transactionReceipt.events[0].args.newNumber.toString());
  console.log(transactionReceipt.events[0].args.addedNumber.toString());
  console.log(transactionReceipt.events[0].args.sender);
  console.log(transactionReceipt.events);
  

  // https://github.com/smartcontractkit/hardhat-starter-kit/blob/main/test/unit/APIConsumer_unit_test.js

  // npx hardhat run scripts/deploy_and_store.js

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});