//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
// import "./interfaces/IERC1155Interface.sol";

contract Genesis is ERC721Enumerable, Ownable, ReentrancyGuard {
    /// @dev token id tracker
    uint256 public tokenIdTracker;

    /// baseTokenURI
    string public baseTokenURI;

    address public immutable nftOwner =
        0xfEb8F9609c677dC57731B1e940fE2ad8faa6b169;

    address public oldGenesis;

    
    event Claim(uint256[] tokenIds);
    uint[] public tokenToOpenseaMap;

    event SetBaseTokenURI(string baseTokenURI);

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseURI,
        address _oldGenesis,
        uint[] memory tokens
    ) ERC721(_name, _symbol) {
        setBaseURI(_baseURI);
        setOldGenesis(_oldGenesis);
        tokenToOpenseaMap = tokens;
    }

    /**
     * @dev Claim NFT
     */
    function claim(uint256[] memory _tokenIds) external nonReentrant {
        require(_tokenIds.length != 0, "genesis : invalid tokenId length");

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            uint256 tokenId = _tokenIds[i];

            require(tokenId != 0, "genesis : invalid tokenId");

            uint256 count = IERC1155(oldGenesis).balanceOf(msg.sender, tokenToOpenseaMap[tokenId-1]);

            require(count > 0, "genesis : sender is not owner");

            IERC1155(oldGenesis).safeTransferFrom(msg.sender, nftOwner, tokenToOpenseaMap[tokenId-1], 1, "");

            _safeMint(msg.sender,tokenId);
            // super._safeTransfer(nftOwner, msg.sender, tokenId, "");
        }

        emit Claim(_tokenIds);
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

    function editOpenseaToken(uint index,uint token) external onlyOwner{
        tokenToOpenseaMap[index] = token;
    }

    function setOldGenesis(address _oldGenesis) public onlyOwner {
        oldGenesis = _oldGenesis;
    }
}
