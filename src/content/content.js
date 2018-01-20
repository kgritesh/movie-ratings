
const ratings = {};
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
    if (!ratings[key]) {
      newTitles.push({
        type, title
      });
      ratings[key] = {
        found: false
      };
    } else if(ratings[key].found) {
      console.log('Adding Ratings to already found title', ratings[key].rating)
      addRatingToCard(ratings[key].rating);
    }
  });
  chrome.runtime.sendMessage({
    type: 'fetchRatings',
    payload: newTitles
  });
}

function addRatingToCard(rating) {
  const elems = $(`h3:contains('${rating.title}')`);
  console.log('Adding Rating to card for ', rating.title, elems.length);
  elems.each((index, elem) => {
    const card = $(elem).parents('.meta-description');
    if (card.find('span:contains("Imdb")').length > 0) {
      return;
    }
    card.css('height', '75px');
    const txt = `Imdb: ${rating.ratings.imdb ? rating.ratings.imdb : 'NA'}`;
    const ratingDiv = `<span class="subdetails ratings">${txt}</span>`;
    card.append(ratingDiv);
    const key = `${rating.title}:${rating.type}`;
    ratings[key] = {
      rating,
      found: true
    }
  });
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
