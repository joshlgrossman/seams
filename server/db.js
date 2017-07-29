const { MongoClient } = require('mongodb');

function findOrCreate(connection, name, cb) {

  connection.collection(name, {strict: true}, (err, collection) => {
    if(err || !collection) {
      connection.createCollection(name, (err, collection) => {
        if(err || !collection) cb(`Could not find or create collection ${name}`, null);
        else cb(null, collection);
      });
    } else cb(null, collection);
  });

}

function db(uri) {

  return MongoClient.connect(uri).then(connection => {

    return new Promise((resolve, reject) => {
      let count = 0;
      function bothResolved() {
        if(count++) resolve();
      }

      findOrCreate(connection, 'contents', (err, contents) => {
        if(err) return reject(err);
        db.contents = contents
        bothResolved();
      });

      findOrCreate(connection, 'users', (err, users) => {
        if(err) return reject(err);
        db.users = users;
        bothResolved();
      });

    });

  });

}

module.exports = db;