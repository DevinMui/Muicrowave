//express setup
const express = require('express')
const app = express()
const fs = require('fs')
const request = require('request')
var https = require('https')
app.use(express.static('./'))
app.use(express.json())

// debug route -- will return true if debugging
app.post('/debug', function (req, res) {
    console.log(req.body)
    res.send(JSON.stringify({ success: process.env.debug == undefined ? true : process.env.debug }))
})
// get microwave status
app.get('/status', function (req, res) {
    res.send(JSON.stringify({ busy: false }))
})
app.post('/image-recognition', function (req, res) {
    res.send(JSON.stringify({ name: 'popcorn', time: 6 }))
})
app.post('/cc', (req, res) => {
    req.body.expiry = req.body.expiry.split(' ').join('').split('/')
    let obj = {
        "createTransactionRequest": {
            "merchantAuthentication": {
                "name": process.env.authorizeName,
                "transactionKey": process.env.tKey
            },
            "transactionRequest": {
                "transactionType": "authCaptureTransaction",
                "amount": req.body.cash,
                "payment": {
                    "creditCard": {
                        "cardNumber": req.body.number.split(' ').join(''),
                        "expirationDate": '20' + req.body.expiry[1] +'-'+req.body.expiry[0],
                        "cardCode": req.body.cvc
                    }
                },
                "lineItems": {
                    "lineItem": {
                        "itemId": "100",
                    "name": "Microwave Transaction",
                    "description": "sanyo em-s7560w",
                    "quantity": "1",
                    "unitPrice": "45.00"
                    }
                },
                "transactionSettings": {
                    "setting": {
                        "settingName": "duplicateWindow",
                        "settingValue": "2"
                    }
                }
    
            }
        }
    }
    request.post({
        headers: { 'content-type': 'application/json' },
        url: 'https://apitest.authorize.net/xml/v1/request.api',
        json: true,
        body: obj
    }, function (error, response, body) {
        console.log(body)
        body = JSON.parse(body.substr(1))
        console.log(body)
        // if(body.transactionResponse.requestCode % 3 == 1) // should probably check for errors
            res.status(200).send()
        // else
        //     res.status(500).send()
    })
})
if (!process.env.PORT) process.env.PORT = 3000
if (process.env.debug == undefined)
    https.createServer({
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert')
    }, app)
        .listen(process.env.PORT, function () { console.log('now listening on ' + process.env.PORT) })
else
    app.listen(process.env.PORT, function () { console.log('now listening on ' + process.env.PORT) })

