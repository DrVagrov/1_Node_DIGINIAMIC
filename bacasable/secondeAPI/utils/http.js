const sendJson = (res, status, payload) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  if (payload === undefined) {
    res.end();
    return;
  }
  res.end(JSON.stringify(payload));
};

const notFound = (res) => sendJson(res, 404, { error: 'Not found' });

const parseBody = (req) =>
  new Promise((resolve, reject) => {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk.toString();
    });

    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });

    req.on('error', reject);
  });

module.exports = {
  sendJson,
  notFound,
  parseBody,
};

