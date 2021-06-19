const router = require('express').Router();

const {
  getCards,
  createNewCard,
  deleteCardById,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createNewCard);

router.delete('/:cardId', deleteCardById);

module.exports = router;
