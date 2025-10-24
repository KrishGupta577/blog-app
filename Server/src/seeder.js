import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Post from './models/Post.js';
import Comment from './models/Comment.js';

dotenv.config();

connectDB();

const sampleUsers = [
  {
    username: 'admin',
    password: 'password123',
    role: 'Admin',
  },
  {
    username: 'writer',
    password: 'password123',
    role: 'Writer',
  },
  {
    username: 'reader',
    password: 'password123',
    role: 'Reader',
  },
];

const samplePosts = [
  {
    title: 'Welcome to the Blog!',
    content: 'This is the first post on our new platform. We are excited to have you here. This post is published.',
    tags: ['welcome', 'news'],
    status: 'published',
  },
  {
    title: 'A Guide to Node.js',
    content: 'Node.js is a powerful backend runtime. This post will explore its features.',
    tags: ['nodejs', 'tech', 'backend'],
    status: 'published',
  },
  {
    title: 'My First Draft',
    content: 'This is just a draft. It is not visible to readers yet. I am still working on it.',
    tags: ['draft', 'writing'],
    status: 'draft',
  },
];

const importData = async () => {
  try {
    await Post.deleteMany();
    await Comment.deleteMany();
    await User.deleteMany();

    console.log('Data cleared...');

    const createdUsers = await User.insertMany(sampleUsers);

    const adminUser = createdUsers.find(u => u.role === 'Admin');
    const writerUser = createdUsers.find(u => u.role === 'Writer');
    const readerUser = createdUsers.find(u => u.role === 'Reader');

    console.log('Users imported...');

    const postsWithAuthors = samplePosts.map((post, index) => {
      return {
        ...post,
        // Assign the first 2 posts to the writer, and the draft to the admin
        author: index < 2 ? writerUser._id : adminUser._id,
      };
    });

    const createdPosts = await Post.insertMany(postsWithAuthors);
    console.log('Posts imported...');

    const firstPost = createdPosts.find(p => p.status === 'published');

    const sampleComments = [
      {
        content: 'Great first post! Looking forward to more.',
        author: readerUser._id,
        post: firstPost._id,
      },
      {
        content: 'Well said. Node.js is fantastic.',
        author: adminUser._id,
        post: createdPosts[1]._id,
      },
    ];

    await Comment.insertMany(sampleComments);
    console.log('Comments imported...');

    console.log('Data Import Complete!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Post.deleteMany();
    await Comment.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else if (process.argv[2] === '-i') {
  importData();
} else {
  console.log('No flag provided. Use -i to import data or -d to destroy data.');
  process.exit();
}