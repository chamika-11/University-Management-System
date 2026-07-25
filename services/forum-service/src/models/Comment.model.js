'use strict';

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId:      { type: mongoose.Schema.Types.ObjectId, ref: 'ForumPost', required: true, index: true },
  content:     { type: String, required: true },
  authorId:    { type: String, required: true },
  authorName:  { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
