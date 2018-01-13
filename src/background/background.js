const ratingClient = require('./ratingClient');

function onMovieLoaded(details) {
  chrome.tabs.sendMessage(details.tabId, {
    type: "loadMovies"
  });
}

function handleMessages(request, sender, sendResponse) {
  switch (request.type) {
    case 'fetchRatings':
      fetchRatings(request);
      break;
  }
}

function fetchRatings(request, sender, sendResponse) {
  request.payload.map(item =>  {
    console.log("Fetching Rating for", item);
    ratingClient.get(item.type, item.title).then((rating) => {
      console.log('Fetched Rating for ', item, rating);
      chrome.tabs.sendMessage(sender.tab.id, {
        type: 'ratings',
        payload: rating
      });
    })
  });
}

chrome.webRequest.onCompleted.addListener(
  onMovieLoaded, {
    urls: ['http://hotstar-sin.gravityrd-services.com/*'],
    types: ["script", "xmlhttprequest", "other"]
  }
);

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    fetchRatings(request, sender, sendResponse);
  }
);

