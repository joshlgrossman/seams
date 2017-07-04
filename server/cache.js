const content = {};
const expireTime = 5000;

function cache(url, data) {

  const now = new Date();

  if(data === undefined) {

    const cachedData = content[url];

    if(cachedData && (now - cachedData.accessedTime) < expireTime) {
      cachedData.accessedTime = now;
      return cachedData;
    } else return null;

  } else {

    data.accessedTime = now;
    content[url] = data;
    return data;

  }

}

module.exports = cache;