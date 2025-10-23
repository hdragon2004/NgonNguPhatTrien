var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Serve templates
router.get('/templates/index.html', function(req, res) {
  res.sendFile(path.join(__dirname, '../templates/index.html'));
});

router.get('/templates/login.html', function(req, res) {
  res.sendFile(path.join(__dirname, '../templates/login.html'));
});

router.get('/templates/register.html', function(req, res) {
  res.sendFile(path.join(__dirname, '../templates/register.html'));
});

router.get('/templates/home.html', function(req, res) {
  res.sendFile(path.join(__dirname, '../templates/home.html'));
});

router.get('/templates/upload-simple.html', function(req, res) {
  res.sendFile(path.join(__dirname, '../templates/upload-simple.html'));
});

router.get('/templates/upload-multiple-simple.html', function(req, res) {
  res.sendFile(path.join(__dirname, '../templates/upload-multiple-simple.html'));
});

module.exports = router;
