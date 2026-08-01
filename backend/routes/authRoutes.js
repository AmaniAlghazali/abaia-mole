const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');
const { registerUser, loginUser, getMe, getAllUsers, updateUser, deleteUser, forgotPassword, resetPassword, updateProfile } = require('../controllers/authController');
const { verifyAdmin, verifyToken } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', verifyToken, getMe);
router.get('/users', verifyAdmin, getAllUsers);
router.put('/users/:id', verifyAdmin, updateUser);
router.delete('/users/:id', verifyAdmin, deleteUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/profile', verifyToken, updateProfile);

// OAuth callback helper — signs JWT and redirects to frontend
function oauthSuccess(req, res) {
    const user = req.user;
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
    const userData = encodeURIComponent(JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role, profile_pic: user.profile_pic }));
    const frontend = process.env.FRONTEND_URL || 'http://localhost:3001';
    res.redirect(`${frontend}/oauth-callback?token=${token}&user=${userData}`);
}

// Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/login?error=oauth` }), oauthSuccess);

// GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/login?error=oauth` }), oauthSuccess);

module.exports = router;
