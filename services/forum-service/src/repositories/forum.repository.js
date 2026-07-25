'use strict';

const ForumPost = require('../models/ForumPost.model');
const Comment = require('../models/Comment.model');
const paginate = require('../utils/paginate');

class ForumRepository {
  async createPost(data) { return ForumPost.create(data); }
  async findPostById(id) { return ForumPost.findById(id); }
  async findPosts(filter = {}, options = {}) { return paginate(ForumPost, filter, options); }
  async addUpvote(postId, userId) { return ForumPost.findByIdAndUpdate(postId, { $addToSet: { upvotes: userId } }, { new: true }); }
  async removeUpvote(postId, userId) { return ForumPost.findByIdAndUpdate(postId, { $pull: { upvotes: userId } }, { new: true }); }

  async createComment(data) { return Comment.create(data); }
  async findCommentsByPost(postId) { return Comment.find({ postId }).sort({ createdAt: 1 }); }
}

module.exports = new ForumRepository();
