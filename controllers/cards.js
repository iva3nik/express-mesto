const Card = require('../models/card');
const IncorrectDataError = require('../errors/incorrect-data-err');
const NotFoundError = require('../errors/not-found-err');
const AuthorizationError = require('../errors/authorization-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch(next);
};

module.exports.createNewCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new IncorrectDataError('Переданы некорректиные данные при создании карточки');
      }
    })
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка по указанному _id не найдена');
    })
    .then((card) => {
      if (String(card.owner) !== req.user._id) {
        throw new AuthorizationError('Нельзя удалить чужую карточку');
      }

      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.message === 'Карточка по указанному _id не найдена') {
        throw new NotFoundError('Карточка по указанному _id не найдена');
      } else if (err.name === 'CastError') {
        throw new NotFoundError('Передан некоректный _id для удаления карточки');
      }
    })
    .catch(next);
};

module.exports.putLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка по указанному _id не найдена');
    })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.message === 'Карточка по указанному _id не найдена') {
        throw new NotFoundError('Карточка по указанному _id не найдена');
      } else if (err.name === 'CastError') {
        throw new IncorrectDataError('Переданы некорректиные данные для постановки лайка');
      }
    })
    .catch(next);
};

module.exports.deleteLikeCard = (req, res, next) => {
  Card.findOneAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка по указанному _id не найдена');
    })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.message === 'Карточка по указанному _id не найдена') {
        throw new NotFoundError('Карточка по указанному _id не найдена');
      } else if (err.name === 'CastError') {
        throw new IncorrectDataError('Переданы некорректиные данные для снятия лайка');
      }
    })
    .catch(next);
};
