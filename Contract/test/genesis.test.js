const { expect } = require('chai')
const { ethers } = require("hardhat")

describe('Genesis', () => {
  
  before(async () => {
    const users = await ethers.getSigners()

    this.tokenId = "111709445291923781731501347496390431316542435953578477260271931475106727985153"
    this.tokenUri = "https://gladiators-metadata-api.herokuapp.com/api/token"
    this.nftOwner = users[0]
    this.users = users.slice(1)

    const genesis = await ethers.getContractFactory('Genesis')

    this.genesis = await genesis.deploy("genesis", "genesis", this.tokenUri)

    await this.genesis.connect(this.nftOwner).mint(this.users[0].address, this.tokenId)
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
