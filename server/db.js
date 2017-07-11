const { MongoClient } = require('mongodb');

function db(uri) {

  MongoClient.connect(uri).then(connection => {

    connection.collection('contents', (err, collection) => {
      db.connection = collection;
    });

  });

}

module.exports = db;