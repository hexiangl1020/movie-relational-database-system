const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

// TODO: fill in your connection details here
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();


// ********************************************
//            SIMPLE ROUTE EXAMPLE
// ********************************************

// Route 1 (handler)
async function hello(req, res) {
    // a GET request to /hello?name=Steve
    if (req.query.name) {
        res.send(`Hello, ${req.query.name}! Welcome to the mbti_imdb server!`)
    } else {
        res.send(`Hello! Welcome to the mbti_imdb server!`)
    }
}



// ********************************************
//               GENERAL ROUTES
// ********************************************


// Route 3 (handler)
async function mbti_matches(req, res) {
    
    const mbti_type = req.params.mbti_type ? req.params.mbti_type : "ESFP"
        
    connection.query(`SELECT Name FROM characters 
    WHERE mbti = '${mbti_type}'`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
   
    
}

// Route 4 (handler)
async function findcsametype(req, res) {
    // TODO: TASK 5: implement and test, potentially writing your own (ungraded) tests
    const cname = req.params.cname ? req.params.cname : "Vronsky"
    connection.query(`
    WITH wanted_character
    AS (SELECT Name,
               movie_id,
               mbti
        FROM characters
        WHERE mbti = (
            SELECT DISTINCT mbti
            FROM characters
            WHERE Name ='${cname}'
            AND mbti is not null
            ))
SELECT AA.name,
       AA.primaryTitle AS movie_title,
       AA.mbti
    FROM (
        SELECT W.name,
               primaryTitle,
               mbti
        FROM wanted_character W
        JOIN movie
        ON W.movie_id=movie.movie_id) AA`,function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
    
    
}


// ********************************************
//             MATCH-SPECIFIC ROUTES
// ********************************************

// Route 5 (handler)
async function mvpct(req, res) {
    // TODO: TASK 6: implement and test, potentially writing your own (ungraded) tests
    const mv = req.params.mv ? req.params.mv : "Robin Hood"
    connection.query(`WITH mbti_count AS (
        SELECT m.movie_id, primaryTitle, mbti, COUNT(*) AS mbti_number
        FROM movie m
        JOIN characters c
        ON m.movie_id = c.movie_id
        WHERE mbti IS NOT NULL
        AND mbti != 'XXXX'
        AND primaryTitle='${mv}'
        GROUP BY m.movie_id, mbti
    ),
      total AS (
          SELECT m.movie_id, COUNT(*) AS total_number
          FROM movie m
          JOIN characters c
          ON m.movie_id = c.movie_id
          WHERE mbti IS NOT NULL
          AND mbti != 'XXXX'
          GROUP BY m.movie_id
      )
    SELECT movie_id, primaryTitle, mbti, (mbti_number/total_number)*100 AS percentage
    FROM mbti_count c
    NATURAL JOIN total t
    WHERE primaryTitle='${mv}'
    GROUP BY movie_id, mbti`,function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    

    
}

// ********************************************
//            PLAYER-SPECIFIC ROUTES
// ********************************************

// Route 6 (handler)
async function actorpct(req, res) {
    // TODO: TASK 7: implement and test, potentially writing your own (ungraded) tests
    //var id = req.query.id
    const actid = req.params.actid ? req.params.actid : "nm0000001"
    connection.query(`SELECT actor_id, primaryName, mbti, mbti_number AS percentage
    FROM mbti_count_actor
    NATURAL JOIN total_actor
    WHERE actor_id = '${actid}'
    GROUP BY actor_id, mbti
    ;`,function(error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error})    
            }
            else if (results){
                res.json({ results: results})
            }
        }
        );
}


// ********************************************
//             SEARCH ROUTES
// ********************************************

