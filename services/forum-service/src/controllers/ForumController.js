'use strict';

const service = require('../services/ForumService');
const forumRepo = require('../repositories/forum.repository');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

class ForumController {
  createPost = asyncHandler(async (req, res) => {
    const authorId = req.user.id;
    const authorName = req.user.email.split('@')[0];
    const post = await service.createPost({ ...req.body, authorId, authorName });
    res.status(201).json({ success: true, data: { post } });
  });

  getPosts = asyncHandler(async (req, res) => {
    const { page, limit, category } = req.query;
    const filter = category ? { category } : {};
    const result = await service.getPosts(filter, { page, limit });
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  });

  getPost = asyncHandler(async (req, res) => {
    const post = await forumRepo.findPostById(req.params.id);
    if (!post) throw AppError.notFound('Forum post');
    res.status(200).json({ success: true, data: { post } });
  });

  createComment = asyncHandler(async (req, res) => {
    const authorId = req.user.id;
    const authorName = req.user.email.split('@')[0];
    const comment = await service.addComment({ ...req.body, postId: req.params.id, authorId, authorName });
    res.status(201).json({ success: true, data: { comment } });
  });

  getComments = asyncHandler(async (req, res) => {
    const comments = await service.getComments(req.params.id);
    res.status(200).json({ success: true, data: { comments } });
  });

  upvote = asyncHandler(async (req, res) => {
    const post = await service.toggleUpvote(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: { post } });
  });
}

module.exports = new ForumController();
