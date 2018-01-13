const utils = require('./utils');

class OmdbClient {

  constructor(apiKey, timeout = null, apiVersion = 1, responseType = 'json') {
    this.apiKey = apiKey;
    this.timeout = timeout;
    this.apiVersion = 1;
    this.responseType = responseType;
    this.baseUrl = 'http://www.omdbapi.com/'
  }

  _parseHttpResponse(response) {
    return response.json().then((data) => {
      if (response.status !== 200) {
        throw new Error(data.Error);
      } else if (data.Response === 'False') {
        return null;
      }
      return data;
    });
  }

  getById(id) {
    const params = {
      apiKey: this.apiKey,
      i: id,
      apiVersion: this.apiVersion,
      r: this.responseType
    };

    const url = `${this.baseUrl}?${utils.queryParams(params)}`;
    return fetch(url).then((res) => {
      return this._parseHttpResponse(res).then((res) => {
        console.log('Fetch By Id Result', res);
        return res;
      });
    });
  }

  getByTitle(title, type=null, year=null, plot='short') {
    const params = {
      apiKey: this.apiKey,
      i: id,
      apiVersion: this.apiVersion,
      r: this.responseType
    };
    if (type) {
      params['type'] = type;
    }
    if (year) {
      params['y'] = 'year'
    }
    if (plot) {
      params['plot'] = plot;
    }
    const url = `${this.baseUrl}?${utils.queryParams(params)}`;
    return fetch(url).then(this._parseHttpResponse);
  }

  search(title, type=null, year=null, page=1) {
    const params = {
      apiKey: this.apiKey,
      s: title.replace(' ', '+'),
      apiVersion: this.apiVersion,
    };
    if (type) {
      params['type'] = type;
    }
    if (year) {
      params['y'] = 'year'
    }
    if (page) {
      params['page'] = page;
    }

    const url = `${this.baseUrl}?${utils.queryParams(params)}`;
    console.log('Search', url);
    return fetch(url)
      .then(this._parseHttpResponse)
      .then((data) => {
        console.log("Search Result", data);
        return data ? data['Search'] : [];
      });
  }
}

module.exports = OmdbClient;