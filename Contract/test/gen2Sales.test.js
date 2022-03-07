const { expect } = require('chai')
const { ethers } = require("hardhat")
const { advanceTime } = require('./utils')
const { Whitelist } = require('../lib')

const tokenPrice = ethers.utils.parseUnits('0.0999', 18);
const multiPrice = ethers.utils.parseUnits('0.1998', 18);

describe.only('Gen2Sales', () => {
  
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

    const gen2Sales = await ethers.getContractFactory('Gen2Sales')
    this.gen2Sales = await gen2Sales.deploy(this.gen2.address, this.genesis.address)

    // Set Gen2Sale address
    this.gen2.connect(this.deployer).setGen2Sale(this.gen2Sales.address)

    await this.genesis.connect(this.deployer).mint([10, 20])
    await this.mockNFT.connect(this.deployer).mint(this.users[1].address, 10)
    await this.mockNFT.connect(this.deployer).mint(this.users[1].address, 20)

    await this.mockNFT.connect(this.users[1]).setApprovalForAll(this.genesis.address, true)
    await this.genesis.connect(this.users[1]).claim([10, 20])

  })

  it('privateSale function fails: Sale not started', async () => {
    const whitelist = new Whitelist({ contract: this.gen2Sales, signer: this.users[2] })
    const whitelisted = await whitelist.createWhiteList(this.users[2].address, true)
    await this.gen2Sales.connect(this.deployer).modifySigner(this.users[2].address)
    await expect(
      this.gen2Sales.connect(this.users[2]).privateSale(whitelisted)
    ).to.revertedWith('Sale not started')
  })

  it('whitelistSale function fails: Invalid signature', async () => {
    const whitelist = new Whitelist({ contract: this.gen2Sales, signer: this.users[3] })
    const whitelisted = await whitelist.createWhiteList(this.users[2].address, false)
    await this.gen2Sales.connect(this.deployer).modifySigner(this.users[3].address)

    await expect(
      this.gen2Sales.connect(this.users[2]).whitelistSale(whitelisted)
    ).to.revertedWith('Sale not started or has ended')
  })

  it('genesisSale function fails: Sale not started', async () => {
    await expect(
      this.gen2Sales.connect(this.users[1]).genesisSale([341])
    ).to.revertedWith('Sale not started')
  })

  it('genesisClaim function fails: Claims not started', async () => {
    await expect(
      this.gen2Sales.connect(this.users[1]).genesisClaim([2853, 2854])
    ).to.revertedWith('Claims not started')
  })

  it('privateSalesClaim function fails: Claims not started', async () => {
    await expect(
      this.gen2Sales.connect(this.users[1]).privateSalesClaim([341])
    ).to.revertedWith('Claims not started')
  })

  
  //privateSale
  it('privateSale function fails: Invalid signature', async () => {
    const whitelist = new Whitelist({ contract: this.gen2Sales, signer: this.users[2] })
    const whitelisted = await whitelist.createWhiteList(this.users[2].address, true)
    await this.gen2Sales.connect(this.deployer).modifySigner(this.users[3].address)

    await expect(
      this.gen2Sales.connect(this.users[2]).privateSale(whitelisted)
    ).to.revertedWith('Invalid signature')
  })

  it('privateSale function fails: Paying too low', async () => {
    await advanceTime(1 * 3600 * 24)
    const whitelist = new Whitelist({ contract: this.gen2Sales, signer: this.users[2] })
    const whitelisted = await whitelist.createWhiteList(this.users[2].address, true)
    await this.gen2Sales.connect(this.deployer).modifySigner(this.users[2].address)
    await expect(
      this.gen2Sales.connect(this.users[2]).privateSale(whitelisted)
    ).to.revertedWith('Paying too low')
  })

  it('privateSale function fails: is not private listed', async () => {
    const whitelist = new Whitelist({ contract: this.gen2Sales, signer: this.users[2] })
    const whitelisted = await whitelist.createWhiteList(this.users[2].address, false)
    await this.gen2Sales.connect(this.deployer).modifySigner(this.users[2].address)

    await expect(
      this.gen2Sales.connect(this.users[2]).privateSale(whitelisted)
    ).to.revertedWith('is not private listed')
  })

  it('privateSale function succeeds', async () => {
    await advanceTime(1 * 3600 * 24)
    const whitelist = new Whitelist({ contract: this.gen2Sales, signer: this.users[2] })
    const whitelisted = await whitelist.createWhiteList(this.users[2].address, true)
    await this.gen2Sales.connect(this.deployer).modifySigner(this.users[2].address)
    await this.gen2Sales.connect(this.users[2]).privateSale(whitelisted, {value: tokenPrice})
    const owner = await this.gen2.ownerOf(340);
    expect(owner).to.equal(this.users[2].address)
  })

  it('privateSale function fails: Already bought', async () => {
    const whitelist = new Whitelist({ contract: this.gen2Sales, signer: this.users[2] })
    const whitelisted = await whitelist.createWhiteList(this.users[2].address, true)
    await this.gen2Sales.connect(this.deployer).modifySigner(this.users[2].address)

    await expect(
      this.gen2Sales.connect(this.users[2]).privateSale(whitelisted)
    ).to.revertedWith('Already bought')
  })

  it('privateSale function fails: not same user', async () => {
    const whitelist = new Whitelist({ contract: this.gen2Sales, signer: this.users[2] })
    const whitelisted = await whitelist.createWhiteList(this.users[2].address, true)
    await this.gen2Sales.connect(this.deployer).modifySigner(this.users[2].address)

    await expect(
      this.gen2Sales.connect(this.users[3]).privateSale(whitelisted)
    ).to.revertedWith('not same user')
  })

  //whitelistSale
  it('whitelistSale function fails: Invalid signature', async () => {
    const whitelist = new Whitelist({ contract: this.gen2Sales, signer: this.users[2] })
    const whitelisted = await whitelist.createWhiteList(this.users[2].address, false)
    await this.gen2Sales.connect(this.deployer).modifySigner(this.users[3].address)

    await expect(
      this.gen2Sales.connect(this.users[2]).whitelistSale(whitelisted)
    ).to.revertedWith('Invalid signature')
  })

  it('whitelistSale function fails: not same user', async () => {
    const whitelist = new Whitelist({ contract: this.gen2Sales, signer: this.users[2] })
    const whitelisted = await whitelist.createWhiteList(this.users[2].address, false)
    await this.gen2Sales.connect(this.deployer).modifySigner(this.users[2].address)

    await expect(
      this.gen2Sales.connect(this.users[3]).whitelistSale(whitelisted)
    ).to.revertedWith('not same user')
  })

  it('whitelistSale function fails: is private listed', async () => {
    const whitelist = new Whitelist({ contract: this.gen2Sales, signer: this.users[2] })
    const whitelisted = await whitelist.createWhiteList(this.users[2].address, true)
    await this.gen2Sales.connect(this.deployer).modifySigner(this.users[2].address)

    await expect(
      this.gen2Sales.connect(this.users[2]).whitelistSale(whitelisted)
    ).to.revertedWith('is private listed')
  })

  it('whitelistSale function fails: Paying too low', async () => {
    const whitelist = new Whitelist({ contract: this.gen2Sales, signer: this.users[2] })
    const whitelisted = await whitelist.createWhiteList(this.users[2].address, false)
    await this.gen2Sales.connect(this.deployer).modifySigner(this.users[2].address)

    await expect(
      this.gen2Sales.connect(this.users[2]).whitelistSale(whitelisted)
    ).to.revertedWith('Paying too low')
  })

  it('whitelistSale function succeeds', async () => {
    const whitelist = new Whitelist({ contract: this.gen2Sales, signer: this.users[2] })
    const whitelisted = await whitelist.createWhiteList(this.users[2].address, false)
    await this.gen2Sales.connect(this.deployer).modifySigner(this.users[2].address)
    await this.gen2Sales.connect(this.users[2]).whitelistSale(whitelisted, {value: tokenPrice})
    const owner = await this.gen2.ownerOf(1106);
    expect(owner).to.equal(this.users[2].address)
  })

  it('whitelistSale function fails: Already bought', async () => {
    const whitelist = new Whitelist({ contract: this.gen2Sales, signer: this.users[2] })
    const whitelisted = await whitelist.createWhiteList(this.users[2].address, false)
    await this.gen2Sales.connect(this.deployer).modifySigner(this.users[2].address)

    await expect(
      this.gen2Sales.connect(this.users[2]).whitelistSale(whitelisted, {value: tokenPrice})
    ).to.revertedWith('Already bought')
  })

  //genesisSale
  it('genesisSale function fails: Paying too low', async () => {
    await expect(
      this.gen2Sales.connect(this.users[3]).genesisSale([20])
    ).to.revertedWith('Paying too low')
  })

  it('genesisSale function fails: Sender not owner', async () => {
    await expect(
      this.gen2Sales.connect(this.users[3]).genesisSale([20], {value: multiPrice})
    ).to.revertedWith('Sender not owner')
  })

  it('genesisSale function succeeds', async () => {
    await this.gen2Sales.connect(this.users[1]).genesisSale([20], {value: multiPrice})
    const owner = await this.gen2.ownerOf(440);
    expect(owner).to.equal(this.users[1].address)
  })

  it('genesisSale function fails: Already bought', async () => {
    await expect(
      this.gen2Sales.connect(this.users[1]).genesisSale([20], {value: multiPrice})
    ).to.revertedWith('Already bought')
  })

  //Genesis Claim
  it('genesisClaim function fails: Sender not owner', async () => {
    await advanceTime(3 * 3600 * 24)
    await expect(
      this.gen2Sales.connect(this.users[3]).genesisClaim([20])
    ).to.revertedWith('Sender not owner')
  })

  it('genesisClaim function succeeds', async () => {
    await this.gen2Sales.connect(this.users[1]).genesisClaim([20])
    const owner = await this.gen2.ownerOf(2853);
    expect(owner).to.equal(this.users[1].address)
  })

  it('genesisClaim function fails: Already claimed', async () => {
    await expect(
      this.gen2Sales.connect(this.users[1]).genesisClaim([20])
    ).to.revertedWith('Already claimed')
  })

  //privateSalesClaim
  it('privateSalesClaim function fails: not valid token', async () => {
    await expect(
      this.gen2Sales.connect(this.users[1]).privateSalesClaim([20])
    ).to.revertedWith('not valid token')
  })

  it('privateSalesClaim function fails: Sender not owner', async () => {
    await expect(
      this.gen2Sales.connect(this.users[1]).privateSalesClaim([341])
    ).to.revertedWith('Sender not owner')
  })

  it('privateSalesClaim function succeeds', async () => {
    await this.gen2Sales.connect(this.users[2]).privateSalesClaim([340])
    const owner = await this.gen2.ownerOf(2854);
    expect(owner).to.equal(this.users[2].address) 
  })

  it('privateSalesClaim function fails: Already claimed', async () => {
    await expect(
      this.gen2Sales.connect(this.users[2]).privateSalesClaim([340])
    ).to.revertedWith('Already claimed')
  })

})
