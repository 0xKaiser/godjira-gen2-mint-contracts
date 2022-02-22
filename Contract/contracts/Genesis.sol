//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Genesis is ERC721Enumerable, Ownable, ReentrancyGuard {
    /// @dev token id tracker
    uint256 public tokenIdTracker;

    /// baseTokenURI
    string public baseTokenURI;

    event Mint(address indexed to, uint256 tokenId);
    
    event SetBaseTokenURI(string baseTokenURI);

    constructor(
        string memory _name,
        string memory _symbol,
        string memory baseURI
    ) ERC721(_name, _symbol) {
        setBaseURI(baseURI);
    }

    /**
     * @dev Mint NFTs
     */
    function mint(
        address _to, 
        uint256 _tokenId
    ) external onlyOwner nonReentrant {

        _safeMint(_to, _tokenId);

        emit Mint(_to, _tokenId);
    }

    /**
     * @dev Get `baseTokenURI`
     * Overrided
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    /**
     * @dev Set `baseTokenURI`
     */
    function setBaseURI(string memory baseURI) public onlyOwner {
        require(bytes(baseURI).length > 0, "genesis : base URI invalid");
        baseTokenURI = baseURI;

        emit SetBaseTokenURI(baseURI);
    }
}
