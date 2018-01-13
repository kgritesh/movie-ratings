
const seenTitles = {};
const RE_TYPE = new RegExp("www.hotstar.com/([^/]+)", "g");

function findType() {
  const res = RE_TYPE.exec(window.location.href);
  if (!res) {
    return null;
  }
  return res[1] === 'movies' ? 'movie' : 'series';
}

function checkIfMovieOrSeries(elem) {
  return $(elem).parents(".meta-description").find('.subdetails').length > 0;
}

function findTitles() {
  const type = findType();
  const newTitles = [];
  $('h3.title').each((index, elem) => {
    if (!checkIfMovieOrSeries(elem) || !type) {
      return;
    }
    const title = elem.innerText;
    const key = `${title}:${type}`;
    if (!seenTitles[key]) {
      newTitles.push({
        type, title
      });
      seenTitles[key] = true;
    }
  });
  chrome.runtime.sendMessage({
    type: 'fetchRatings',
    payload: newTitles
  });
}

function addRatingToCard(rating) {
  console.log('Adding Rating to card for ', rating.title);
  const elem = $(`h3:contains('${rating.title}')`)[0];
  const card = $(elem).parents('.meta-description');

  card.css('height', '75px');
  const txt = `Imdb: ${rating.ratings.imdb}`;
  const ratingDiv = `<span class="subdetails">Imdb: ${rating.ratings.imdb}</span>`;
  card.append(ratingDiv);
}

findTitles();
chrome.runtime.onMessage.addListener((req, sender, sendRespone) => {
  switch(req.type) {
    case 'loadMovies':
      findTitles();
      return;
    case 'ratings':
      console.log('Got Ratings for', req.payload);
      addRatingToCard(req.payload);
      return;
  }
  if (req.type === 'loadMovies') {
    findTitles();
  }

});
