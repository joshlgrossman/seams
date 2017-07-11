const db = require('./db');

function load(url) {
  return new Promise((resolve, reject) => {

    if(!db.connection) resolve({});
    else db.connection.findOne({url}, (err, doc) => {
      if(err) reject(err);
      else resolve(doc ? doc.content : {});
    });

  });
}

module.exports = load;