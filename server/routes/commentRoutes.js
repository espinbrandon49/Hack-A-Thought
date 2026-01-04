const router = require('express').Router();
const withAuth = require('../middleware/auth');
const commentController = require('../controllers/commentController');

router.post('/', withAuth, commentController.createComment);
router.delete('/:id', withAuth, commentController.deleteComment);

module.exports = router;
