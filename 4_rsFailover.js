//https://www.youtube.com/watch?feature=player_embedded&v=15jBQRolLV4
/*
when failover occurs the driver buffers pending operations until the election of new master finish
*/
var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://127.0.0.1:27017,"+
					"127.0.0.1:27018,"+
					"127.0.0.1:27019/test", function(err,db){
	if(err) throw err;

	var docNumber = 0;

	function insertDoc(){
		db.collection('repl').insert({docNumber: docNumber++}, function(err, doc){
			if(err) throw err;
			console.log(doc);
		});

		console.log("dispathed insert");
		setTimeout(insertDoc, 1000);
	}

	insertDoc();
});
