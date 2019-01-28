var express = require('express');
var router = express.Router();
var path    = require("path");
var courses = require('./courses-list');
var mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var assert = require('assert');
var url = "mongodb://localhost:27017/test"
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("im in index.js");
  res.sendFile(path.join(__dirname,'index.html'));
});
var resultArray = [];
function getCourses(req, res, next) {
  mongo.connect(url, function(err, client){
    assert.equal(null, err);
    var db = client.db('test');
   
    var cursor = db.collection('courses').find();
    resultArray = [];
    cursor.forEach(function(doc, err){
      assert.equal(null, err);
      resultArray.push(doc);
    }, function(){
      console.log(resultArray);
      res.send(resultArray);
    })

  })
 
}
router.get('/courses', getCourses);
router.get('/course-detail/:id', function(req, res, next) {
  mongo.connect(url, function(err, client){
  	var db = client.db('test');
  	assert.equal(null, err);
  	
  	

console.log("MYID"+req.params.id)


  	db.collection("courses").findOne({"_id":ObjectId(req.params.id)}, function(err, result) {
   assert.equal(null, err);
   res.send(result);
   
  });
  	
  })
  
});
router.get('/deleteAll', function(req, res, next) {
  mongo.connect(url, function(err, client){
    var db = client.db('test');
    assert.equal(null, err);
    
    




    db.collection("courses").remove();
    res.send("deleted");
    
  })
  
});
router.post('/add-course', function(req, res, next) {
  
  var newCourse = {"courseName":req.body.courseName, "courseId":courses.length+1};
  
  mongo.connect(url, function(err, client){
  	var db = client.db('test');
  	assert.equal(null, err);
  	db.collection('courses').insertOne(newCourse, function(err, result){
  		assert.equal(null, err);
  		getCourses(req, res, next)
  	});
  	
  })
  
});
router.post('/delete-course', function(req, res, next) {

mongo.connect(url, function(err, client){
    var db = client.db('test');
    assert.equal(null, err);
    
    

console.log(req.body)


    db.collection("courses").deleteOne({"_id":ObjectId(req.body._id)},function(err, result) {
   assert.equal(null, err);
   
   getCourses(req, res, next)
   
  });
    
  })
  
});
router.post('/edit-course', function(req, res, next) {
var productToUpdate = {};
  productToUpdate = Object.assign(productToUpdate, req.body);
  delete productToUpdate._id;
mongo.connect(url, function(err, client){
  	var db = client.db('test');
  	assert.equal(null, err);
  	
  	

console.log(req.body)


  	db.collection("courses").findOneAndUpdate({"_id":ObjectId(req.body._id)}, {$set:productToUpdate},
        {returnOriginal: false},function(err, result) {
   assert.equal(null, err);
   
   res.send(result.value);
   
  });
  	
  })
  
});

module.exports = router;
