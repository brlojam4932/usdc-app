//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract RealToken is ERC20 {
  constructor() ERC20("RealToken", "RETK") {
    _mint(msg.sender, 200000 * (10 ** 18));
  }
  
}
