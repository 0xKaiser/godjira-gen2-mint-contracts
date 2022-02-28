const { expect } = require('chai')
const { ethers } = require("hardhat")
const { BN } = require("web3-utils");

describe.only('Gen2', () => {
  
  before(async () => {
    const users = await ethers.getSigners()

    this.tokenUri = "https://gladiators-metadata-api.herokuapp.com/api/token"
    this.deployer = users[0]
    this.users = users.slice(1)
    
    const gen2 = await ethers.getContractFactory('Gen2')
    this.gen2 = await gen2.deploy("gen2", "gen2", this.tokenUri)

    // await this.gen2.connect(this.deployer).mint([1])
  })

  it('mint function fails when minting with zero amount', async () => {
    await expect(this.gen2.connect(this.deployer).mint(
      0
    )).to.revertedWith('gen2 : mint amount invalid')
  })

  it('mint function fails when minting with exceed amount', async () => {
    await expect(this.gen2.connect(this.deployer).mint(
      3500
    )).to.revertedWith('gen2 : max limit')
  })

  it('mint function fails when minting legendary if not owner', async () => {
    await expect(this.gen2.connect(this.users[0]).mint(
      10
    )).to.revertedWith('gen2: caller is not the owner')
  })

  it('mint function fails when minting projectgodjira.eth if not owner', async () => {
    await expect(this.gen2.connect(this.users[0]).mint(
      100
    )).to.revertedWith('gen2: caller is not the owner')
  })

  it('mint function fails when minting public with exceed amount', async () => {
    await expect(this.gen2.connect(this.users[0]).mint(
      1000
    )).to.revertedWith('gen2: public invalid amount')
  })

  it('mint function fails when minting public if creator try again', async () => {
    await this.gen2.connect(this.deployer).mint(10)
    await this.gen2.connect(this.deployer).mint(100)
    await this.gen2.connect(this.users[1]).mint(1)

    await expect(this.gen2.connect(this.users[1]).mint(
      1
    )).to.revertedWith('gen2: public invalid address')
  })

  it('mint function succeeds', async () => {
    await this.gen2.connect(this.users[2]).mint(1)

    const tokenId = await this.gen2.nfts('0xF6f94e2faAb5D415f40a4755860C788df050a37c')
    expect(tokenId.toString()).to.equal(new BN("10").toString())
  })

  it('setBaseURI function fails', async () => {
    await expect(this.gen2.connect(this.deployer).setBaseURI(
      ""
    )).to.revertedWith('gen2 : base URI invalid')
  })

  it('setBaseURI function succeeds', async () => {
    await this.gen2.connect(this.deployer).setBaseURI(this.tokenUri)
    expect(
      (await this.gen2.baseTokenURI())
    ).to.equal(this.tokenUri)
  })

})
