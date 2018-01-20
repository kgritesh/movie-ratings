
class RatingItem {

  constructor(type, title, imdbId = null, ratings = {}) {
    this.title = title;
    this.type = type;
    this.ratings = {
      imdb: ratings.imdb || null,
      metacritic: ratings.metacritic || null,
      rottenTomatoes: ratings.rottenTomatoes || null
    };
    this.url = imdbId ? `https://www.imdb.com/title/${imdbId}` : null;
  }

  get key() {
    return `${this.title}:${this.type}`;
  }

  toObj() {
    return {
      title: this.title,
      type: this.type,
      ratings: this.ratings,
      url: this.url
    };
  }

}

module.exports = RatingItem;