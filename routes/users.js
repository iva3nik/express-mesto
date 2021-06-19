const router = require('express').Router();

const {
  getUsers,
  getUserById,
  createNewUser,
  updateDataUser,
  updateAvatarUser,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUserById);

router.post('/', createNewUser);

router.patch('/me', updateDataUser);

router.patch('/me/avatar', updateAvatarUser);

module.exports = router;
