const base = process.env.fetchURL || 'https://musicafe.co/api/';

const searchsong = (vendor, key, limit, page) => {
  return new Promise((resolve, reject) => {
    fetch(`${base}search/song/${vendor}?key=${key}&limit=${limit}&page=${page}`)
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err))
  });
}

const searchalbum = (vendor, key, limit, page) => {
  return new Promise((resolve, reject) => {
    fetch(`${base}search/album/${vendor}?key=${key}&limit=${limit}&page=${page}`)
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err))
  });
}

const searchplaylist = (vendor, key, limit, page) => {
  return new Promise((resolve, reject) => {
    fetch(`${base}search/playlist/${vendor}?key=${key}&limit=${limit}&page=${page}`)
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err))
  });
}

const getsong = (vendor, id) => {
  return new Promise((resolve, reject) => {
    fetch(`${base}get/song/${vendor}?id=${id}`)
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err))
  });
}

const getalbum = (vendor, id) => {
  return new Promise((resolve, reject) => {
    fetch(`${base}get/album/${vendor}?id=${id}`)
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err))
  });
}

const getplaylist = (vendor, id) => {
  return new Promise((resolve, reject) => {
    fetch(`${base}get/playlist/${vendor}?id=${id}`)
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err))
  });
}

module.exports = {
  searchsong,
  searchalbum,
  searchplaylist,
  getsong,
  getalbum,
  getplaylist,
}
