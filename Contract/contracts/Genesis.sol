//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Genesis is ERC721Enumerable, Ownable, ReentrancyGuard {
    /// @dev token id tracker
    uint256 public tokenIdTracker;

    /// @dev Maximum elements
    uint256 CAP = 333;

    /// baseTokenURI
    string public baseTokenURI;

    address public immutable nftOwner = 0x3B0C7fb36cCf7bB203e5126B2192371Af91831BF;

    event Mint(address indexed to, uint256 amount);
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
    function mint(uint256 _amount) external nonReentrant {
        require(_amount > 0, "genesis : mint amount invalid");
        require(tokenIdTracker + _amount <= CAP, "genesis : max limit");

        for (uint256 i = 0; i < _amount; i++) {
            tokenIdTracker += 1;
            _safeMint(nftOwner, tokenIdTracker);
        }

        emit Mint(nftOwner, _amount);
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
