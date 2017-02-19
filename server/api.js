'use strict';
const express = require('express');
const router = express();
const MusicApi = require('music-api');

router.get('/search/song/:vendor', (req, res) => {
  let key = req.query.key,
      limit = req.query.limit,
      page = req.query.page,
      raw = req.query.raw;
  let vendor = req.params.vendor;
  MusicApi.searchSong(vendor, {
    key,
    limit,
    page,
    raw
  })
    .then(data => res.json(data))
    .catch(err => res.send(err));
});

router.get('/search/album/:vendor', (req, res) => {
  let key = req.query.key,
      limit = req.query.limit,
      page = req.query.page,
      raw = req.query.raw;
  let vendor = req.params.vendor;
  MusicApi.searchAlbum(vendor, {
    key,
    limit,
    page,
    raw
  })
    .then(data => res.json(data))
    .catch(err => res.send(err));
});

router.get('/search/playlist/:vendor', (req, res) => {
  let key = req.query.key,
      limit = req.query.limit,
      page = req.query.page,
      raw = req.query.raw;
  let vendor = req.params.vendor;
  MusicApi.searchPlaylist(vendor, {
    key,
    limit,
    page,
    raw
  })
    .then(data => res.json(data))
    .catch(err => res.send(err));
});

router.get('/get/song/:vendor', (req, res) => {
  let id = req.query.id,
      raw = req.query.raw;
  let vendor = req.params.vendor;
  MusicApi.getSong(vendor, {
    id,
    raw
  })
    .then(data => res.json(data))
    .catch(err => res.send(err));
});

router.get('/get/album/:vendor', (req, res) => {
  let id = req.query.id,
      raw = req.query.raw;
  let vendor = req.params.vendor;
  MusicApi.getAlbum(vendor, {
    id,
    raw
  })
    .then(data => res.json(data))
    .catch(err => res.send(err));
});

router.get('/get/playlist/:vendor', (req, res) => {
  let id = req.query.id,
      raw = req.query.raw;
  let vendor = req.params.vendor;
  MusicApi.getPlaylist(vendor, {
    id,
    raw
  })
    .then(data => res.json(data))
    .catch(err => res.send(err));
});

router.get('/search/suggestion/:key', (req, res) => {
  let key = req.params.key;
  MusicApi.searchSuggestion(key)
    .then(data => res.json(data))
    .catch(err => res.send(err));
});

router.get('/suggestion/xiami', (req, res) => {
  MusicApi.getDailySuggest()
    .then(data => res.json(data))
    .catch(err => res.send(err));
});

module.exports = router;
