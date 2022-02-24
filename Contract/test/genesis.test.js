const { expect } = require('chai')
const { ethers } = require("hardhat")

describe('Genesis', () => {
  
  before(async () => {
    const users = await ethers.getSigners()

    this.tokenUri = "https://gladiators-metadata-api.herokuapp.com/api/token"
    this.deployer = users[0]
    this.users = users.slice(1)
    
    const genesis = await ethers.getContractFactory('Genesis')
    const mockNFT = await ethers.getContractFactory('MockNFT')

    this.mockNFT = await mockNFT.deploy()
    this.genesis = await genesis.deploy("genesis", "genesis", this.tokenUri, this.mockNFT.address)

    await this.genesis.connect(this.deployer).mint(1)
    await this.mockNFT.connect(this.users[0]).mint(this.users[1].address, 1)

    await this.mockNFT.connect(this.users[1]).setApprovalForAll(this.genesis.address, true)
  })

  it('mint function fails', async () => {
    await expect(this.genesis.connect(this.deployer).mint(
      333
    )).to.revertedWith('genesis : max limit')

    await expect(this.genesis.connect(this.deployer).mint(
      0
    )).to.revertedWith('genesis : mint amount invalid')
  })

  it('mint function succeeds', async () => {
    await this.genesis.connect(this.deployer).mint(3)

    expect(
      (await this.genesis.tokenIdTracker())
    ).to.equal(4)
  })

  it('claim function fails', async () => {
    await expect(this.genesis.connect(this.deployer).claim(
      []
    )).to.revertedWith('genesis : invalid tokenId length')

    await expect(this.genesis.connect(this.deployer).claim(
      [0]
    )).to.revertedWith('genesis : invalid tokenId')

    await expect(this.genesis.connect(this.deployer).claim(
      [1]
    )).to.revertedWith('genesis : sender is not owner')
  })

  it('claim function succeeds', async () => {

    await this.genesis.connect(this.users[1]).claim([1])

    expect(
      (await this.genesis.connect(this.users[1]).ownerOf(1))
    ).to.equal(this.users[1].address)
  })

  it('setBaseURI function fails', async () => {
    await expect(this.genesis.connect(this.deployer).setBaseURI(
      ""
    )).to.revertedWith('genesis : base URI invalid')
  })

  it('setBaseURI function succeeds', async () => {
    await this.genesis.connect(this.deployer).setBaseURI(this.tokenUri)

    expect(
      (await this.genesis.baseTokenURI())
    ).to.equal(this.tokenUri)
  })

})
