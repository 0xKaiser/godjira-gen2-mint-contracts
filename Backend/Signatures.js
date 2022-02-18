const mongoose =require('mongoose');

const serviceSchema = new mongoose.Schema({
    address: String,
    signature: String
})

module.exports = mongoose.model('Signatures', serviceSchema)
