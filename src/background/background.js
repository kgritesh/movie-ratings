var isProcessing = false;
function onMovieLoaded(details) {
  console.log("On Movie Loaded", details);
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: "loadMovies"
    });
  });
}

chrome.webRequest.onCompleted.addListener(
  onMovieLoaded, {
    urls: ['http://hotstar-sin.gravityrd-services.com/*'],
    types: ["script", "xmlhttprequest", "other"]
  }
)