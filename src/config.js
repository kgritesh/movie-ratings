const logger = require('js-logger');

module.exports = {
  omdbApiKey: process.env.OMDB_API_KEY || '3eeef7fa',
  omdbApiTimeout: process.env.OMDB_API_TIMEOUT || 30000, // 30 seconds
  firebase: {
    apiKey: "AIzaSyCzYosI2bfzRZy2eQvF9OSqTHTFfIRz4nM",
    authDomain: "movie-ratings-1e9f3.firebaseapp.com",
    projectId: "movie-ratings-1e9f3"
  },
  cacheExpiry: process.env.RATING_CACHE_EXPIRY || 7,
  storeExpiry: process.env.RATING_STORE_EXPIRY || 7,
  logLevel: process.env.NODE_ENV === 'development' ? logger.DEBUG : logger.ERROR
};