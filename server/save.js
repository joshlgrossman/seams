const db = require('./db');
const alias = require('./alias');

function save(url, data) {
  const aliased = alias(url).url;
  const $set = {};
  for(const key in data) $set[`content.${key}`] = data[key];

  return new Promise((resolve, reject) => {

    if(!db.connection) resolve({});
    else db.connection.updateOne({url: aliased}, {$set}, (err, result) => {
      if(err) reject(err);
      else resolve(result ? result.result : {});
    });

  });

}

module.exports = save;