var elasticsearch = require('elasticsearch');
var csv = require('csv-parser');
var fs = require('fs');
var splitArray = require('split-array');

var esClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'error'
});

var calls = [];
fs.createReadStream('../911.csv')
    .pipe(csv())
    .on('data', data => {
      // extract one line from CSV
      var [category, title] = data.title.split(': ');
      var call = {
        latitude: data.lat,
        longitude: data.lng,
        location : { lon: parseFloat(data.lng), lat: parseFloat(data.lat) },
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
      // insert data to ES
      var chunks = splitArray(calls, 130000);
      chunks.forEach(chunk => {
        var esBody = [];
        chunk.forEach(c => {
          var index = {
            index: {
              _index: '911',
              _type: 'call'
            }
          };
          esBody.push(index);
          esBody.push(c);
        });
        esClient.bulk({
          body: esBody
        }, function (err, resp) {
          console.log(resp);
          console.log(`Error: ${err}`);
        });
      });
    });
