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
  // const requestRate = req.body;
  // console.log(`Post captured: ${requestRate}`);
  res.status(201).json({
    status: 'success',
    request: {
      data: req.body,
    },
  });
};

exports.refactorInput = (req, res, next) => {
  const requestRate = req.body;
  console.log(
    `Middleware will refactor: ${JSON.stringify(requestRate, null, 2)}`
  );
  next();
};
