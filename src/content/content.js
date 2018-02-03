
const titleMap = {};
const RE_TYPE = new RegExp("www.hotstar.com/([^/]+)");

function init() {
  findTitles();
  chrome.runtime.onMessage.addListener((req, sender, sendRespone) => {
    switch(req.type) {
      case 'loadMovies':
        findTitles();
        return;
      case 'ratings':
        addRatings(req.payload);
        return;
    }
  });

  setInterval(() => {
    findTitles();
  }, 20000);
};

function findType() {
  const res = RE_TYPE.exec(window.location.href);
  if (!res) {
    return null;
  }
  return res[1] === 'movies' ? 'movie' : 'series';
}

function checkIfMovieOrSeries(elem) {
  return $(elem).find('.subdetails').length > 0;
}

function findTitles() {
  const type = findType();
  const allCards = $('.meta-description');
  const newTitles = [];
  for (let i = 0; i < allCards.length; ++i) {
    const elem = allCards[i];
    const title = $(elem).find('h3.title').first().text().toLowerCase();
    if (!title || !checkIfMovieOrSeries(elem)) {
      continue;
    }
    const key = `${title}:${type}`;
    if (!titleMap[key]) {
      newTitles.push({
        type, title
      });
      titleMap[key] = {
        rating: null,
        type,
        title,
        cards: new Set([elem])
      };
    } else {
      const titleItem = titleMap[key];
      if (!titleItem.cards.has(elem)) {
        titleItem.cards.add(elem);
        if (titleItem.rating) {
          addRatingToCard(elem, titleItem.rating);
        }
      }
    }
  }
  chrome.runtime.sendMessage({
    type: 'fetchRatings',
    payload: newTitles
  });
}

function addRatings(rating) {
  const key = `${rating.title}:${rating.type}`;
  const titleItem = titleMap[key];
  titleItem.rating = rating;
  titleItem.cards.forEach(card => addRatingToCard(card, rating));
}''

function addRatingToCard(elem, rating) {
  const card = $(elem);
  card.css('height', '140px');
  const imdbUrl = chrome.extension.getURL('img/imdb.png');
  const rottenTomatoesUrl = chrome.extension.getURL('img/rottenTomatoes.png');
  const metacriticUrl = chrome.extension.getURL('img/metacritic.png');
  addRatingIcon(card, imdbUrl, rating.ratings.imdb || 'NA');
  addRatingIcon(card, rottenTomatoesUrl, rating.ratings.rottenTomatoes || 'NA');
  addRatingIcon(card, metacriticUrl, rating.ratings.rottenTomatoes || 'NA');
}

function addRatingIcon(container, url, value) {
  const tag = `
    <div>
      <img src="${url}" style="width: 32px !important; padding: 5px">
      <span class="subdetails ratings">${value}</span>
    </div>
  `;
  container.append(tag);
}

init();
