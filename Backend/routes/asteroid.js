const express = require('express');
const asteroidController = require('../controllers/asteroid.js')

const router = express.Router();

router.post('/', asteroidController.postAsteroid);

router.get('/', asteroidController.getPages)

router.get('/:init', asteroidController.getAsteroid);

module.exports = router;