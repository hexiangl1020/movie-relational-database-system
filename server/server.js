const express = require('express');
const mysql      = require('mysql');
var cors = require('cors')


const routes = require('./routes')
const config = require('./config.json')

const app = express();

// whitelist localhost 3000
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));

app.get('/hello', routes.hello)

app.get('/mbti_matches/:mbti_type', routes.mbti_matches)

app.get('/findcsametype', routes.findcsametype)

app.get('/mvpct', routes.mvpct)

app.get('/actorpct', routes.actorpct)

app.get('/top5mvmbti', routes.top5mvmbti)

app.get('/mvCastMbti', routes.mvCastMbti)

app.get('/samembtiactor', routes.samembtiactor)

app.get('/actormbtiplayed', routes.actormbtiplayed)

app.get('/movieList', routes.movieList)

app.get('/characterMbtiList', routes.characterMbtiList)

app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
