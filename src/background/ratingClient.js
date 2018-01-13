const RatingItem = require('../ratingItem');
const ratingStore = require('./ratingStore');
const config = require('../config');
const OmdbClient = require('./omdb');

module.exports = {

  omdbClient: new OmdbClient(config.omdbApiKey, timeout=config.omdbApiTimeout),

  async get(type, title) {
    const key = `${title}:${type}`;
    try {
      const ratingItem = await ratingStore.get(key);
      if(ratingItem) {
        console.log('found in store', key)
        return ratingItem;
      } else {
        console.log('Not found in store', key);
      }
    } catch(error) {
      console.error("Unable to fetch rating from the store", error);
    }
    return await this.fetch(type, title);
  },

  fetch(type, title) {
    return this.omdbClient.search(title, type)
      .then((results) => {
        if (results.length > 0) {
          return this._getById(results[0].imdbID)
            .then(res => {
                if (res) {
                  ratingStore.save(res);
                }
                return res;
            });
        }
        return null;
      })
  },

  _getById(id) {
    console.log('Fetching Result by id', id);
    return this.omdbClient.getById(id)
      .then(omdbRating => {
        if (omdbRating) {
          return new RatingItem(omdbRating);
        } else {
          return null;
        }
      });
  }
}