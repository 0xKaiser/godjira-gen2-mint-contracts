const { expect } = require('chai')
const { ethers } = require("hardhat")

describe('Genesis', () => {
  
  before(async () => {
    const users = await ethers.getSigners()

    this.tokenUri = "https://gladiators-metadata-api.herokuapp.com/api/token"
    this.nftOwner = users[0]
    this.users = users.slice(1)

    const genesis = await ethers.getContractFactory('Genesis')

    this.genesis = await genesis.deploy("genesis", "genesis", this.tokenUri)

    await this.genesis.connect(this.nftOwner).mint(5)
  })

  it('mint function fails', async () => {
    await expect(this.genesis.connect(this.nftOwner).mint(
      330
    )).to.revertedWith('genesis : max limit')

    await expect(this.genesis.connect(this.nftOwner).mint(
      0
    )).to.revertedWith('genesis : mint amount invalid')
  })

  it('mint function succeeds', async () => {
    await this.genesis.connect(this.nftOwner).mint(3)

    expect(
      (await this.genesis.tokenIdTracker())
    ).to.equal(8)
  })

  it('setBaseURI function fails', async () => {
    await expect(this.genesis.connect(this.nftOwner).setBaseURI(
      ""
    )).to.revertedWith('genesis : base URI invalid')
  })

  it('setBaseURI function succeeds', async () => {
    await this.genesis.connect(this.nftOwner).setBaseURI(this.tokenUri)

    expect(
      (await this.genesis.baseTokenURI())
    ).to.equal(this.tokenUri)
  })

})
