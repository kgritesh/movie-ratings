function findTitles() {
  console.log('Finding Titles', $('h3.title').length);
  $('h3.title').each((index, elem) => {
    console.log("Title", elem.innerText);
  });
}
findTitles();
chrome.runtime.onMessage.addListener((req, sender, sendRespone) => {
  console.log("New Message", req);
  if (req.type === 'loadMovies') {
    findTitles();
  }
});
