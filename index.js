const express = require('express');
const app = express();
const port = 3333;
var path = require('path');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');

var dbConn = mongodb.MongoClient.connect('mongodb://localhost:27017');
app.set('view engine','ejs');
app.set('views','./views');

app.use('/',require('./routes'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'public')));

app.post('/post-feedback', function (req, res) {
    dbConn.then(function(db) {
        delete req.body._id; // for safety reasons
        db.collection('feedbacks').insertOne(req.body);
    });    
    res.send('Data received:\n' + JSON.stringify(req.body));
});

app.get('/view-feedbacks',  function(req, res) {
    dbConn.then(function(db) {
        db.collection('feedbacks').find({}).toArray().then(function(feedbacks) {
            res.status(200).json(feedbacks);
        });
    });
});




app.listen(port, function(err){
    if(err){
        console.log(`Error: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});