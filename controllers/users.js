const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const IncorrectDataError = require('../errors/incorrect-data-err');
const AuthentificationError = require('../errors/authentification-err');
const ConflictingRequestError = require('../errors/conflicting-request-err');
const NotFoundError = require('../errors/not-found-err');

const { JWT_SECRET } = require('../utils/constants');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.status(200).send({ token });
    })
    .catch(() => {
      next(new AuthentificationError('Неправильный email или password'));
    });
};

module.exports.getInfoAboutUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }

      return res.status(200).send({ user });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.message === 'Пользователь по указанному _id не найден') {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      } else if (err.name === 'CastError') {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
    })
    .catch(next);
};

module.exports.createNewUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  // eslint-disable-next-line no-console
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
        throw new IncorrectDataError('Переданы некорректные данные при создании пользователя');
      }

      if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictingRequestError('Пользователь с указанным email уже существует');
      }
    })
    .catch(next);
};

module.exports.updateDataUser = (req, res, next) => {
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
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.message === 'Пользователь по указанному _id не найден') {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      } else if (err.name === 'ValidationError') {
        throw new IncorrectDataError('Переданы некорректные данные при обновлении профиля');
      } else if (err.name === 'CastError') {
        throw new NotFoundError('Передан некоректный _id пользователя при обновлении профиля');
      }
    })
    .catch(next);
};

module.exports.updateAvatarUser = (req, res, next) => {
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
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.message === 'Пользователь по указанному _id не найден') {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      } else if (err.name === 'ValidationError') {
        throw new IncorrectDataError('Переданы некорректные данные при обновлении аватара');
      } else if (err.name === 'CastError') {
        throw new NotFoundError('Передан некоректный _id пользователя при обновлении аватара');
      }
    })
    .catch(next);
};
