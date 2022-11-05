const fs = require('fs');

// Connect with temp database
// TODO: Connect with RDBMS later

const fromDB = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/saved-data.json`, 'utf-8')
);
console.log();

exports.getAllRates = (req, res) => {
  if (!fromDB.length) {
    return res.status(404).json({
      status: 'fail',
      result: 'there is no data in database',
    });
  }
  res.status(200).json({
    status: 'success',
    result: fromDB.length,
    data: {
      fromDB,
    },
  });
};

exports.createAndSend = (req, res) => {
  const body = req.body;
  (async () => {
    try {
      const requested = await getRate(req, body);
      console.log(requested);
      if (!req.requestedData) {
        return res.status(404).json({
          status: 'fail',
          result: 'there is no data in database',
        });
      }
      fromDB.push(req.requestedData.req.data);
      res.status(201).json({
        status: 'success',
        request: req.requestedData.req,
      });
    } catch (err) {
      console.log(err);
    }
  })();
};

exports.refactorInput = (req, res, next) => {
  const requestRate = req.body;
  const instruc = false;
  console.log('Middleware working');
  next();
};

const getRate = async (req, body) => {
  try {
    const options = {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    };
    const response = await fetch(
      'https://www.citylinkexpress.com/wp-json/wp/v2/getShippingRate',
      options
    );
    const data = await response.json();
    req.requestedData = data;
    return 'Successfully requested!';
  } catch (err) {
    console.log(err);
    throw err;
  }
};
