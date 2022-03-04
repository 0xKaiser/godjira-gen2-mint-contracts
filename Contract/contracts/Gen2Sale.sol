//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract Gen2Sale is Ownable, Pausable, ReentrancyGuard {
    using SafeMath for uint256;
    
    /// @dev Token Price
    uint256 immutable priceNumerator = 99;
    uint256 immutable priceDenominator = 1000;

    /// @dev Genesis address
    address public immutable genesis;
    /// @dev Gene2 address
    address public immutable gen2;

    address public constant CORE_TEAM_ADDRESS = 0xC79b099E83f6ECc8242f93d35782562b42c459F3;

    /// @dev token id tracker for private sale buyers  ( #341 ~ #440 )
    uint256 public privateTokenIdTracker = 341;

    /// @dev token id tracker for genesis holders   ( #441 ~ #1106 )
    uint256 public holderTokenIdTracker = 441;

    /// @dev token id tracker for whitelist wallets    ( #1107 ~ #2853 )
    uint256 public whitelistTokenIdTracker = 1107;

    /// @dev wallet address => whitelist status
    mapping(address => bool) public whitelist;

    /// @dev wallet address => amount of token
    mapping(address => uint256) public privateSaleBuyers;

    event AddedWhitelist(address whitelistWallet);
    event RemovedWhitelist(address whitelistWallet);

    constructor(
      address _genesis,
      address _gen2 
    ) {
        require(_genesis != address(0) && _gen2 != address(0), "gen2Sale: Invalid address");
        genesis = _genesis;
        gen2 = _gen2;
    }

    /**
     * @dev Purchase NFTs
    */
    function purchase() external whenNotPaused nonReentrant payable {
        uint256 tokenPrice = priceNumerator.div(priceDenominator);
        console.log(tokenPrice);
        bool genesisHolder = _isGenesisHolder(msg.sender);
        
        /**
        * Private sale buyers
        * Total amount : 100 (1pw)
        * TokenIds : #341 ~ #440
        * Start time : 9 Mar 2am ~ --
        */
        if(!whitelist[msg.sender]) {
            uint256 _privateTokenIdTracker = privateTokenIdTracker;
            IERC721(gen2).transferFrom(CORE_TEAM_ADDRESS, msg.sender, _privateTokenIdTracker);
            privateTokenIdTracker = _privateTokenIdTracker + 1;
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
     * @dev Check if wallet address owns any genesis tokens.
     * @param _account address
    */
    function _isGenesisHolder(address _account) private view returns (bool) {
        return IERC721(genesis).balanceOf(_account) > 0;
    }

    /**
     * @dev Add 'whitelist'
     * @param _accounts array of address
    */
    function addWhiteList(address[] memory _accounts) public onlyOwner {
        for (uint256 i = 0; i < _accounts.length; i++) {
            require(!_isGenesisHolder(_accounts[i]), "gen2Sale.addWhiteList: should be not genesis holder");
            whitelist[_accounts[i]] = true;

            emit AddedWhitelist(_accounts[i]);
        }
    }

    /**
     * @dev Remove 'whitelist'
     * @param _accounts array of address
    */
    function removeWhiteList(address[] memory _accounts) public onlyOwner {
        for (uint256 i = 0; i < _accounts.length; i++) {
            delete whitelist[_accounts[i]];

            emit RemovedWhitelist(_accounts[i]);
        }
    }

    function pause() external onlyOwner {
        super._pause();
    }

    function unpause() external onlyOwner {
        super._unpause();
    }

}
