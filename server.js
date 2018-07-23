require('dotenv').config();
require('./db/mongoose');

const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');

const app = express();
app.use(bodyParser.json());
app.use('/users', userRouter);

const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = app;
