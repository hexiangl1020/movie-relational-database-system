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


// Route 1 (handler)
async function hello(req, res) {
    // a GET request to /hello?name=Steve
    if (req.query.name) {
        res.send(`Hello, ${req.query.name}! Welcome to the mbti_imdb server!`)
    } else {
        res.send(`Hello! Welcome to the mbti_imdb server!`)
    }
}


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

async function findcsametype(req, res) {
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

async function mvpct(req, res) {    
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

async function actorpct(req, res) {
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

async function top5mvmbti(req, res) {
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

async function mvCastMbti(req, res) {
    const mv = req.params.mv ? req.params.mv : "tt0058385"
    const name = req.params.name ? req.params.name : "Eliza Doolittle"
    connection.query(`WITH mbti_count AS (
        SELECT m.movie_id, primaryTitle, mbti, COUNT(*) AS mbti_number
        FROM movie m
        JOIN characters c
        ON m.movie_id = c.movie_id
        WHERE mbti IS NOT NULL
        AND mbti != 'XXXX'
        GROUP BY m.movie_id, mbti
    ), top_1_movie AS (
        SELECT movie_id, primaryTitle AS movie_title
        FROM mbti_count
        WHERE mbti= (
            SELECT mbti
            FROM characters
            WHERE Name = '${name}' AND movie_id='${mv}'
        )
        ORDER BY mbti_number DESC
        LIMIT 1
    )
    SELECT characters.Name AS character_name, m.movie_title, a.primaryName AS actor_name, characters.mbti
    FROM characters
    JOIN play_by pb ON characters.movie_id = pb.movie_id AND pb.Name=characters.Name
    JOIN top_1_movie m ON characters.movie_id = m.movie_id
    JOIN actors a ON pb.actorID = a.actor_id
    GROUP BY characters.Name, m.movie_title, a.primaryName;`, function (error, results, fields) {
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
    ORDER BY COUNT(*) DESC`, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } 
        else {
            res.json({ results: results})
        }
    })
}

async function movieList(req, res) {
    const title = req.query.title || ''
    const startYearLow = req.query.startYearLow || 1000
    const startYearHigh = req.query.startYearHigh || 3000
    const ratingLow = req.query.RatingLow || 0
    const ratingHigh = req.query.RatingHigh && req.query.RatingHigh==0 ? 0 : req.query.RatingHigh==undefined ? 10 : req.query.RatingHigh
    
    let page_size = 300000
    let start_idx = 0
    if (req.query.page && !isNaN(req.query.page)) {
        page_size = req.query.pagesize || 10
        start_idx = (req.query.page-1)*page_size
    }
    connection.query(`SELECT *
    FROM movie 
    WHERE primaryTitle LIKE '%${title}%' AND startYear>=${startYearLow} AND startYear<=${startYearHigh} AND averageRating>=${ratingLow} AND averageRating<=${ratingHigh} 
    ORDER BY primaryTitle ASC
    LIMIT ${start_idx},${page_size}`, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
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
    top5mvmbti,
    mvCastMbti,
    samembtiactor,
    actormbtiplayed,
    movieList,
    characterMbtiList
}