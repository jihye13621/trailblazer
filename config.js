
const express = require('express');
const path = require('path');
const app = express();
let port = process.env.PORT || 3000;

// app.set( 'port', ( process.env.PORT || 3000 ));

app.use(express.static(path.join(__dirname, '')));

app.get('/index', (req, res) => res.sendFile(path.resolve(__dirname, 'index.html')));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


// to run, cd to config.js directory. npm install, npm start