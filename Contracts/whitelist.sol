pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/cryptography/draft-EIP712.sol";

contract whitelistCheck is EIP712{

    string private constant SIGNING_DOMAIN = "Tribe-Pass";
    string private constant SIGNATURE_VERSION = "1";

    struct Whitelist{
        address userAddress;
        bytes signature;
    }

    constructor() EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION){
        
    }

    function getSigner(Whitelist memory whitelist) internal view returns(address){
        return _verify(whitelist);
    }

    /// @notice Returns a hash of the given whitelist, prepared using EIP712 typed data hashing rules.
  
    function _hash(Whitelist memory whitelist) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encode(
      keccak256("Whitelist(address userAddress)"),
      whitelist.userAddress
    )));
    }

    function _verify(Whitelist memory whitelist) internal view returns (address) {
        bytes32 digest = _hash(whitelist);
        return ECDSA.recover(digest, whitelist.signature);
    }

}