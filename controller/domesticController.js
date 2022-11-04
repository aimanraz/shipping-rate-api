const fs = require('fs');

// Connect with temp database
// TODO: Connect with RDBMS later

const fromDB = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/saved-data.json`, 'utf-8')
);

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
  const options = {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  };
  const getRate = async () => {
    try {
      const response = await fetch(
        'https://www.citylinkexpress.com/wp-json/wp/v2/getShippingRate',
        options
      );
      const data = await response.json();
      console.log(data);
      req.requestedData = data;
      return 'Successfully requested!';
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
  (async () => {
    try {
      const requested = await getRate();
      if (!req.requestedData) {
        return res.status(404).json({
          status: 'fail',
          result: 'there is no data in database',
        });
      }
      console.log(requested);
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
  instruc
    ? console.log('Middleware do nothing')
    : console.log('Middleware working');
  next();
};
