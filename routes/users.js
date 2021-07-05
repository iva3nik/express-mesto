const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateDataUser,
  updateAvatarUser,
  getInfoAboutUser,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getInfoAboutUser);

router.patch('/me', updateDataUser);

router.patch('/me/avatar', updateAvatarUser);

router.get('/:userId', getUserById);

module.exports = router;
