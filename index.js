var express = require('express')
var app = express();

var Parse = require('parse').Parse;

Parse.initialize(process.env.PARSE_APP_ID,process.env.PARSE_SECRET);

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded() ); // to support URL-encoded bodies

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))


app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})

app.post('/', function(req,res){
	
	var TestObject = Parse.Object.extend("Tester");
	var testObject = new TestObject();
	testObject.save({foo: "baretto"}).then(function(object) {
	  alert("yay! it worked");
	});
	
	
	var text = req.body.text;
	if( text =='help') {		
		res.send('/lights commands: on, off, random, very dim, dim, shady, bright, very bright, blue, green, orange, purple, normal, colors, sauron, party, pulse, pulses tv');	
	}
	else{
		res.send('RAWR');	
	}
	
});