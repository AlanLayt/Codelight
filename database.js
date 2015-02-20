var http = require("http");
var url = require("url");
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var mdb=null;
var db=null;
var connection = {
  address : 'localhost',
  port : 27017,
  database : 'codeucation'
}
 

// Initializes connection to database or runs failure callback
function connect(connected, failed) {
	var mongourl = 'mongodb://'+connection.address+':'+connection.port+'/'+connection.database;
	var connected = connected;
	var mdbt;

	MongoClient.connect(mongourl, function(err, mdb) {
    if(err!= null && err.name=="MongoError")
      failed(err,connection);
    else {
      // Sets module mdb to database object
      db = mdb;
      connected(db,connection);
      return true;
    }

	});

  return false;
}







var addSnippet = function(title, content, callback) {
  var collection = db.collection('code');

  collection.insert([
    {"title" : title, "content" : content}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    assert.equal(1, result.ops.length);
    callback(result, title);
  });
}


var getSnippet = function(title, callback) {
  var collection = db.collection('code');

  collection.find({ "title" : title }).toArray(function(err, snippet) {
    assert.equal(err, null);
    callback(snippet);
  });
}

var getAllSnippets = function(callback) {
  var collection = db.collection('code');

  collection.find().toArray(function(err, snippet) {
    assert.equal(err, null);
    callback(snippet);
  });
}

var updateSnippet = function(title, content, callback) {
	var collection = db.collection('code');
  var title = title;

	collection.update(
    { "title" : title },
    {$set: {"content" : content }},
    {},
		function(err){
  		callback(err,content,title);
  	}
  );
}














function returnRecords(recordsFound) {
    return findDocuments(db, function(docs) {
        recordsFound(docs);
      return docs;
    });
}


var addUser = function(username, password, callback) {
  var collection = db.collection('users');

  collection.insert([
    {"username" : username, "password" : password}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    assert.equal(1, result.ops.length);
    console.log('DATABASE: User ' + username + ' added.');
    callback(result, username);
  });
}


var getUser = function(username, callback) {
  var collection = db.collection('users');
  collection.find({ "username" : username }).toArray(function(err, user) {
    assert.equal(err, null);
    //assert.equal(1, docs.length);
    //console.log('DATABASE: user ' + user + ' returned.');
    callback(user);
  });
}








var clearCol = function(col) {
  db.collection(col,function(err, collection){
      collection.remove({},function(err, removed){
      });
  });
}


exports.addSnippet = addSnippet;
exports.getSnippet = getSnippet;
exports.updateSnippet = updateSnippet;
exports.getAllSnippets = getAllSnippets;

exports.getUser = getUser;
exports.addUser = addUser;

exports.returnRecords = returnRecords;
exports.connect = connect;


exports.clearCol = clearCol;






var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    //assert.equal(2, docs.length);
    console.log("DATABASE: Records returned.");
  //  console.dir(docs)
    callback(docs);
  });
}


var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insert([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 document into the document collection");
    callback(result);
  });
}

















var updateDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.update({ a : 2 }
    , { $set: { b : 1 } }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the document with the field a equal to 2");
    callback(result);
  });
}

var removeDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.remove({ a : 3 }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });
}
