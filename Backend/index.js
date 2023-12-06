const express = require('express');
const bodyParser = require('body-parser')
const app = express();

const ports = process.env.PORT || 3000;

app.use(bodyParser.json());

app.listen(ports, () => {console.log(`Listening on port ${ports}`)});