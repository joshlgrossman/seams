const db = require('./db');

function load(url) {
  return new Promise((resolve, reject) => {

    if(!db.contents) resolve({});
    else db.contents.findOne({url}, (err, doc) => {
      if(err) reject(err);
      else resolve(doc ? doc.content : {});
    });

  });
}

module.exports = load;