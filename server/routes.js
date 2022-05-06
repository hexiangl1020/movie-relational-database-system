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
    const pagesize = req.params.pagesize ? req.params.pagesize : 10
    var linenum=(req.query.page-1)*pagesize;
    if (req.query.page && !isNaN(req.query.page)) {
        connection.query(`SELECT movie_id,Name FROM characters 
        WHERE mbti = '${mbti_type}'
        LIMIT ${linenum},${pagesize}`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
            } 
        else if (results) {
            res.json({ results: results })
        }
        });
    }

    else{
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
    
   
    
}

async function findcsametype(req, res) {
    const cname = req.params.cname ? req.params.cname : "Vronsky"
    const mid = req.params.mid ? req.params.mid : "tt0003625"
    const pagesize = req.params.pagesize ? req.params.pagesize : 10
    var linenum=(req.query.page-1)*pagesize;
    if (req.query.page && !isNaN(req.query.page)) {
        connection.query(`
        WITH wanted_character
        AS (SELECT Name,
                   movie_id,
                   mbti,
                   img_url
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
           AA.mbti,
           AA.img_url
        FROM (
            SELECT W.movie_id, 
                W.name,
                primaryTitle,
                mbti,
                img_url
            FROM wanted_character W
            JOIN movie
            ON W.movie_id=movie.movie_id) AA
        LIMIT ${linenum},${pagesize}`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
            } 
        else if (results) {
            res.json({ results: results })
        }
        });
    }

    else{
        connection.query(`
        WITH wanted_character
        AS (SELECT Name,
                   movie_id,
                   mbti,
                   img_url
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
           AA.mbti,
           img_url
        FROM (
            SELECT W.movie_id, 
                W.name,
                primaryTitle,
                mbti,
                img_url
            FROM wanted_character W
            JOIN movie
            ON W.movie_id=movie.movie_id) AA`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
        });
    }
    
}

//Route 4
async function findcanda(req, res) {
    // TODO: TASK 5: implement and test, potentially writing your own (ungraded) tests
    const cname = req.params.cname ? req.params.cname : "Vronsky"
    const mid = req.params.mid ? req.params.mid : "tt0003625"

    const pagesize = req.params.pagesize ? req.params.pagesize : 10
    var linenum=(req.query.page-1)*pagesize;
    if (req.query.page && !isNaN(req.query.page)) {
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
        ON actors.actor_id=ABB.actorID
        LIMIT ${linenum},${pagesize}`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
            } 
        else if (results) {
            res.json({ results: results })
        }
        });
    }

    else{
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
    ON actors.actor_id=ABB.actorID`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
        });
    }

}

// Route 5 (handler)
async function mvpct(req, res) {
    const mvId = req.params.mvId
    connection.query(
        `WITH mbti_count AS (
        SELECT m.movie_id, mbti, COUNT(*) AS mbti_number
        FROM movie m
        JOIN characters c
        ON m.movie_id = c.movie_id
        WHERE mbti IS NOT NULL
        AND mbti != 'XXXX'
        AND m.movie_id = '${mvId}'
        GROUP BY m.movie_id, mbti
    ),
      total AS (
          SELECT m.movie_id, COUNT(*) AS total_number
          FROM movie m
          JOIN characters c
          ON m.movie_id = c.movie_id
          WHERE mbti IS NOT NULL
          AND mbti != 'XXXX'
          AND m.movie_id='${mvId}'
          GROUP BY m.movie_id
      )
    SELECT movie_id, mbti, (mbti_number/total_number)*100 AS percentage
    FROM mbti_count c
    NATURAL JOIN total t
    WHERE movie_id='${mvId}'
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
    var id = req.params.actorId
    connection.query(`
    WITH mbti_count_actor AS (
    SELECT a.actor_id, mbti, COUNT(*) AS mbti_number
    FROM movie m
    JOIN characters c
    ON m.movie_id = c.movie_id
    JOIN play_by pb
    ON m.movie_id = pb.movie_id
    JOIN actors a
    ON a.actor_id=pb.actorID
    WHERE mbti IS NOT NULL
    AND mbti != 'XXXX'
    AND a.actor_id = '${id}'
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
      AND a.actor_id = '${id}'
      GROUP BY  a.actor_id)

    SELECT actor_id, mbti, (mbti_number/total_number)*100 AS percentage
    FROM mbti_count_actor
    NATURAL JOIN total_actor
    WHERE actor_id = '${id}'
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

async function characterInfo(req, res) {
    
    const mvid = req.params.mvid
    const name = req.params.name

    connection.query(
    `SELECT * FROM characters 
    WHERE movie_id = '${mvid}'
    AND Name = '${name}'
    Limit 1`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
   
    
}

async function movieInfo(req, res) {
    
    const mvid = req.params.mvid
        
    connection.query(
    `SELECT * FROM movie 
    WHERE movie_id = '${mvid}'`, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

async function mvCastMbti(req, res) {
    const mv = req.query.mv ? req.query.mv : "tt0058385"
    const name = req.query.name ? req.query.name : "Eliza Doolittle"
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
    const mvid = req.query.mvid
    const name = req.query.name

    connection.query(`WITH played_actor AS (
        SELECT play_by.actorID
        FROM play_by
        WHERE play_by.Name = '${name}' AND movie_id='${mvid}'
        LIMIT 1
    ),
    other_character_same_actor AS (
        SELECT play_by.Name, play_by.movie_id, play_by.actorID
        FROM play_by
        JOIN played_actor ON play_by.actorID = played_actor.actorID
        WHERE play_by.Name != '${name}' AND movie_id!='${mvid}'
    ),
    same_mbti AS(
        SELECT *
        FROM characters
        WHERE mbti=(SELECT mbti FROM characters WHERE characters.Name = '${name}' AND movie_id='${mvid}' LIMIT 1)
    )
    SELECT oci.Name AS character_name, m.primaryTitle AS movie_title, a.primaryName
    FROM other_character_same_actor oci
    JOIN actors a on a.actor_id = oci.actorID
    JOIN same_mbti sm ON oci.movie_id = sm.movie_id AND oci.Name = sm.Name
    JOIN movie m on m.movie_id = oci.movie_id`, function (error, results, fields) {
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
    let page_size = 1500000
    let start_idx = 0
    if (req.query.page && !isNaN(req.query.page)) {
        page_size = req.query.pagesize || 10
        start_idx = (req.query.page-1)*page_size
    }
    connection.query(`SELECT *
    FROM characters
    WHERE characters.name != '?' AND characters.name != '???' AND characters.name != '????'
    LIMIT ${start_idx},${page_size}`, function (error, results, fields) {
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
    top5mvmbti,
    characterInfo,
    movieInfo,
    mvCastMbti,
    samembtiactor,
    actormbtiplayed,
    movieList,
    characterMbtiList
}