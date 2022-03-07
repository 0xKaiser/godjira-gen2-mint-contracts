const ethers = require('ethers')

const SIGNING_DOMAIN_NAME = "Godjira"
const SIGNING_DOMAIN_VERSION = "1"


class Whitelist {
  constructor({ contract, signer }) {
    this.contract = contract
    this.signer = signer
  }

  async createWhiteList(whiteListAddress, isPrivateListed) {
    const value = { whiteListAddress, isPrivateListed }
    const domain = await this._signingDomain()
    const types = {
      whitelisted: [
        {name: "whiteListAddress", type: "address"},
        {name: "isPrivateListed", type: "bool"}
      ]
    }
    const signature = await this.signer._signTypedData(domain, types, value)
    return {
      ...value,
      signature,
    }
  }

  async _signingDomain() {
    if (this._domain != null) {
      return this._domain
    }
    const chainId = await this.contract.getChainID()
    this._domain = {
      name: SIGNING_DOMAIN_NAME,
      version: SIGNING_DOMAIN_VERSION,
      verifyingContract: this.contract.address,
      chainId,
    }
    return this._domain
  }
}

module.exports = {
  Whitelist
}