const express = require("express");

const auth = require("../middleware/authenticate");
const PostController = require("../controllers/posts");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", auth, extractFile, PostController.createPost);

router.put("/:id", auth, extractFile, PostController.updatePost);

router.get("", PostController.fetchAllPosts);

router.get("/:id", PostController.fetchPost);

router.delete("/:id", auth, PostController.deletePost);

module.exports = router;
