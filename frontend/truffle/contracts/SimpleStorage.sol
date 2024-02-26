// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    struct data{
        uint256 blockNumber;
        int256 positive; 
    }
    data []value;
    address public contractAddress;
    address station1;
    address station2;

    constructor() {
        contractAddress = address(this);
    }

    function toString(address _addr) internal pure returns (string memory) {
        bytes32 val = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
         
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
         
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(val[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(val[i + 12] & 0x0f)];
        }
         
        return string(str);
    }

    function getContractAddress() public view returns (string memory) {
         address ad = contractAddress;
         string memory str = toString(ad); 
         return str;
    }

    function read() public view returns (data[] memory) {
        require(msg.sender == station1 || msg.sender == station2);
        return value;
    }

    function write(int256 newValue) public {
        require(msg.sender == station1 || msg.sender == station2);
        data memory temp;
        temp.positive = newValue;
        temp.blockNumber = block.number;
        value.push(temp);
    }

    function setStations(address s1, address s2) public {
        station1 = s1;
        station2 = s2;
    }
}
