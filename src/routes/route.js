const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const {authenticate,authorise,} = require("../middleware/middleware")



router.post("/authors", authorController.createAuthor)

router.post("/blogs", authenticate,blogController.createBlog)

router.get("/blogs", authenticate, blogController.getBlogs)

router.put("/blogs/:blogId",authenticate,authorise, blogController.updateBlog)

router.post("/login", authorController.loginAuthor)

router.delete("/blogs/:blogId",authenticate,authorise, blogController.deleteBlogByPath)

router.delete("/blogs",authenticate,blogController.deleteBlogByQuery)


module.exports = router;