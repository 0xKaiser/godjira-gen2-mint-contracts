//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

contract whitelistChecker is EIP712{

    string private constant SIGNING_DOMAIN = "Godjira";
    string private constant SIGNATURE_VERSION = "1";

    struct whitelisted{
        address whiteListAddress;
        bool isPrivateListed;
        bytes signature;
    }

    constructor() EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION){}
  
  
    function getSigner(whitelisted memory list) internal view returns(address){
        return _verify(list);
    }

    
    /// @notice Returns a hash of the given rarity, prepared using EIP712 typed data hashing rules.
  
    function _hash(whitelisted memory list) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encode(
      keccak256("whitelisted(address whiteListAddress,bool isPrivateListed)"),

      list.whiteListAddress,
      list.isPrivateListed
    )));
    }

    function _verify(whitelisted memory list) internal view returns (address) {
        bytes32 digest = _hash(list);
        return ECDSA.recover(digest, list.signature);
    }
}