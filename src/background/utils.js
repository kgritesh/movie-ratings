module.exports = {
  daysBetween(first, second) {
    // Taken from https://stackoverflow.com/a/10823681/911557
    var one = Date.UTC(first.getFullYear(), first.getMonth(), first.getDate());
    var two = Date.UTC(second.getFullYear(), second.getMonth(), second.getDate());

    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    var millisBetween = two - one;
    var days = millisBetween / millisecondsPerDay;
    return Math.floor(days);
  },

  queryParams(params) {
    const esc = encodeURIComponent;
    return Object.keys(params).map(
      k => k + '=' + params[k]
    ).join('&');
  }
}