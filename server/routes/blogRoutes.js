const router = require('express').Router();
const withAuth = require('../middleware/auth');
const blogController = require('../controllers/blogController');

router.get('/', blogController.getFeed);
router.get('/:id', blogController.getDetail);

router.post('/', withAuth, blogController.createBlog);
router.put('/:id', withAuth, blogController.updateBlog);
router.delete('/:id', withAuth, blogController.deleteBlog);

module.exports = router;
