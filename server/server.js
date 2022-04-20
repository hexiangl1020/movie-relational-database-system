const express = require('express');
const mysql      = require('mysql');
var cors = require('cors')


const routes = require('./routes')
const config = require('./config.json')

const app = express();

// whitelist localhost 3000aaaaaaaaa
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));

// Route 1 - register as GET 
app.get('/hello', routes.hello)

// Route 3 - register as GET 
app.get('/mbti_matches/:mbti_type', routes.mbti_matches)

// Route 4 - register as GET 
app.get('/findcsametype', routes.findcsametype)

// Route 5 - register as GET 
app.get('/mvpct', routes.mvpct)

// Route 6 - register as GET 
app.get('/actorpct', routes.actorpct)

// Route 7 - register as GET 
app.get('/rankbymbti', routes.rankbymbti)

// Route 8 - register as GET 
app.get('/top5mvmbti', routes.top5mvmbti)





app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
