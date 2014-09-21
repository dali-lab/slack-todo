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


function listForUser(user, res){

	
	var query = new Parse.Query("ListItem");
	query.equalTo("username", user);
	query.ascending("createdAt");
	
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
		if(results.length == 0){
			res.send('[empty]');
		}
		else{
		res.send(list);
		}
		// res.send(list);	
	  },
	  error: function(error) {
		  res.send(error);
		// res.send(error);
	    // error is an instance of Parse.Error.
	  }
	});
}


function deleteListForUser(user){

	var query = new Parse.Query("ListItem");
	query.equalTo("username", user);
	query.ascending("createdAt");
	
	// query.include("message");
	query.find({
	  success: function(results) {
	    // results is an array of Parse.Object.
		for (i = 0; i < results.length; i++) {
			results[i].destroy();
		}

		// res.send(list);	
	  },
	  error: function(error) {

		// res.send(error);
	    // error is an instance of Parse.Error.
	  }
	});
}

function deleteItemFromList(user, index){

	var query = new Parse.Query("ListItem");
	query.equalTo("username", user);
	query.ascending("createdAt");
	
	// query.include("message");
	query.find({
	  success: function(results) {
	    // results is an array of Parse.Object.		
		results[index].destroy();

		// res.send(list);	
	  },
	  error: function(error) {

		// res.send(error);
	    // error is an instance of Parse.Error.
	  }
	});
}


app.post('/', function(req,res){
		
	var user = req.body.user_id;
	var text = req.body.text;


	var words = text.split(" ");
	var firstInt = parseInt(words[0]);
	var itemIsDone = (words.length ==1 && firstInt > 0);
	// res.send(""+// firstInt);

	if(itemIsDone) {		
		
		deleteItemFromList(user,firstInt);
		listForUser(user, res);
		// res.send(""+firstInt);	
	}
	else if( text =='help') {		
		res.send('not implemented');	
	}
	else if(text =='what' || text == '') {	
		
	
		setTimeout(listForUser(user, res), 3000);
	
		
			
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
		deleteListForUser(user);
		listForUser(user,res);
	}
	else{
 		//add a new list item with the message and username of the current command
		var ListItem = Parse.Object.extend("ListItem");
		var listItem = new ListItem();
		listItem.save({
		    username: user,
		    message: text
		  });
		listForUser(user,res);	
	}
	
});