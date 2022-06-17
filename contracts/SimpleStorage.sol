pragma solidity 0.8.15;
 
contract SimpleStorage {
   uint data;
 
    constructor(uint _n) payable {
        set(_n);
    }

   function set(uint n) public {
       data = n;
   }
 
   function get() public view returns (uint) {
       return data;
   }
}
