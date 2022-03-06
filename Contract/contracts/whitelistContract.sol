//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./EIP712.sol";

contract whitelistAndprivatelistChecker is EIP712{

    string private constant SIGNING_DOMAIN = "Godjira";
    string private constant SIGNATURE_VERSION = "1";

    struct whitelisted{
        address whiteListAddress;
        bytes signature;
    }

    struct privatelisted{
        address privateAddress;
        bytes signature;
    }

    constructor() EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION){}

    function getSigner(whitelisted memory list) internal view returns(address){
        return _verify(list);
    }

    /// @notice Returns a hash of the given rarity, prepared using EIP712 typed data hashing rules.
  
    function _hash(whitelisted memory list) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encode(
      keccak256("whitelisted(address whiteListAddress)"),
      list.whiteListAddress
    )));
    }

    function _verify(whitelisted memory list) internal view returns (address) {
        bytes32 digest = _hash(list);
        return ECDSA.recover(digest, list.signature);
    }

        function getPrivateSigner(privatelisted memory list) internal view returns(address){
        return _privateverify(list);
    }

    /// @notice Returns a hash of the given rarity, prepared using EIP712 typed data hashing rules.
  
    function _privatehash(privatelisted memory list) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encode(
      keccak256("privatelisted(address privateAddress)"),
      list.privateAddress
    )));
    }

    function _privateverify(privatelisted memory list) internal view returns (address) {
        bytes32 digest = _privatehash(list);
        return ECDSA.recover(digest, list.signature);
    }

}