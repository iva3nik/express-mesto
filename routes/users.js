const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateDataUser,
  updateAvatarUser,
  getInfoAboutUser,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUserById);

router.patch('/me', updateDataUser);

router.patch('/me/avatar', updateAvatarUser);

router.get('/me', getInfoAboutUser);

module.exports = router;
