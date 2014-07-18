var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://127.0.0.1:27017,"+
					"127.0.0.1:27018,"+
					"127.0.0.1:27019/test", function(err,db){
	if(err) throw err;

	findPeople();
//	insertDoc();
//	showResult();

	function findPeople(){
		console.dir("Show people");
		db.collection("people").findOne(function(err, doc){
			if(err) throw err;
			console.dir(doc);

			db.close();
		});
	}

	function insertDoc(){
		var doc = {title: "Example", body: "some text", num: 100};

		db.collection("docs").insert(doc, insertCallback);

		function insertCallback(err, inserted){
			if(err) throw err;
	
			console.dir("Inserted : "+JSON.stringify(doc));

			db.close();
		}
	}

	function showResult(){

		var cursor = db.collection("docs").find()

		cursor.skip(1);
		cursor.limit(4);
		cursor.sort('title',1);

		cursor.each(function(err, doc){
			if(err) throw err;

			if(doc == null){
				return db.close();
			}

			console.dir(doc);
		});
	}

});
