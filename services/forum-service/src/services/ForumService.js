'use strict';

const forumRepo = require('../repositories/forum.repository');
const publisher = require('../events/publisher');
const AppError = require('../utils/AppError');

class ForumService {
  async createPost({ title, content, authorId, authorName, category }) {
    const post = await forumRepo.createPost({ title, content, authorId, authorName, category });
    await publisher.publish('forum.events', {
      eventType: 'forum.post_created',
      payload: { postId: post._id.toString(), title, authorId, category },
    });
    return post;
  }

  async getPosts(filter = {}, options = {}) {
    return forumRepo.findPosts(filter, options);
  }

  async addComment({ postId, content, authorId, authorName }) {
    const post = await forumRepo.findPostById(postId);
    if (!post) throw AppError.notFound('Forum post');
    return forumRepo.createComment({ postId, content, authorId, authorName });
  }

  async getComments(postId) {
    return forumRepo.findCommentsByPost(postId);
  }

  async toggleUpvote(postId, userId) {
    const post = await forumRepo.findPostById(postId);
    if (!post) throw AppError.notFound('Forum post');

    if (post.upvotes.includes(userId)) {
      return forumRepo.removeUpvote(postId, userId);
    } else {
      return forumRepo.addUpvote(postId, userId);
    }
  }
}

module.exports = new ForumService();
