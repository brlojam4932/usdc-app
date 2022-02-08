const { defaultAccounts } = require("ethereum-waffle");
const hre = require("hardhat");

async function main() {
  const RealToken = await hre.ethers.getContractFactory("RealToken");
  const realtoken = await RealToken.deploy();
  await realtoken.deployed();
  console.log("Real Token deployed to:", realtoken.address);

  // ERC20 transfer args
  //event Transfer(address indexed from, address indexed to, uint256 value);
/*
  const transactionResponse = await realtoken.transfer('0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 12500);
  const transactionReceipt = await transactionResponse.wait();
  //console.log(transactionReceipt);

  console.log(transactionReceipt.events[0].args.from);
  console.log(transactionReceipt.events[0].args.to);
  console.log(transactionReceipt.events[0].args.value.toNumber());

*/
  //event Approval(address indexed owner, address indexed spender, uint256 value);

  /*
  const approveResponse = await realtoken.approve('0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 35200);
  const approveReceipt = await approveResponse.wait();
  //console.log("approved: ", approveReceipt);

  console.log(approveReceipt.events[0].args.owner);
  console.log(approveReceipt.events[0].args.spender);
  console.log(approveReceipt.events[0].args.value.toNumber());
*/

  // npx hardhat run scripts/deploy.js

  
  //console.log(await realtoken.allowance('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'));

  //console.log(await realtoken.name());

  //console.log(await realtoken.balanceOf('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'));
  //console.log(await realtoken.balanceOf('0x70997970C51812dc3A010C7d01b50e0d17dc79C8'));
  //console.log(await realtoken.symbol());
  //console.log(await realtoken.totalSupply());
}



main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
