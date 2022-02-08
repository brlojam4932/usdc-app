//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

contract SimpleStorage {
  uint256 public favoriteNumber;

  // indexed number is a "topic"
  event storedNumber(
    uint256 indexed oldNumber, 
    uint256 indexed newNumber, 
    uint256 addedNumber, 
    address sender
    );

  function store(uint256 newFavoriteNumber) public {
    favoriteNumber = newFavoriteNumber;
    emit storedNumber(
      favoriteNumber, 
      newFavoriteNumber, 
      favoriteNumber + newFavoriteNumber, 
      msg.sender
      );
    
  }
  
}
