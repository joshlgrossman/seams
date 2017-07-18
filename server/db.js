const { MongoClient } = require('mongodb');

function db(uri) {

  MongoClient.connect(uri).then(connection => {

    connection.collection('contents', (err, collection) => {
      db.contents = collection;
    });

    connection.collection('users', (err, collection) => {
      db.users = collection;
    });

  });

}

module.exports = db;