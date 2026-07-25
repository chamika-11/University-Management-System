'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/ForumController');
const authenticate = require('../middlewares/auth.middleware');

router.use(authenticate);

router.post('/posts', controller.createPost);
router.get('/posts',  controller.getPosts);
router.get('/posts/:id', controller.getPost);

router.post('/posts/:id/comments', controller.createComment);
router.get('/posts/:id/comments',  controller.getComments);
router.post('/posts/:id/upvote',   controller.upvote);

module.exports = router;
