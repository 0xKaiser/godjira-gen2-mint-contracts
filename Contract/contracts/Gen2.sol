//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "erc721a/contracts/ERC721A.sol";
import "hardhat/console.sol";

contract Gen2 is ERC721A, Ownable, Pausable, ReentrancyGuard {
    using SafeMath for uint256;
    /// @dev Maximum elements
    uint256 CAP = 3333;

    /// @dev Token Price
    uint256 price = 99;
    uint256 tokenPrice = price.div(1000);

    /// @dev baseTokenURI
    string public baseTokenURI;

    /// @dev Genesis address
    address public genesisAddress;

    address public constant CORE_TEAM_ADDRESS = 0xC79b099E83f6ECc8242f93d35782562b42c459F3;
    address public constant FOUNDER_SHAN_ADDRESS = 0xAd7Bbe006c8D919Ffcf6148b227Bb692F7D1fbc7;
    address public constant FOUNDER_JAMIE_ADDRESS = 0x2dFa24018E419eA8453190155434D35328A8c6d8;

    /// @dev wallet address => whitelist status
    mapping(address => bool) public whitelist;

    /// @dev wallet address => status
    mapping(address => bool) public privateSaleBuyers;

    mapping(address => uint256) public nfts;

    event SetBaseTokenURI(string baseTokenURI);
    event AddedWhitelist(address whitelistWallet, bool status);
    event RemovedWhitelist(address whitelistWallet, bool status);

    constructor(
        string memory _name,
        string memory _symbol,
        string memory baseToken_,
        address _genesis
    ) ERC721A(_name, _symbol) {
        setBaseURI(baseToken_);
        setGenesis(_genesis);

        // CoreTeam -> tokenIds #1 ~ #310
        _safeMint(CORE_TEAM_ADDRESS, 310);
         // Founder Shan -> tokenIds #311 ~ #325
        _safeMint(FOUNDER_SHAN_ADDRESS, 15);
        // Founder Jamie -> tokenIds #326 ~ #340
        _safeMint(FOUNDER_JAMIE_ADDRESS, 15);

        _safeMint(CORE_TEAM_ADDRESS, 2993);
    }

    /**
     * @dev Purchase NFTs
    */
    function purchase() external nonReentrant payable {
        bool genesisHolder = isGenesisHolder(msg.sender);
        
        /**
        * Private sale buyers
        * Total amount : 100 (1pw)
        * TokenIds : #341 ~ #440
        * Start time : 9 Mar 2am ~ --
        */
        if(!whitelist[msg.sender]) {
            console.log("Private sale buyers");
        }

        /**
        * Genesis Holders 
        * Total amount : 666 (2pw)
        * TokenIds : #441 ~ #1106
        * Start time 9 Mar 4am ~ --
        */
        if(genesisHolder) {
            console.log("GenesisHolder");
        }

        /**
        * Whitelist wallets
        * Total amount : 1747 (1pw)
        * TokenIds : #1107 ~ #2853
        * Start time 10 Mar 4am ~ 11 Mar 4am
        */
        if(whitelist[msg.sender]) {
            console.log("Whitelisted");
        }

        

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
        require(bytes(baseURI).length > 0, "gen2 : base URI invalid");
        baseTokenURI = baseURI;

        emit SetBaseTokenURI(baseURI);
    }

    /**
     * @dev Check if wallet address owns any genesis tokens.
     * @param account address
    */
    function isGenesisHolder(address account) public view returns (bool) {
        return IERC721(genesisAddress).balanceOf(account) > 0;
    }

    /**
     * @dev Add 'whitelist'
     * @param _accounts array of address
    */
    function addWhiteList(address[] memory _accounts) public onlyOwner {
        for (uint256 i = 0; i < _accounts.length; i++) {
            require(isGenesisHolder(_accounts[i]), "gen2 : should be not genesis holder");
            if (_accounts[i] != address(0)) whitelist[_accounts[i]] = true;

            emit AddedWhitelist(_accounts[i], true);
        }
    }

    /**
     * @dev Remove 'whitelist'
     * @param _accounts array of address
    */
    function removeWhiteList(address[] memory _accounts) public onlyOwner {
        for (uint256 i = 0; i < _accounts.length; i++) {
            if (_accounts[i] != address(0)) delete whitelist[_accounts[i]];

            emit RemovedWhitelist(_accounts[i], false);
        }
    }

    /**
     * @dev set address of Genesis
     * @param _genesis address of genesis
    */
    function setGenesis(address _genesis) public onlyOwner {
        genesisAddress = _genesis;
    }

    function pause() external whenNotPaused onlyOwner {
        super._pause();
    }

    function unpause() external whenPaused onlyOwner {
        super._unpause();
    }
}
