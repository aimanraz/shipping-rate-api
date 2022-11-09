const app = require('./app');

// TODO: Database connection

const port = 3000;
app.listen(port, (res) => {
  console.log(`Listening to port ${port}`);
});
