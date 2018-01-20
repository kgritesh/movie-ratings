const utils = require('./utils');

module.exports = {
  DEFAULT_EXPIRY: process.env.STORE_EXPIRY || 7, // 1 Week

  save(ratingItem) {
    return new Promise((resolve, reject) => {
      const obj = ratingItem.toObj();
      chrome.storage.local.set({
        [ratingItem.key]: Object.assign({}, obj, {
          createdAt: new Date().toUTCString()
        })
      }, () => {
        let err = chrome.runtime.lastError;
        if (err) {
            reject(err);
        } else {
          resolve();
        }
      });
    });
  },

  get(key) {
    console.log('Finding key: ' + key);
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, (items) => {
        let err = chrome.runtime.lastError;
        if (err) {
            console.error('Failed to find from chorme storage', err);
            reject(err);
        } else if (items && items[key]) {
            const createdAt = new Date(items[key].createdAt);
            if (utils.daysBetween(createdAt, new Date()) >= this.DEFAULT_EXPIRY) {
              console.log('Key expired', key, createdAt);
              this.remove(key);
              resolve(null);
            } else {
              resolve(items[key]);
            }
        } else {
          resolve(null);
        }
      });
    });
  },

  remove(key) {
    return new Promise((resolve, reject) => {
      const key = this.getKey(type, title);
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