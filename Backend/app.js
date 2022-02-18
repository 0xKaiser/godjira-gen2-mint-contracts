require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const Signature = require('./Signatures')

const app = express();
app.use(cors());
app.use(express.json())

mongoose.connect(process.env.DATABASE_URI)
    .then(() => {
        console.log("Database Connected")
    })
    .catch(() => console.log("Database Not Connected"))

app.listen(process.env.PORT,() => console.log(`server started`))
    

app.get('/', async (req, res) => {
    res.send('None of Your Business here')
})

app.post('/whiteList', async (req, res) => {
    console.log(req.body)
    const wallet = req.body.wallet;
    Signature.findOne({ address: wallet })
        .then((result) => { 
            console.log(result)
            if(result){ 
                res.send(result.signature)
            }
            else {
                console.log('Else')
                res.status(404).send()
            }
           
        })
        .catch(() =>{ 
            console.log("Error")

        })

})
