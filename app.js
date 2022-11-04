const express = require('express');
const app = express();
const fs = require('fs');
const morgan = require('morgan');
const domesticRouter = require('./routes/domesticRoutes');

// some basic middleware
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/shipping-rates', domesticRouter);

module.exports = app;
// async function postData() {
//   const response = await fetch(
//     'https://www.citylinkexpress.com/wp-json/wp/v2/getShippingRate',
//     {
//       method: 'post',
//       body: JSON.stringify(body),
//       headers: { 'Content-Type': 'application/json' },
//     }
//   );
//   const data = await response.json();
//   console.log(data);

//   fs.writeFileSync(
//     './dev-data/data/saved-data.json',
//     JSON.stringify(data, null, 4)
//   );
// }

// app.use((req, res, next) => {
//   req.requestedData = postData();
//   next();
// });

// const getRate = async () => {
//   try {
//     const cityLink = await fetch(
//       'https://www.citylinkexpress.com/wp-json/wp/v2/getShippingRate',
//       {
//         method: 'post',
//         body: JSON.stringify(body),
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
// const cityLink = await fetch(
//   'https://www.citylinkexpress.com/wp-json/wp/v2/getShippingRate',
//   {
//     method: 'post',
//     body: JSON.stringify(body),
//     headers: { 'Content-Type': 'application/json' },
//   }
// );
// const data = await response.json();

// const res1Pro = superagent.get(
//   `https://dog.ceo/api/breed/${data}/images/random`
// );
// const res2Pro = superagent.get(
//   `https://dog.ceo/api/breed/${data}/images/random`
// );
// const res3Pro = superagent.get(
//   `https://dog.ceo/api/breed/${data}/images/random`
// );

//     const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
//     const imgs = all.map((el) => el.body.message);

//     await writeFilePro('dog-img.txt', imgs.join('\n'));
//     console.log('Image saved to the file!');
//   } catch (err) {
//     console.log(err);

//     throw err;
//   }

//   return '2: The Image ready!';
// };
// // invoke the above function
