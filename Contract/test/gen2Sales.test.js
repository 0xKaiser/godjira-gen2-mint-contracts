const { expect } = require('chai')
const { ethers } = require("hardhat")
const { advanceTime } = require('./utils')
const { Whitelist } = require('../lib')

const tokenPrice = ethers.utils.parseUnits('0.0999', 18);

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

    await this.genesis.connect(this.deployer).mint([10, 20])
    await this.mockNFT.connect(this.deployer).mint(this.users[1].address, 10)
    await this.mockNFT.connect(this.deployer).mint(this.users[1].address, 20)

    await this.mockNFT.connect(this.users[1]).setApprovalForAll(this.genesis.address, true)
    await this.genesis.connect(this.users[1]).claim([10, 20])

  })

  it('privateSale function succeeds', async () => {
    const whitelist = new Whitelist({ contract: this.gen2Sales, signer: this.deployer })
    const whitelisted = await whitelist.createWhiteList(this.users[2].address, false)
    await this.gen2Sales.connect(this.deployer).modifySigner(this.users[2].address)
    // const designatedSigner = await this.gen2Sales.designatedSigner()
    await this.gen2Sales.connect(this.users[2]).privateSale(whitelisted)
  })
    
    return;
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


  it('addPrivateSaleList function fails', async () => {
    await expect(this.gen2Sale.connect(this.deployer).addPrivateSaleList(
      [this.users[2].address]
    )).to.revertedWith('gen2Sale.addPrivateSaleList: should be not whitelist')
  })

  it('addPrivateSaleList function succeeds', async () => {
    await this.gen2Sale.connect(this.deployer).addPrivateSaleList([this.users[6].address, this.users[7].address])
    expect(
      (await this.gen2Sale.privateSaleList(this.users[7].address))
    ).to.equal(true)
  })

  it('removePrivateSaleList function succeeds', async () => {
    await this.gen2Sale.connect(this.deployer).removePrivateSaleList([this.users[7].address])
    expect(
      (await this.gen2Sale.privateSaleList(this.users[7].address))
    ).to.equal(false)
  })

  it('purchase function fails when private sale buyer trying to buy before sale date', async () => {
    // Private sale buyer
    await expect(
      this.gen2Sale.connect(this.users[6]).purchase({value: tokenPrice})
    ).to.revertedWith("genSale.purchase: sale didn't start")
  })

  it('purchase function succeeds : refund', async () => {
    await advanceTime(3 * 3600 * 24)
    // const beforeBalance = await web3.eth.getBalance(this.users[1].address)
    // Genesis holder
    const price = ethers.utils.parseUnits('0.1', 18);
    await this.gen2Sale.connect(this.users[1]).purchase({value: price})
    const holderNewGen2Owner = await this.gen2.ownerOf(440);
    expect(holderNewGen2Owner).to.equal(this.users[1].address)
  })

  it('purchase function succeeds', async () => {
    // Private sale buyer
    await this.gen2Sale.connect(this.users[6]).purchase({value: tokenPrice})
    const privateNewGen2Owner = await this.gen2.ownerOf(340);
    expect(privateNewGen2Owner).to.equal(this.users[6].address)

    // Genesis holder
    await this.gen2Sale.connect(this.users[1]).purchase({value: tokenPrice})
    const holderNewGen2Owner = await this.gen2.ownerOf(440);
    expect(holderNewGen2Owner).to.equal(this.users[1].address)
    await this.gen2Sale.connect(this.users[1]).purchase({value: tokenPrice})
    await this.gen2Sale.connect(this.users[1]).purchase({value: tokenPrice})
    // await this.gen2Sale.connect(this.users[1]).purchase({value: tokenPrice})

    // Whitelist wallet
    await advanceTime(1 * 3600 * 24)
    await this.gen2Sale.connect(this.users[2]).purchase({value: tokenPrice})
    const whitelistNewGen2Owner = await this.gen2.ownerOf(1106)
    expect(whitelistNewGen2Owner).to.equal(this.users[2].address)

    // Free Claim / Genesis holder
    await advanceTime(3 * 3600 * 24)
    await this.gen2Sale.connect(this.users[1]).purchase()

    // Free Claim / Gen2 holder (#340 ~ #439)
    await this.gen2Sale.connect(this.users[6]).purchase({value: tokenPrice})
  })

  it('purchase function fails when genesis holder has been changed', async () => {
    await this.genesis.connect(this.users[1]).transferFrom(this.users[1].address, this.users[4].address, 10)
    expect(await this.genesis.ownerOf(10)).to.equal(this.users[4].address)
    await expect(
      this.gen2Sale.connect(this.users[4]).purchase({value: tokenPrice})
    ).to.revertedWith("genSale.purchase: has already been used to mint")
  })

  it('pause function succeeds', async () => {
    this.gen2Sale.connect(this.deployer).pause()
  })

  it('unpause function succeeds', async () => {
    this.gen2Sale.connect(this.deployer).unpause()
  })
})
