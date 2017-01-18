var mongodb = require('mongodb');
var csv = require('csv-parser');
var fs = require('fs');

var MongoClient = mongodb.MongoClient;
var mongoUrl = 'mongodb://localhost:27017/911-calls';

var insertCalls = function(db, callback) {
    var collection = db.collection('calls');

    var calls = [];
    fs.createReadStream('../911.csv')
        .pipe(csv())
        .on('data', data => {
            var [category, title] = data.title.split(': ');
            var call = {
              latitude: data.lat,
              longitude: data.lng,
              location : { type: "Point", coordinates:
                [ parseFloat(data.lng), parseFloat(data.lat) ] },
              description: data.desc,
              zip: data.zip,
              category: category,
              title: title,
              district: data.twp,
              address: data.addr,
              timestamp: new Date(data.timeStamp)
            };
            calls.push(call);
        })
        .on('end', () => {
          collection.insertMany(calls, (err, result) => {
            callback(result)
          });
        });
}

MongoClient.connect(mongoUrl, (err, db) => {
    insertCalls(db, result => {
        console.log(`${result.insertedCount} calls inserted`);
        db.close();
    });
});
