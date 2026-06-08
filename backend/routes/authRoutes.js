const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getAllUsers, updateUser, deleteUser } = require('../controllers/authController');
const { verifyAdmin, verifyToken } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', verifyToken, getMe);
router.get('/users', verifyAdmin, getAllUsers);
router.put('/users/:id', verifyAdmin, updateUser);
router.delete('/users/:id', verifyAdmin, deleteUser);

module.exports = router;
