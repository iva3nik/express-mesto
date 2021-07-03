const bcrypt = require('bcryptjs');
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
    .orFail(() => {
      res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Передан некоректный _id для получения пользователя' });
        return;
      }

      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createNewUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRET_DATA).send({ message: 'Переданы некорректиные данные при создании пользователя' });
        return;
      }

      if (err.name === 'MongoError' && err.code === 11000) {
        res.send({ message: 'Пользователь с указанным email уже существует' });
      }

      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateDataUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRET_DATA).send({ message: 'Переданы некорректиные данные при обновлении профиля' });
        return;
      }

      if (err.name === 'CastError') {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Передан некоректный _id пользователя при обновлении профиля' });
        return;
      }

      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateAvatarUser = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRET_DATA).send({ message: 'Переданы некорректиные данные при обновлении аватара' });
        return;
      }

      if (err.name === 'CastError') {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Передан некоректный _id пользователя при обновлении аватара' });
        return;
      }

      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'На сервере произошла ошибка' });
    });
};
