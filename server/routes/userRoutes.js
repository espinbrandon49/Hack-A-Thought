const router = require('express').Router();
const withAuth = require('../middleware/auth');
const authController = require('../controllers/authController');

router.post('/', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', withAuth, authController.me);

module.exports = router;
