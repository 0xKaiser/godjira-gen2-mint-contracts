const { expect } = require('chai')
const { ethers } = require("hardhat")
const { BN } = require("web3-utils");

describe.only('Gen2Sale', () => {
  
  before(async () => {
    const users = await ethers.getSigners()

    this.tokenUri = "https://gladiators-metadata-api.herokuapp.com/api/token"
    this.deployer = users[0]
    this.users = users.slice(1)

    const genesis = await ethers.getContractFactory('Genesis')
    const mockNFT = await ethers.getContractFactory('MockNFT')

    this.mockNFT = await mockNFT.deploy()
    this.genesis = await genesis.deploy("genesis", "genesis", this.tokenUri, this.mockNFT.address)
    
    const gen2 = await ethers.getContractFactory('Gen2')
    this.gen2 = await gen2.deploy("gen2", "gen2", this.tokenUri)

    const gen2Sale = await ethers.getContractFactory('Gen2Sale')
    this.gen2Sale = await gen2Sale.deploy(this.genesis.address, this.gen2.address)

    // Set Gen2Sale address
    this.gen2.connect(this.deployer).setGen2Sale(this.gen2Sale.address)

    await this.genesis.connect(this.deployer).mint([1])
    await this.mockNFT.connect(this.deployer).mint(this.users[1].address, 1)

    await this.mockNFT.connect(this.users[1]).setApprovalForAll(this.genesis.address, true)
    await this.genesis.connect(this.users[1]).claim([1])
  })

  it('addWhiteList function fails', async () => {
    await expect(this.gen2Sale.connect(this.deployer).addWhiteList(
      [this.users[1].address]
    )).to.revertedWith('gen2Sale.addWhiteList: should be not genesis holder')
  })

  it('addWhiteList function succeeds', async () => {
    await this.gen2Sale.connect(this.deployer).addWhiteList([this.users[2].address, this.users[8].address])
    expect(
      (await this.gen2Sale.whitelist(this.users[2].address))
    ).to.equal(true)
  })

  it('removeWhiteList function succeeds', async () => {
    await this.gen2Sale.connect(this.deployer).removeWhiteList([this.users[8].address])
    expect(
      (await this.gen2Sale.whitelist(this.users[8].address))
    ).to.equal(false)
  })

  it('purchase function succeeds', async () => {
    // const owner1 = await this.gen2.ownerOf(0)
    // const owner2 = await this.gen2.ownerOf(1)
    // const owner3 = await this.gen2.totalSupply()

    
    // Genesis holder
    await this.gen2Sale.connect(this.users[1]).purchase()
    const owner = await this.gen2.ownerOf(341);
    expect(owner).to.equal(this.users[1].address)
    return
    
    // Whitelist wallet
    await this.gen2.connect(this.deployer).addWhiteList([this.users[2].address])
    await this.gen2.connect(this.users[2]).mint(1)

    

    // Private sale buyer
    await this.gen2.connect(this.users[3]).mint(1)
    return;

    // Core start
    for(var i = 0; i < 31; i ++) {
      await this.gen2.connect(this.deployer).mint(10)
    }
    // Core end

    // Founder Shan start
    await this.gen2.connect(this.deployer).mint(15)
    // Founder Shan end

    // Founder Jamie start
    await this.gen2.connect(this.deployer).mint(15)
    // Founder Jamie end


    // const tokenId = await this.gen2.nfts('0xF6f94e2faAb5D415f40a4755860C788df050a37c')
    // expect(tokenId.toString()).to.equal(new BN("10").toString())
  })

})
