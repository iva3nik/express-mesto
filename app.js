const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {
  ERROR_CODE_NOT_FOUND,
} = require('./utils/constants');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '60cda4bc0416c67d5b93462c',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Нет такой страницы' });
});

app.listen(PORT);
