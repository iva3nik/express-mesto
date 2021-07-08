const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { ValidationLinkMethod } = require('../utils/constants');

const {
  getCards,
  createNewCard,
  deleteCardById,
  putLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(ValidationLinkMethod),
  }),
}),
createNewCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), deleteCardById);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), putLikeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), deleteLikeCard);

module.exports = router;
