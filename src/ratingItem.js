
function ratingSourceMapper(source) {
  switch (source.toLowerCase().trim()) {
    case 'internet movie database':
      return 'imdb';
    case 'rotten tomatoes':
      return 'rottenTomatoes';
    case 'metacritic':
      return 'metacritic';
  }
  return 'imdb';
}

class RatingItem {

  constructor(omdbItem) {
    this.title = omdbItem.Title;
    this.type = omdbItem.Type;
    this.ratings = omdbItem.Ratings.reduce(
      (ratings, obj) => {
        const source = ratingSourceMapper(obj.Source);
        ratings[source] = obj.Value;
        return ratings;
      }, {});

    this.url = `https://www.imdb.com/title/${omdbItem.imdbID}`;
  }

  get key(){
    return `${this.title}:${this.type}`;
  }

  toObj() {
    return {
      title: this.title,
      type: this.type,
      ratings: this.ratings
    };
  }

}

module.exports = RatingItem;