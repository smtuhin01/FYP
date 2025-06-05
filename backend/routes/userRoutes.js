const router = require('express').Router();
const { createUser, getUsers, updateUser, deleteUser } = require('../controllers/userController');

router.post('/', createUser);
router.get('/', getUsers);
router.put('/:role/:id', updateUser);
router.delete('/:role/:id', deleteUser);
module.exports = router;