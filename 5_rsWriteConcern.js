//https://www.youtube.com/watch?feature=player_embedded&v=15jBQRolLV4
/*
when failover occurs the driver buffers pending operations until the election of new master finish
*/
var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://127.0.0.1:27017,"+
					"127.0.0.1:27018,"+
					"127.0.0.1:27019/test?w=1", function(err,db){ // write concern
	if(err) throw err;

	var docNumber = 0;

	function insertDoc(){
		var d = {docNumber: docNumber++};
		db.collection('repl').insert(d, {'w': 2}, function(err, doc){ // write concern
			if(err) throw err;
			console.log(doc);
		});

		console.log("dispathed insert");
		setTimeout(insertDoc, 1000);
	}

	insertDoc();
});
