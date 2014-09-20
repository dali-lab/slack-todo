var express = require('express')
var app = express();

//parse nonsense
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
		
	var user = req.body.user_id;
	var text = req.body.text;


	var words = text.split(" ");
	var firstInt = parseInt(words[0]);
	var itemIsDone = (words.length ==1 && firstInt >= 0);

	if(itemIsDone) {		
		res.send(firstInt);	
	}
	if( text =='help') {		
		res.send('not implemented');	
	}
	else if(text =='what' || text == '') {	
		
		var query = new Parse.Query("ListItem");
		query.equalTo("username", user);
		// query.include("message");
		query.find({
		  success: function(results) {
		    // results is an array of Parse.Object.
			var list = "";			
			for (i = 0; i < results.length; i++) {
				list += i;
				list += '. ';
				list += results[i].get("message");
				list += '\n';

			}
			res.send(list);	
			
		  },

		  error: function(error) {
  			res.send(error);	
			  
		    // error is an instance of Parse.Error.
		  }
		});
		
			
		// collection.comparator = function(object) {
		//   return object.get('createdAt');
		// };
		//
		// var list = "";
	
		
	}
	else if( text =='user') {		
		res.send(user);	
	}
	else if( text =='clear') {		
		res.send(user);	
	}
	else{
 		//add a new list item with the message and username of the current command
		var ListItem = Parse.Object.extend("ListItem");
		var listItem = new ListItem();
		listItem.save({
		    username: user,
		    message: text
		  });
		res.send('RAWR');	
	}
	
});