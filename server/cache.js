function cache(expires = 300000) {

  const content = {};

  return function(url, data) {

    const now = Date.now();

    if(data === undefined) {

      const cachedData = content[url];

      if(cachedData && (now - cachedData.accessedTime) < expires) {
        return cachedData;
      } else return null;

    } else {

      data.accessedTime = now;
      content[url] = data;
      return data;

    }

  }

}

module.exports = cache;