const Card = require('../models/card');
const {
  ERROR_CODE_INCORRET_DATA,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT_MISTAKE,
} = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch(() => {
      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createNewCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRET_DATA).send({ message: 'Переданы некорректиные данные при создании карточки' });
      }

      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена' });
      }

      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.putLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRET_DATA).send({ message: 'Переданы некорректиные данные для постановки лайка' });
      }

      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteLikeCard = (req, res) => {
  Card.findOneAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRET_DATA).send({ message: 'Переданы некорректиные данные для снятия лайка' });
      }

      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'На сервере произошла ошибка' });
    });
};
