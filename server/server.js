var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var fs = require('fs')
// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

// Creates a client
const client = new vision.ImageAnnotatorClient();

app.use(express.static('./views'))
bodyParser.urlencoded({ extended: true })
app.use(bodyParser.json({limit: '50mb'}))

var time = undefined
var lock = false
var unlock = false
var singleFood = undefined
var recognize = false
var food = []
var calories = 0

// microwave only
app.get('/s', function (req, res) {
	ttime = time
	tlock = lock
	tunlock = unlock
	time = undefined
	lock = false
	unlock = false
	res.json({
		time: ttime,
		lock: tlock,
		unlock: tunlock
	})
})

// post to set microwave to turn on
app.post('/time', function (req, res) {
	time = req.body.time
	console.log(time)
	console.log(typeof(time))
	res.json({ time: time })
})

// lock the microwave
app.get('/lock', function (req, res) {
	lock = true
	recognize = true
	res.json({ lock: lock })
})

// unlock the microwave
app.get('/unlock', function (req, res) {
	unlock = true
	res.json({ unlock: unlock })
})

// add food to list
app.post('/food', function (req, res) {
	singleFood = req.body
	food.push(req.body)
	res.json({ foods: food })
})

app.get('/single-food', function (req, res) {
	var tsingleFood = singleFood
	time = singleFood.time
	singleFood = undefined
	res.json({ food: tsingleFood })
})

// show food
app.get('/food', function (req, res) {
	res.json({ foods: food })
})

// remove foods
app.get('/clear-food', function (req, res) {
	food = []
	res.json({ foods: food })
})

app.get('/recognize', function (req, res) {
	var trecognize = recognize
	recognize = false
	res.json({ recognize: trecognize })
})

app.get('/recognize-t', function (req, res) {
	recognize = true
	res.json({ recognize: recognize })
})

app.get('/debug', function (req, res) {
	res.json({
		recognize: recognize,
		food: food,
		unlock: unlock,
		lock: lock,
		time: time
	})
})

recognizeFood = false
app.get('/recognize-food', function (req, res) {
	var trecognizeFood = recognizeFood
	recognizeFood = false
	res.json({
		recognizeFood: trecognizeFood
	})
})

app.get('/recognize-food-t', function (req, res) {
	recognizeFood = true
	res.json({ recognizeFood: recognizeFood })
})
app.get('/calories', function(req, res){
	res.json({calories: calories})
})
app.post('/image-recognition', function (req, res) {
	const base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
	fs.writeFile("image.png", base64Data, 'base64', function (err) {
		if (err) return console.log(err);
		client
			.labelDetection('./image.png')
			.then(resp => {
				resp = (resp[0].labelAnnotations)

				let results = resp.map(i=>i.description)
				console.log(results)
				if (results.includes('Baked goods')) {
					res.json({ name: "muffin", time: 1 })
					time = 30
					calories += 600
					food.push('muffin')
				}
				else if (results.includes('Fruit')) {
					res.json({ name: "fruit", time: 0 })
					calories += 5
					food.push('water')
				}
				else if (results.includes('Snack')) {
					res.json({ name: "junk food item", time: 6 })
					time = 180
					food.push('popcorn')
					calories += 180
				}
				else
					res.status(500).send()
				// res.json({labels: results[0].labelAnnotations})
			}, err => {
				res.status(500).send()
				console.error('ERROR:', err)
			})
			.catch(err => {
				res.status(500).send()
				console.error('ERROR:', err)
			})
	});

})
app.post('/cc', (req, res) => {
	req.body.expiry = req.body.expiry.split(' ').join('').split('/')
	let obj = {
		"createTransactionRequest": {
			"merchantAuthentication": {
				"name": "7cDbRu4c55RZ",
				"transactionKey": "6V465kPnbJ36YW9W"
			},
			"transactionRequest": {
				"transactionType": "authCaptureTransaction",
				"amount": req.body.cash,
				"payment": {
					"creditCard": {
						"cardNumber": req.body.number.split(' ').join(''),
						"expirationDate": '20' + req.body.expiry[1] + '-' + req.body.expiry[0],
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
		lock = true
		setTimeout(function () { unlock = true }, time * 1000 + 5000)
		// else
		//     res.status(500).send()
	})
})

app.listen(8080, "0.0.0.0", function () {
	console.log("app is running on port 8080")
})
