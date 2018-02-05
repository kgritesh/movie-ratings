const logger = require('js-logger');

const db = require('./db');
const utils = require('./utils');
const config = require('../config');

module.exports = {
  save(obj) {
    return db.client().then(client =>
        client.collection('ratings').doc(obj.key).set(obj));
  },

  get(key) {
    return db.client().then(client =>
      client.collection('ratings').doc(key).get().then((doc) => {
        if(!doc.exists) {
          return null;
        }
        const ratingObj = doc.data();
        const createdAt = ratingObj.createdAt;
        if (utils.daysBetween(createdAt, new Date()) >= config.cacheExpiry) {
          logger.debug('Key expired', key, createdAt);
          this.remove(key);
          return null;
        } else {
          return ratingObj;
        }
      })
    );
  },

  remove(key) {
    return db.client().then(client =>
      client.collection('ratings').doc(key).delete());
  },

  clear() {
    return db.client().then(client =>
      client.collection('ratings').get().then((snapshot) => {
        snapshot.forEach(doc => doc.delete());
      })
    );
  }
};