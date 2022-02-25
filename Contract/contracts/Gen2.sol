//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "erc721a/contracts/ERC721A.sol";

contract Gen2 is ERC721A, Ownable, Pausable, ReentrancyGuard {
    /// @dev token id tracker
    uint256 public tokenIdTracker;

    /// @dev Maximum elements
    uint256 CAP = 3333;

    /// @dev baseTokenURI
    string public baseTokenURI;

    address public immutable legendaryAddress =
        0xF6f94e2faAb5D415f40a4755860C788df050a37c;
    address public immutable godjiraAddress =
        0x3B0C7fb36cCf7bB203e5126B2192371Af91831BF;

    /// @dev wallet address => whitelist status
    mapping(address => bool) public whitelist;
    mapping(address => uint256) public nfts;

    event Minted(address indexed to, uint256 tokenId);
    event SetBaseTokenURI(string baseTokenURI);
    event Emited(address white, bool status);

    /**
     * @dev Allow mint when sale is open
     */
    modifier saleIsOpen() {
        require(tokenIdTracker <= CAP, "gen2: sale cap exceed");
        if (msg.sender != owner()) {
            require(!paused(), "gen2: paused");
        }
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        string memory baseToken_
    ) ERC721A(_name, _symbol) {
        setBaseURI(baseToken_);
    }

    /**
     * @dev Mint NFTs
     */
    function mint(uint256 _amount) external nonReentrant saleIsOpen {
        uint256 _tokenIdTracker = tokenIdTracker;

        require(_amount > 0, "gen2 : mint amount invalid");
        require(_tokenIdTracker + _amount <= CAP, "gen2 : max limit");

        // TODO check for loop
        if (_tokenIdTracker + _amount < 11) {
            require(owner() == msg.sender, "gen2: caller is not the owner");

            for (uint256 i = 0; i < _amount; i++) {
                tokenIdTracker = _tokenIdTracker + 1;
                _safeMint(legendaryAddress, _tokenIdTracker + 1);

                emit Minted(legendaryAddress, _tokenIdTracker + 1);
                _tokenIdTracker++;
            }
            
            nfts[legendaryAddress] = _tokenIdTracker;
        } else if (_tokenIdTracker + _amount < 111) {
            require(owner() == msg.sender, "gen2: caller is not the owner");

            for (uint256 i = 0; i < _amount; i++) {
                tokenIdTracker = _tokenIdTracker + 1;
                _safeMint(godjiraAddress, _tokenIdTracker + 1);

                emit Minted(godjiraAddress, _tokenIdTracker + 1);
                _tokenIdTracker++;
            }

            nfts[godjiraAddress] = _tokenIdTracker;
        } else if (_tokenIdTracker < 1301) {
            require(
                msg.sender != legendaryAddress && msg.sender != godjiraAddress,
                "gen2: legendary, godjira unavailable"
            );
            require(_amount == 1, "gen2: public invalid amount");
            require(nfts[msg.sender] == 0, "gen2: public invalid address");

            tokenIdTracker = _tokenIdTracker + 1;
            _safeMint(msg.sender, _tokenIdTracker + 1);
            nfts[msg.sender] = _tokenIdTracker + 1;

            emit Minted(msg.sender, _amount);
        } else if (_tokenIdTracker < 2901) {
            require(
                msg.sender != legendaryAddress && msg.sender != godjiraAddress,
                "gen2: legendary, godjira unavailable"
            );
            require(_amount == 1, "gen2: whitelist invalid amount");
            require(
                whitelist[msg.sender],
                "gen2: whitelist caller not whitelisted"
            );
            require(nfts[msg.sender] == 0, "gen2: whitelist invalid address");

            tokenIdTracker = _tokenIdTracker + 1;
            _safeMint(msg.sender, _tokenIdTracker + 1);
            nfts[msg.sender] = _tokenIdTracker + 1;

            emit Minted(msg.sender, _amount);
        } else if (_tokenIdTracker >= 2901) {
            require(
                msg.sender != legendaryAddress && msg.sender != godjiraAddress,
                "gen2: legendary, godjira unavailable"
            );
            require(_amount == 1, "gen2: free invalid amount");
            require(nfts[msg.sender] == 0, "gen2: free invalid address");

            tokenIdTracker = _tokenIdTracker + 1;
            _safeMint(msg.sender, _tokenIdTracker + 1);
            nfts[msg.sender] = _tokenIdTracker + 1;

            emit Minted(msg.sender, _amount);
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
     * @dev Add 'whitelist'
     */
    function addWhiteList(address[] memory _accounts) public onlyOwner {
        for (uint256 i = 0; i < _accounts.length; i++) {
            if (_accounts[i] != address(0)) whitelist[_accounts[i]] = true;

            emit Emited(_accounts[i], true);
        }
    }

    /**
     * @dev Add 'whitelist'
     */
    function removeWhiteList(address[] memory _accounts) public onlyOwner {
        for (uint256 i = 0; i < _accounts.length; i++) {
            whitelist[_accounts[i]] = false;

            emit Emited(_accounts[i], false);
        }
    }

    function pause() external whenNotPaused onlyOwner {
        super._pause();
    }

    function unpause() external whenPaused onlyOwner {
        super._unpause();
    }
}
