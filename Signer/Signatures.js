const mongoose =require('mongoose');

const serviceSchema = new mongoose.Schema({
    signature: String,
})

module.exports = mongoose.model('Signatures', serviceSchema)
