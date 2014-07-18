var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://admin:admin@ds061208.mongolab.com:61208/demo", function(err,db){
	if(err) throw err;

//	findUser();
//	insertDoc();
	showResult();

	function findUser(){
		db.collection("system.users").findOne(function(err, doc){
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
