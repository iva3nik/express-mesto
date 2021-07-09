const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { ValidationLinkMethod } = require('../utils/constants');

const {
  getUsers,
  getUserById,
  updateDataUser,
  updateAvatarUser,
  getInfoAboutUser,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getInfoAboutUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateDataUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(ValidationLinkMethod),
  }),
}), updateAvatarUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUserById);

module.exports = router;
