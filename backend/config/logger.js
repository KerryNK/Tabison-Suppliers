// backend/config/logger.js
const logger = {
  info: (...params) => {
    console.info(...params);
  },
  error: (...params) => {
    console.error(...params);
  },
};


export default logger;

// module.exports is not needed as you are using ES modules
// module.exports = logger;
