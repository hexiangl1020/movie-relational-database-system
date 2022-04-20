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


// Route 2 (handler)
async function mbti_matches(req, res) {
    
    const mbti_type = req.params.mbti_type ? req.params.mbti_type : "ESFP"
        
    connection.query(`SELECT movie_id,Name FROM characters 
    WHERE mbti = '${mbti_type}'`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
   
    
}

// Route 3 (handler)
async function findcsametype(req, res) {
    // TODO: TASK 5: implement and test, potentially writing your own (ungraded) tests
    const cname = req.params.cname ? req.params.cname : "Vronsky"
    const mid = req.params.mid ? req.params.mid : "tt0003625"
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
            AND movie_id='${mid}'
            AND mbti is not null
            ))
    SELECT AA.movie_id,
        AA.name,
       AA.primaryTitle AS movie_title,
       AA.mbti
    FROM (
        SELECT W.movie_id, 
            W.name,
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

//Route 4
async function findcanda(req, res) {
    // TODO: TASK 5: implement and test, potentially writing your own (ungraded) tests
    const cname = req.params.cname ? req.params.cname : "Vronsky"
    const mid = req.params.mid ? req.params.mid : "tt0003625"
    connection.query(`
    WITH wanted_movie
    AS (SELECT Name,
               C.movie_id,
               movie.primaryTitle
        FROM characters C
        JOIN movie
        ON C.movie_id=movie.movie_id
         WHERE mbti = (
            SELECT DISTINCT mbti
            FROM characters
            WHERE Name ='${cname}'
            AND movie_id='${mid}'
            AND mbti is not null
            ))
    SELECT DISTINCT ABB.movie_id,
        ABB.Name,
        ABB.primaryTitle,
        actors.primaryName
    FROM
    (SELECT WW.movie_id,
        WW.Name,
        WW.primaryTitle,
        play_by.actorID
    FROM wanted_movie WW
    JOIN play_by
    ON WW.Name=play_by.Name
    AND WW.movie_id=play_by.movie_id) ABB
    JOIN actors
    ON actors.actor_id=ABB.actorID`,function (error, results, fields) {

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
    connection.query(`
    WITH mbti_count_actor AS (
    SELECT a.actor_id, primaryName, mbti, COUNT(*) AS mbti_number
    FROM movie m
    JOIN characters c
    ON m.movie_id = c.movie_id
    JOIN play_by pb
    ON m.movie_id = pb.movie_id
    JOIN actors a
    ON a.actor_id=pb.actorID
    WHERE mbti IS NOT NULL
    AND mbti != 'XXXX'
    GROUP BY  a.actor_id, mbti
    ),
    total_actor AS (
      SELECT a.actor_id, COUNT(*) AS total_number
      FROM movie m
      JOIN characters c
      ON m.movie_id = c.movie_id
      JOIN play_by pb
      ON m.movie_id = pb.movie_id
      JOIN actors a
      ON a.actor_id=pb.actorID
      WHERE mbti IS NOT NULL
      AND mbti != 'XXXX'
      GROUP BY  a.actor_id)

    SELECT actor_id, primaryName, mbti, (mbti_number/total_number)*100 AS percentage
    FROM mbti_count_actor
    NATURAL JOIN total_actor
    GROUP BY actor_id, mbti`, function (error, results, fields) {
    if (error) {
        console.log(error)
        res.json({ error: error })
    } else if (results) {
        res.json({ results: results })
    }
    });
}


// ********************************************
//             SEARCH ROUTES
// ********************************************

// Route 7 (handler)
async function rankbymbti(req, res) {
    // TODO: TASK 8: implement and test, potentially writing your own (ungraded) tests
    // IMPORTANT: in your SQL LIKE matching, use the %query% format to match the search query to substrings, not just the entire string
        connection.query(`WITH top_movies AS (
            SELECT *
            FROM movie
            ORDER BY averageRating DESC
        ),
        character_in_top_movies AS (
            SELECT characters.Name, characters.mbti, characters.movie_id
            FROM characters join top_movies
            ON characters.movie_id = top_movies.movie_id
            WHERE characters.mbti IS NOT NULL
        )
        
        SELECT actors.primaryName, character_in_top_movies.mbti, COUNT(*)
        FROM character_in_top_movies JOIN play_by
        ON character_in_top_movies.movie_id = play_by.movie_id AND character_in_top_movies.Name = play_by.Name
        JOIN actors
        ON play_by.actorID = actors.actor_id
        GROUP BY actors.primaryName, character_in_top_movies.mbti
        ORDER BY COUNT(*) DESC`,function(error, results, fields) {
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

module.exports = {
    hello,
    mbti_matches,
    findcsametype,
    findcanda,
    mvpct,
    actorpct,
    rankbymbti,
    top5mvmbti
}