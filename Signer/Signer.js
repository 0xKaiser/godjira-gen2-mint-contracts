require('dotenv').config()
const List = require('./List.js')
async function Signer() {
    const ethers = require('ethers')
    const Signature = require('./Signatures')


    const SIGNING_DOMAIN_NAME = 'Tribe-Pass'
    const SIGNING_DOMAIN_VERSION = '1'


    privateKey = process.env.PRIVATE_KEY
    keysToSing = List

    const domain = {
        name: SIGNING_DOMAIN_NAME,
        version: SIGNING_DOMAIN_VERSION,
        chainId: 4,
        verifyingContract: '0xE5e766241dcB766AaeADD4D997F7f7F2b188109b'
    };
    const types = {
        Whitelist: [
            { name: 'userAddress', type: 'address' },
        ],
        
    };

    const wallet = new ethers.Wallet(privateKey)
    console.log(wallet.address)


    for (i in keysToSing) {
        // wallet.signMessage(keysToSing[i]).then((signature) => {
        //     console.log(signature)
        // })
        const value = {
           userAddress: keysToSing[i]
        };

        sign =await wallet._signTypedData(domain, types, value)
        console.log(sign)
        let test = await ethers.utils.verifyTypedData(domain, types, value, sign)
        console.log(test)
        let new_signature = new Signature({
             signature:sign
        })
        await new_signature.save()
    }
}

module.exports = Signer;