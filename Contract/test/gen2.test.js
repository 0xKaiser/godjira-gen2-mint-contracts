const { expect } = require('chai')
const { ethers } = require("hardhat")

describe('Gen2', () => {
  
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
  })

  it('setGen2Sale function fails', async () => {
    await expect(this.gen2.connect(this.deployer).setGen2Sale(
      "0x0000000000000000000000000000000000000000"
    )).to.revertedWith('gen2.setGen2Sale: address invalid')
  })

  it('setGen2Sale function succeeds', async () => {
    await this.gen2.connect(this.deployer).setGen2Sale(this.gen2Sale.address)
    expect(
      (await this.gen2.gen2Sale())
    ).to.equal(this.gen2Sale.address)
  })

  it('setBaseURI function fails', async () => {
    await expect(this.gen2.connect(this.deployer).setBaseURI(
      ""
    )).to.revertedWith('gen2.setBaseURI: base URI invalid')
  })

  it('setBaseURI function succeeds', async () => {
    await this.gen2.connect(this.deployer).setBaseURI(this.tokenUri)
    expect(
      (await this.gen2.baseTokenURI())
    ).to.equal(this.tokenUri)
  })

})
