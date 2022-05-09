import config from './config.json';

const domain =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'https://mbti-personality.herokuapp.com';

const getcharacterMbtiList = async (value) => {
  var res = await fetch(
    `${domain}/characterMbtiList?mbti=${value}`,
    {
      method: 'GET',
    }
  );
  return res.json();
};

const getmbtiMatches = async (page, pagesize, value) => {
  var res = await fetch(
    `${domain}/mbti_matches/${value}`,
    {
      method: 'GET',
    }
  );
  return res.json();
};

const gettop5mvmbti = async (value) => {
  var res = await fetch(
    `${domain}/top5mvmbti?mbti=${value}`,
    {
      method: 'GET',
    }
  );
  return res.json();
};

const getmvmatches = async (value) => {
  var res = await fetch(
    `${domain}/movie/${value}`,
    {
      method: 'GET',
    }
  );
  return res.json();
};

const getmvmbtipct = async (value) => {
  var res = await fetch(
    `${domain}/mvpct/${value}`,
    {
      method: 'GET',
    }
  );
  return res.json();
};

const getCharacter = async (movieId, name) => {
  var res = await fetch(
    `${domain}/character/${movieId}/${name}`,
    {
      method: 'GET',
    }
  );
  return res.json();
};

const getMovie = async (movieId) => {
  var res = await fetch(
    `${domain}/movie/${movieId}`,
    {
      method: 'GET',
    }
  );
  return res.json();
};

const getCharacterSameMBTI = async (movieId, name) => {
  var res = await fetch(
    `${domain}/findcsametype?mid=${movieId}&cname=${name}`,
    {
      method: 'GET',
    }
  );
  return res.json();
};

const getCharacterSameActorMBTI = async (movieId, name) => {
  var res = await fetch(
    `${domain}/samembtiactor?mvid=${movieId}&name=${name}`,
    {
      method: 'GET',
    }
  );
  return res.json();
};

const rankbymbti = async (value) => {
  var res = await fetch(
    `${domain}/actormbtiplayed`,
    {
      method: 'GET',
    }
  );
  return res.json();
};

const actorpct = async (value) => {
    var res = await fetch(`${domain}/actorpct/${value}`, {
        method: 'GET',
    })
    return res.json()
}

const getAllMovies = async (
    title,
    startYearLow,
    startYearHigh,
    RatingLow,
    RatingHigh
  ) => {
    var res = await fetch(
      `${domain}/movieList?title=${title}&startYearLow=${startYearLow}&startYearHigh=${startYearHigh}&RatingLow=${RatingLow}&RatingHigh=${RatingHigh}`,
      {
        method: 'GET',
      }
    );
    return res.json();
  }

const getMovieCharacterList = async (value) => {
    var res = await fetch(`${domain}/movieCharacterList?mvid=${value}`, {
        method: 'GET',
    })
    return res.json()
}



export {
    getcharacterMbtiList,
    getmbtiMatches,
    gettop5mvmbti,
    getmvmatches,
    getmvmbtipct,
    getCharacter,
    getMovie,
    getCharacterSameMBTI,
    getCharacterSameActorMBTI,
    rankbymbti,
    actorpct,
    getAllMovies,
    getMovieCharacterList
}
