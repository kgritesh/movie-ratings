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
                return res;
              }
              return this._saveEmptyRating(type, title);
            });
        }
        return this._saveEmptyRating(type, title);
      })
  },

  _saveEmptyRating(type, title) {
    const item = new RatingItem(type, title);
    ratingStore.save(item);
    return item;
  },

  _ratingSourceMapper(source) {
    switch (source.toLowerCase().trim()) {
      case 'internet movie database':
        return 'imdb';
      case 'rotten tomatoes':
        return 'rottenTomatoes';
      case 'metacritic':
        return 'metacritic';
    }
    return 'imdb';
  },

  _getById(id) {
    console.log('Fetching Result by id', id);
    return this.omdbClient.getById(id)
      .then(omdbRating => {
        if (omdbRating) {
          const title =  omdbRating.Title;
          const type = omdbRating.Type;
          const imdbId = omdbRating.imdbID;
          const ratings = omdbRating.Ratings.reduce(
            (ratings, obj) => {
              const source = this._ratingSourceMapper(obj.Source);
              ratings[source] = obj.Value;
              return ratings;
          }, {});
          return new RatingItem(type, title, imdbId, ratings);
        }
        return null;
      });
  }
}