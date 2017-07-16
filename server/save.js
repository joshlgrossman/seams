const db = require('./db');
const alias = require('./alias');

function save(location, data) {
  const {url} = alias(location);
  const $set = {};
  for(const key in data) $set[`content.${key}`] = data[key];

  return new Promise((resolve, reject) => {

    if(!db.connection) resolve({});
    else db.connection.updateOne({url}, {$set}, (err, result) => {
      if(err) reject(err);
      else resolve(result ? result.result : {});
    });

  });

}

module.exports = save;