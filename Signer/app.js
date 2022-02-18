const mongoose = require('mongoose')
const Signer = require('./Signer.js')
require('dotenv').config()


mongoose.connect(process.env.DATABASE_URI)
    .then(() => {console.log("Database Connected")
                Signer();
})
    .catch(() => console.log("Database Not Connected"))