// Route 7 (handler)
async function rankbymbti(req, res) {
    // TODO: TASK 8: implement and test, potentially writing your own (ungraded) tests
    // IMPORTANT: in your SQL LIKE matching, use the %query% format to match the search query to substrings, not just the entire string
        connection.query(`SELECT actor_id, actors.primaryName, character_in_top_movies_play_by.mbti, COUNT(*) AS count
        FROM character_in_top_movies_play_by
        JOIN actors
        ON character_in_top_movies_play_by.actorID = actors.actor_id
        GROUP BY actors.primaryName, character_in_top_movies_play_by.mbti
        ORDER BY COUNT(*) DESC;`,function(error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error})    
            }
            else if (results){
                res.json({ results: results})
            }
        }
        );

}

// Route 8 (handler)
async function top5mvmbti(req, res) {
    // TODO: TASK 9: implement and test, potentially writing your own (ungraded) tests
    // IMPORTANT: in your SQL LIKE matching, use the %query% format to match the search query to substrings, not just the entire string
        connection.query(`WITH mbti_count AS (
            SELECT m.movie_id, primaryTitle, mbti, COUNT(*) AS mbti_number
            FROM movie m
            JOIN characters c
            ON m.movie_id = c.movie_id
            WHERE mbti IS NOT NULL
            AND mbti != 'XXXX'
            GROUP BY m.movie_id, mbti
        )
        SELECT movie_id, primaryTitle AS movie_title, mbti
        FROM (SELECT movie_id, primaryTitle, mbti,
            row_number() OVER (PARTITION BY mbti ORDER BY mbti_number DESC) AS mbti_number_rank
            FROM mbti_count) ranks
        where mbti_number_rank <= 5
        ORDER BY mbti`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } 
            else {
                res.json({ results: results})
            }
            
        
    })
}

async function samembtiactor(req, res){
    connection.query(`WITH played_actor AS (
        SELECT play_by.actorID
        FROM play_by
        WHERE play_by.Name = 'Eliza Doolittle' AND movie_id='tt0058385'
    ),
    other_character_same_actor AS (
        SELECT play_by.Name, play_by.movie_id, play_by.actorID
        FROM play_by JOIN played_actor
        ON play_by.actorID = played_actor.actorID
        WHERE play_by.Name != 'Eliza Doolittle'
    ),
    other_character_info AS (
        SELECT characters.Name,characters.mbti,characters.movie_id,characters.img_url, other_character_same_actor.actorID
        FROM characters JOIN other_character_same_actor
        ON characters.Name = other_character_same_actor.Name AND characters.movie_id = other_character_same_actor.movie_id
    )
    
    SELECT oci.Name AS character_name, m.primaryTitle AS movie_title
    FROM other_character_info oci
    JOIN (SELECT characters.mbti FROM characters
        WHERE characters.Name = 'Eliza Doolittle' AND movie_id='tt0058385') A
    ON oci.mbti = A.mbti
    JOIN movie m on m.movie_id = oci.movie_id
    JOIN actors a on a.actor_id = oci.actorID`, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } 
        else {
            res.json({ results: results})
        }
        
    
})
}

async function actormbtiplayed(req, res){
    connection.query(`SELECT actor_id, actors.primaryName, character_in_top_movies_play_by.mbti, COUNT(*) AS count
    FROM character_in_top_movies_play_by
    JOIN actors
    ON character_in_top_movies_play_by.actorID = actors.actor_id
    GROUP BY actors.primaryName, character_in_top_movies_play_by.mbti
    ORDER BY COUNT(*) DESC;`, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } 
        else {
            res.json({ results: results})
        }
        
    
})
}

async function characterMbtiList(req, res){
    connection.query(`SELECT characters.name, characters.mbti
    FROM characters
    ORDER BY characters.name`, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } 
        else {
            res.json({ results: results})
        }
        
    
})
}
module.exports = {
    hello,
    mbti_matches,
    findcsametype,
    mvpct,
    actorpct,
    rankbymbti,
    top5mvmbti,
    samembtiactor,
    actormbtiplayed,
    characterMbtiList
}