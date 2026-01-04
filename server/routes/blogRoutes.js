const router = require('express').Router();
const withAuth = require('../middleware/auth');
const requireBlogOwner = require('../middleware/requireBlogOwner');
const blogController = require('../controllers/blogController');

router.get('/', blogController.getFeed);
router.get('/:id', blogController.getDetail);

router.post('/', withAuth, blogController.createBlog);

// Ownership enforced explicitly here:
router.put('/:id', withAuth, requireBlogOwner, blogController.updateBlog);
router.delete('/:id', withAuth, requireBlogOwner, blogController.deleteBlog);

module.exports = router;
