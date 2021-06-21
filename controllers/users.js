const User = require('../models/user');
const {
  ERROR_CODE_INCORRET_DATA,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT_MISTAKE,
} = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch(() => {
      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      }

      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createNewUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRET_DATA).send({ message: 'Переданы некорректиные данные при создании пользователя' });
      }

      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateDataUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRET_DATA).send({ message: 'Переданы некорректиные данные при обновлении профиля' });
      }

      if (err === 'CastError') {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      }

      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateAvatarUser = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRET_DATA).send({ message: 'Переданы некорректиные данные при обновлении аватара' });
      }

      if (err === 'CastError') {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      }

      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'На сервере произошла ошибка' });
    });
};
