require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  BLOG_ID: process.env.BLOG_ID || 'YOUR_BLOGGER_BLOG_ID',
  API_KEY: process.env.API_KEY || 'YOUR_GOOGLE_API_KEY',
};
