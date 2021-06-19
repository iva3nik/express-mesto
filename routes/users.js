const router = require('express').Router();

const {
  getUsers,
  getUserById,
  createNewUser,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUserById);

router.post('/', createNewUser);

module.exports = router;
