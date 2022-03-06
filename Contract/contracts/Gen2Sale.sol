//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./whitelistContract.sol";
import "hardhat/console.sol";

contract Gen2Sale is Ownable, Pausable, whitelistAndprivatelistChecker, ReentrancyGuard {
    using SafeMath for uint256;
    
    /// @dev Token Price
    uint256 public constant TOKEN_PRICE_WEI = 99 * 10 ** 15;

    /// @dev Genesis address
    address public immutable genesis;
    /// @dev Gene2 address
    address public immutable gen2;

    address public designatedWhitelistSigner;

    address public designatePrivatelistSigner;

    address public constant CORE_TEAM_ADDRESS = 0xC79b099E83f6ECc8242f93d35782562b42c459F3;

    /// @dev token id tracker for private sale buyers  ( #340 ~ #439 )
    uint256 public privateTokenIdTracker = 340;

    /// @dev token id tracker for genesis holders   ( #440 ~ #1105 )
    uint256 public holderTokenIdTracker = 440;

    /// @dev token id tracker for whitelist wallets    ( #1106 ~ #2852 )
    uint256 public whitelistTokenIdTracker = 1106;

    /// @dev token id tracker for free claim wallets    ( #2853 ~ #3332 )
    uint256 public freeClaimTokenIdTracker = 2853;

    /// @dev wallet address => privateSale status
    mapping(address => bool) public privateSaleList;


    /// @dev wallet address => amount of token    (1 pw)
    mapping(address => uint256) public privateSaleBuyers;

    /// @dev wallet address => amount of token    (2 pw)
    mapping(address => uint256) public genesisHolders;

    /// @dev wallet address => amount of token    (1 pw)
    mapping(address => uint256) public whitelistUsers;

    /// @dev wallet address => amount of token    (1 pw)
    mapping(address => uint256) public freeClaimUsers;

    event AddedWhitelist(address whitelistWallet);
    event RemovedWhitelist(address whitelistWallet);
    
    event AddedPrivateSaleList(address privateSaleBuyer);
    event RemovedPrivateSaleList(address privateSaleBuyer);

    constructor(
      address _genesis,
      address _gen2 
    ) {
        require(_genesis != address(0) && _gen2 != address(0), "gen2Sale: Invalid address");
        genesis = _genesis;
        gen2 = _gen2;
    }


    /* Whitelist purchase
    *@dev Purchase whitelisted NFT
    */
    function purchaseWhitelistedNft(whitelisted memory whitelist) external whenNotPaused nonReentrant payable {
         /**
        * Whitelist wallets
        * Total amount : 1747 (1pw)
        * TokenIds : #1106 ~ #2852
        * Start time 10 Mar 4am ~ 11 Mar 4am   timestamp : 1646845200 ~ 1646931600
        */
            require (getSigner(whitelist) == designatedWhitelistSigner,"Not valid user");
            require(msg.value >= TOKEN_PRICE_WEI, "genSale.purchase: Insufficient funds");
            require(whitelistTokenIdTracker <= 2852, "genSale.purchase: sold out");
            require(block.timestamp >= 1646845200 && block.timestamp <= 1646931600, "genSale.purchase: sale expired");
            require(whitelistUsers[msg.sender] < 1, "genSale.purchase: amount exceed");
            uint256 _whitelistTokenIdTracker = whitelistTokenIdTracker;
            IERC721(gen2).transferFrom(CORE_TEAM_ADDRESS, msg.sender, _whitelistTokenIdTracker);
            whitelistTokenIdTracker = _whitelistTokenIdTracker + 1;
            whitelistUsers[msg.sender] = whitelistUsers[msg.sender] + 1;

            // return change if any
            if (msg.value > TOKEN_PRICE_WEI) {
                payable(msg.sender).transfer(msg.value - TOKEN_PRICE_WEI);
            }
            payable(CORE_TEAM_ADDRESS).transfer(msg.value);
            console.log("Whitelisted", whitelistTokenIdTracker);
        
    }

    /**
    *@dev Purchase PrivateSale NFTs
     */
    function privateSalePurchase(privatelisted memory privateList) external whenNotPaused nonReentrant payable {
      /**
        * Private sale buyers
        * Total amount : 100 (1pw)
        * TokenIds : #340 ~ #439
        * Start time : 9 Mar 2am ~ --  timestamp : 1646751600
        */
            require (getPrivateSigner(privateList)==designatePrivatelistSigner, "User not in private List");
            require(msg.value >= TOKEN_PRICE_WEI, "genSale.purchase: Insufficient funds");
            require(privateTokenIdTracker <= 439, "genSale.purchase: sold out");
            require(block.timestamp >= 1646751600, "genSale.purchase: sale didn't start");
            require(privateSaleBuyers[msg.sender] < 1, "genSale.purchase: amount exceed");
            uint256 _privateTokenIdTracker = privateTokenIdTracker;
            IERC721(gen2).transferFrom(CORE_TEAM_ADDRESS, msg.sender, _privateTokenIdTracker);
            privateTokenIdTracker = _privateTokenIdTracker + 1;
            privateSaleBuyers[msg.sender] = privateSaleBuyers[msg.sender] + 1;

            // return change if any
            if (msg.value > TOKEN_PRICE_WEI) {
                payable(msg.sender).transfer(msg.value - TOKEN_PRICE_WEI);
            }
            payable(CORE_TEAM_ADDRESS).transfer(msg.value);
            console.log("Private sale buyers", privateTokenIdTracker);
    }


    /**
     * @dev Purchase NFTs
    */
    function purchase() external whenNotPaused nonReentrant payable {
        bool genesisHolder = _isGenesisHolder(msg.sender);
        /**
        * Genesis Holders 
        * Total amount : 666 (2pw)
        * TokenIds : #440 ~ #1105 
        * Start time 9 Mar 4am ~ --   timestamp : 1646758800
        */
        if(genesisHolder) {
            require(msg.value >= TOKEN_PRICE_WEI, "genSale.purchase: Insufficient funds");
            require(holderTokenIdTracker <= 1105, "genSale.purchase: sold out");
            require(block.timestamp >= 1646758800, "genSale.purchase: sale didn't start");
            require(genesisHolders[msg.sender] < 2, "genSale.purchase: amount exceed");
            uint256 _holderTokenIdTracker = holderTokenIdTracker;
            IERC721(gen2).transferFrom(CORE_TEAM_ADDRESS, msg.sender, _holderTokenIdTracker);
            holderTokenIdTracker = _holderTokenIdTracker + 1;
            genesisHolders[msg.sender] = genesisHolders[msg.sender] + 1;

            // return change if any
            if (msg.value > TOKEN_PRICE_WEI) {
                payable(msg.sender).transfer(msg.value - TOKEN_PRICE_WEI);
            }
            payable(CORE_TEAM_ADDRESS).transfer(msg.value);
            console.log("GenesisHolder", holderTokenIdTracker);
        }

       

        /**
        * Free claims
        * Total amount : 480
        * TokenIds : #2853 ~ #3332
        * Start time 12 Mar 4am ~ --   timestamp : 1647104400
        */

        else if((genesisHolder && genesisHolders[msg.sender] > 0) || _isGen2Holder(msg.sender)) {
            require(freeClaimTokenIdTracker <= 3332, "genSale.purchase: sold out");
            require(block.timestamp >= 1647104400, "genSale.purchase: sale didn't start");
            require(freeClaimUsers[msg.sender] < 1, "genSale.purchase: amount exceed");
            uint256 _freeClaimTokenIdTracker = freeClaimTokenIdTracker;
            IERC721(gen2).transferFrom(CORE_TEAM_ADDRESS, msg.sender, _freeClaimTokenIdTracker);
            freeClaimTokenIdTracker = _freeClaimTokenIdTracker + 1;
            freeClaimUsers[msg.sender] = freeClaimUsers[msg.sender] + 1;
            console.log("Free Claim", freeClaimTokenIdTracker);
        }
    }

    
    /**
     * @dev Check if wallet address owns any genesis tokens.
     * @param _account address
    */
    function _isGenesisHolder(address _account) internal view returns (bool) {
        return IERC721(genesis).balanceOf(_account) > 0;
    }


    /**
     * @dev Check if wallet address owns any gen2 tokens.
     * @param _account address
    */
    function _isGen2Holder(address _account) internal view returns (bool) {
        for(uint256 i = 340; i < 440; i ++) {
            if(IERC721(gen2).ownerOf(i) == _account) {
                return true;
            }
        }
        return false;
    }

    function pause() external onlyOwner {
        super._pause();
    }

    function unpause() external onlyOwner {
        super._unpause();
    }

    function setDesignatedSigners(address _whitelistSigner, address _privatelistSigner) external onlyOwner {
        designatedWhitelistSigner = _whitelistSigner;
        designatePrivatelistSigner = _privatelistSigner;
    }
}
