const express = require('express');
const bodyParser = require('body-parser');

const asteroidRoute = require('./routes/asteroid');
const getAsteroid = require('./getAsteroid/getAsteroid');

const app = express();

const ports = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/asteroids', asteroidRoute);
app.use('/', getAsteroid);

app.listen(ports, () => {console.log(`Listening on port ${ports}`)});
