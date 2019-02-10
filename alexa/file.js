var request = require('request')

var url = "http://c2b8a047.ngrok.io";

request.post(url+'/time', 
{
	json: { 
		time: 30 
	}
}, function(err, res, body){
	console.log(body)
})