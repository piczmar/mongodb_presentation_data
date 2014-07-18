//https://www.youtube.com/watch?feature=player_embedded&v=vpbs3SEgmvE

var MongoClient = require("mongodb").MongoClient;
var ReadPreference = require("mongodb").ReadPreference;

MongoClient.connect("mongodb://127.0.0.1:27017,"+
					"127.0.0.1:27018,"+
					"127.0.0.1:27019/test?readPreference=secondary", function(err,db){
	if(err) throw err;

	db.collection('repl').insert({x: 1},  function(err,doc){
		if(err) throw err;
		console.log("* " + JSON.stringify(doc));	
	})	

	function findDoc(){
		db.collection("repl").findOne({x: 1}, {'readPreference': ReadPreference.PRIMARY},
			function(err, doc){
				if(err) throw err;
				console.log(doc);
	
			});
		console.log("dispatched find");
		setTimeout(findDoc,1000);
	}
	findDoc();
});
