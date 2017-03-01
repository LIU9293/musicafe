'use strict';
const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();
const router = require('./api');
const compression = require('compression');

//CORS
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

//gzip
app.use(compression());

//static
app.use(express.static(path.resolve(__dirname, '..', 'build')));

//api
app.use('/api', router);

//always return index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.listen(port);

console.log("node server started on port " + port);
