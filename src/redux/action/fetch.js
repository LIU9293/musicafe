const base = process.env.fetchURL || 'https://musicafe.co/';

const searchSong = (vendor, key, limit, page) => {
  return new Promise((resolve, reject) => {
    fetch(`${base}search/song/${vendor}?key=${key}&limit=${limit}&page=${page}`)
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err))
  });
}

const searchAlbum = (vendor, key, limit, page) => {
  return new Promise((resolve, reject) => {
    fetch(`${base}search/album/${vendor}?key=${key}&limit=${limit}&page=${page}`)
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err))
  });
}

const searchPlaylist = (vendor, key, limit, page) => {
  return new Promise((resolve, reject) => {
    fetch(`${base}search/playlist/${vendor}?key=${key}&limit=${limit}&page=${page}`)
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err))
  });
}

const getSong = (vendor, id) => {
  return new Promise((resolve, reject) => {
    fetch(`${base}get/song/${vendor}?id=${id}`)
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err))
  });
}

const getAlbum = (vendor, id) => {
  return new Promise((resolve, reject) => {
    fetch(`${base}get/song/${vendor}?id=${id}`)
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err))
  });
}

const getPlaylist = (vendor, id) => {
  return new Promise((resolve, reject) => {
    fetch(`${base}get/song/${vendor}?id=${id}`)
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err))
  });
}

module.exports = {
  searchSong,
  searchAlbum,
  searchPlaylist,
  getSong,
  getAlbum,
  getPlaylist,
}
