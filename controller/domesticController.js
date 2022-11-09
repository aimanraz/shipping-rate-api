const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
// Connect with temp database
// TODO: Connect with RDBMS later

const fromDB = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/saved-data.json`, 'utf-8')
);

// Check db
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

// get rate from both APIs
exports.createAndSend = (req, res) => {
  (async () => {
    try {
      // const token = await getToken();
      // const jntBody = Object.assign({ _token: token }, req.jnt);
      const all = await Promise.all([
        getRateSky('https://www.skynet.com.my/index_handler?', req.skynet),
        await getRateCity(
          'https://www.citylinkexpress.com/wp-json/wp/v2/getShippingRate',
          req.citylink
        ),
      ]);
      // const data = await getRateJnt(
      //   'https://www.jtexpress.my/shipping-rates',
      //   jntBody
      // );
      // console.log(data);
      const data = all.map((el) => {
        if (typeof el === 'string') {
          return {
            courier: 'skynet',
            rate: parseInt(el),
          };
        }
        return {
          courier: 'citylink',
          rate: parseInt(el),
        };
      });
      // res.status(201).json({
      //   status: 'success',
      //   data: data,
      // });
      fromDB.push(data);
      fs.writeFile(
        `${__dirname}/../dev-data/data/saved-data.json`,
        JSON.stringify(fromDB, null, 2),
        () => {
          res.status(201).json({
            status: 'success',
            data: data,
          });
        }
      );
    } catch (err) {
      console.log(err);
    }
  })();
};

// refactor input for different rate calculator APIs
exports.refactorInput = (req, res, next) => {
  (async () => {
    try {
      req.citylink = req.body;
      const state = req.body.destination_state;
      const itemType = req.body.parcel_weight !== 0 ? 'parcel' : 'document';
      const regionSkynet =
        state === 'Sabah' || state === 'Sarawak'
          ? 'East Malaysia'
          : 'Peninsular Malaysia';
      req.skynet = {
        request_type: 'DomesticRates',
        state: state.toUpperCase(),
        item_type: itemType,
        weight: req.body.parcel_weight,
        postcode: req.body.destination_postcode,
        region: regionSkynet,
        page: 'rate',
      };
      // req.jnt = {
      //   shipping_rates_type: 'domestic',
      //   sender_postcode: req.body.origin_postcode,
      //   receiver_postcode: req.body.destination_postcode,
      //   destination_country: 'BWN',
      //   shipping_type: 'EZ',
      //   weight: req.body.parcel_weight,
      //   length: req.body.length,
      //   width: req.body.width,
      //   height: req.body.height,
      // };
    } catch (err) {
      console.log(err);
    }
  })();
  next();
};

// get shipping rate from citylink
const getRateCity = async (url, body) => {
  try {
    const options = {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    return data.req.data.rate;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// get shipping rate from skynet
const getRateSky = async (url, body) => {
  try {
    const params = new URLSearchParams(body).toString();
    const mergeUrl = url + params;
    const response = await fetch(mergeUrl);
    const htmlText = await response.text();

    const getDom = new JSDOM(htmlText);
    const getRateTag = new JSDOM(
      getDom.window.document.getElementsByTagName('tr')[3].cells[3].innerHTML
    );
    const getRate = getRateTag.window.document.querySelector('b').innerHTML;
    console.log(getRate);
    return getRate;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// const getRateJnt = async (url, body) => {
//   try {
//     console.log(body);
//     const params = new URLSearchParams(body);
//     const options = {
//       method: 'post',
//       body: params,
//     };
//     const response = await fetch(url, options);
//     const htmlText = await response.text();

//     // const getDom = new JSDOM(htmlText);
//     // const getRateTag = new JSDOM(
//     //   getDom.window.document.getElementsByTagName('tr')[3].cells[3].innerHTML
//     // );
//     // const getRate = getRateTag.window.document.querySelector('b').innerHTML;
//     // console.log(getRate);
//     // return getRate;
//     return htmlText;
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// };

// const getToken = async () => {
//   try {
//     const response = await fetch('https://www.jtexpress.my/shipping-rates');
//     const htmlBody = await response.text();
//     const dom = new JSDOM(htmlBody);
//     const token = dom.window.document.getElementsByName('_token')[0].value;
//     return token;
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// };
