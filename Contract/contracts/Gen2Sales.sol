//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./whitelist.sol";

contract Gen2Sales is Ownable,whitelistChecker{

    IERC721 Godjira2;
    IERC721 Godjira1;
    address CORE_TEAM_ADDRESS = 0xC79b099E83f6ECc8242f93d35782562b42c459F3; 
    address designatedSigner; //TODO : Set Address

    uint PRICE = 0.099 ether;

    //TIMES 
    uint public PRIVATE_TIME = 1646751600;
    uint public HOLDERS_TIME = 1646758800;
    uint public WHITELIST_TIME = 1646845200;
    uint public CLAIM_TIME = 1647104400;

    //TOKEN TRACKERS
    uint16 public privateSaleTracker = 340; //340-439
    uint16 public genesisSaleTracker = 440; //440-1105
    uint16 public whitelistSaleTracker = 1106; //1106-2852

    uint16 public claimTracker = 2853; //2853-3332

    //SALE MAPPINGS
    mapping(address=>bool) public privateBought; //privatelisted > has bought
    mapping(uint=>bool) public genesisBought; //genesis token > has bought
    mapping(address=>bool) public whitelistBought; //whitelisted > has bought

    //CLAIM MAPPINGS
    mapping(uint=>bool) public genesisClaimed; //genesis token > has claimed
    mapping(uint=>bool) public gen2Claimed; //gen 2 token > has claimed

    bool public isPaused;

    constructor(address _godjira2, address _godjira1) {
        Godjira2 = IERC721(_godjira2);
        Godjira1 = IERC721(_godjira1);
    }

    modifier isNotPaused{
        require(!isPaused,"Execution paused");
        _;
    }
    //Region 1 - Sales

    function privateSale(whitelisted memory whitelist) external payable isNotPaused{
        require(getSigner(whitelist) == designatedSigner, "Invalid signature");
        require(msg.sender == whitelist.whiteListAddress, "not same user");
        require(whitelist.isPrivateListed, "is not private listed");
        require(!privateBought[msg.sender], "Already bought");
        require(block.timestamp > PRIVATE_TIME, "Sale not started");
        require(msg.value >= PRICE, "Paying too low");

        privateBought[msg.sender] = true;
        Godjira2.safeTransferFrom(CORE_TEAM_ADDRESS, msg.sender, privateSaleTracker);
        privateSaleTracker++;
    }

    function whitelistSale(whitelisted memory whitelist) external payable isNotPaused{
        require(getSigner(whitelist) == designatedSigner,"Invalid signature");
        require(msg.sender == whitelist.whiteListAddress,"not same user");
        require(!whitelist.isPrivateListed,"is private listed");
        require(!whitelistBought[msg.sender],"Already bought");
        require(block.timestamp > WHITELIST_TIME && block.timestamp < WHITELIST_TIME + 1 days,"Sale not started or has ended");
        require(msg.value >= PRICE,"Paying too low");

        whitelistBought[msg.sender] = true;
        Godjira2.safeTransferFrom(CORE_TEAM_ADDRESS,msg.sender,whitelistSaleTracker);
        whitelistSaleTracker++;
    }


    function genesisSale(uint[] memory tokenId) external payable isNotPaused{
        require(block.timestamp > HOLDERS_TIME,"Sale not started");
        require(msg.value >= 2*PRICE*tokenId.length,"Paying too low");
        for(uint i=0;i<tokenId.length;i++){
            require(Godjira1.ownerOf(tokenId[i]) == msg.sender,"Sender not owner");
            require(!genesisBought[tokenId[i]],"Already bought");

            genesisBought[tokenId[i]] = true;
            Godjira2.safeTransferFrom(CORE_TEAM_ADDRESS,msg.sender,genesisSaleTracker);
            Godjira2.safeTransferFrom(CORE_TEAM_ADDRESS,msg.sender,genesisSaleTracker+1);
            genesisSaleTracker += 2;
        }
    }

    // Region 2 - Claims

    function genesisClaim(uint[] memory tokenId) external isNotPaused{
        require(block.timestamp > CLAIM_TIME,"Claims not started");
        for(uint i=0;i<tokenId.length;i++){
            require(Godjira1.ownerOf(tokenId[i])==msg.sender,"Sender not owner");
            require(!genesisClaimed[tokenId[i]],"Already claimed");

            genesisClaimed[tokenId[i]] = true;
            Godjira2.safeTransferFrom(CORE_TEAM_ADDRESS,msg.sender,claimTracker);
            claimTracker++;
        }
    }

    function privateSalesClaim(uint[] memory tokenId) external isNotPaused{
        require(block.timestamp > CLAIM_TIME,"Claims not started");
        for(uint i=0;i<tokenId.length;i++){
            require(tokenId[i] >= 340 && tokenId[i] <= 439,"not valid token");
            require(Godjira2.ownerOf(tokenId[i])==msg.sender,"Sender not owner");
            require(!gen2Claimed[tokenId[i]],"Already claimed");

            gen2Claimed[tokenId[i]] = true;
            Godjira2.safeTransferFrom(CORE_TEAM_ADDRESS,msg.sender,claimTracker);
            claimTracker++;
        }
    }

    function withdraw() external onlyOwner{
        payable(msg.sender).transfer(address(this).balance);
    }

    function pauseContract(bool _paused) external onlyOwner{
        isPaused = _paused;
    }

    function modifyGodjira2(address _godjira) external onlyOwner{
        Godjira2 = IERC721(_godjira);
    }

    function modifyGodjira1(address _godjira) external onlyOwner{
        Godjira1 = IERC721(_godjira);
    }

    function modifySigner(address _signer) external onlyOwner{
        designatedSigner = _signer;
    }

    function modifyCoreTeamAddress(address _core) external onlyOwner{
        CORE_TEAM_ADDRESS = _core;
    }

    function modifyPrice(uint _price) external onlyOwner{
        PRICE = _price;
    }

    function modifyPrivateTime(uint _time) external onlyOwner{
        PRIVATE_TIME = _time;
    }

    function modifyWhitelistTime(uint _time) external onlyOwner{
        WHITELIST_TIME = _time;
    }

    function modifyHolderTime(uint _time) external onlyOwner{
        HOLDERS_TIME = _time;
    }

    function modifyClaimTime(uint _time) external onlyOwner{
        CLAIM_TIME = _time;
    }

}