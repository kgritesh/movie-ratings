const logger = require('js-logger');

const utils = require('./utils');
const config = require('../config');
const ratingStore = require('./ratingStore');

module.exports = {
  save(ratingItem) {
    return new Promise((resolve, reject) => {
      const obj = Object.assign({}, ratingItem.toObj(), {
        createdAt: new Date().toUTCString()
      });
      ratingStore.save(obj);
      chrome.storage.local.set({
        [ratingItem.key]: obj
      });
    }, () => {
      let err = chrome.runtime.lastError;
      if (err) {
          reject(err);
      } else {
        resolve();
      }
    });
  },

  _getFromStore(key, resolve, reject) {
    ratingStore.get(key).then(resolve).catch(reject);
  },

  get(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, (items) => {
        let err = chrome.runtime.lastError;
        if (err) {
            console.error('Failed to find from chorme storage', err);
            return this._getFromStore(key, resolve, reject);
        } else if (items && items[key]) {
            const createdAt = new Date(items[key].createdAt);
            if (utils.daysBetween(createdAt, new Date()) >= config.cacheExpiry) {
              logger.debug('Key expired', key, createdAt);
              this.remove(key);
              resolve(null);
            } else {
              resolve(items[key]);
            }
        } else {
          return this._getFromStore(key, resolve, reject);
        }
      });
    });
  },

  remove(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.remove(key, () => {
        let err = chrome.runtime.lastError;
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },

  clear() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.clear(() => {
        let err = chrome.runtime.lastError;
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
};