var express = require('express');
var router = express.Router();

const artistController = require('../controllers/artistsController');

router.post('/searchartist', artistController.getArtist);

module.exports = router;


