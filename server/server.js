const express = require('express');
const mysql = require('mysql');
var cors = require('cors');
const path = require('path');
const routes = require('./routes');
const config = require('./config.json');

const port = process.env.PORT || 8080;

const app = express();
app.use(cors());

// whitelist localhost 3000
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/hello', routes.hello);

app.get('/mbti_matches/:mbti_type', routes.mbti_matches);

app.get('/findcsametype', routes.findcsametype);

//Route4
app.get('/findcanda', routes.findcanda);

// Route 5 - register as GET
app.get('/mvpct/:mvId', routes.mvpct);

// Route 6 - register as GET
app.get('/actorpct/:actid', routes.actorpct);

app.get('/top5mvmbti', routes.top5mvmbti);

app.get('/character/:mvid/:name', routes.characterInfo);

app.get('/movie/:mvid', routes.movieInfo);

app.get('/mvCastMbti', routes.mvCastMbti);

app.get('/samembtiactor', routes.samembtiactor);

app.get('/actormbtiplayed', routes.actormbtiplayed);

app.get('/movieList', routes.movieList);

app.get('/characterMbtiList', routes.characterMbtiList);

app.get('/movieCharacterList', routes.movieCharacterList);

app.listen(port, () => {
  console.log(
    `Server running at http://${config.server_host}:${port}/`
  );
});
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


module.exports = app;
