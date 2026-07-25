'use strict';

const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  content:     { type: String, required: true },
  authorId:    { type: String, required: true, index: true }, // userId
  authorName:  { type: String, required: true },
  category:    { type: String, enum: ['ANNOUNCEMENT', 'GENERAL', 'ACADEMIC', 'HELP'], default: 'GENERAL', index: true },
  upvotes:     [{ type: String }], // userIds of upvoters
  isPinned:    { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('ForumPost', forumPostSchema);
