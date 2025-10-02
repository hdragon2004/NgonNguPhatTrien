var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendFile('index.html', { root: '.' });
});

/* GET API info */
router.get('/api', function (req, res, next) {
  res.json({
    message: 'User Role Management API',
    version: '1.0.0',
    endpoints: {
      users: '/users',
      roles: '/roles'
    }
  });
});

module.exports = router;
