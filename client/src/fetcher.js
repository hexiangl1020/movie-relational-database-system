import config from './config.json';
const getcharacterMbtiList = async (value) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/characterMbtiList?mbti=${value}`,
    {
      method: 'GET',
    }
  );
  return res.json();
};

const getmbtiMatches = async (page, pagesize, value) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/mbti_matches/${value}`,
    {
      method: 'GET',
    }
  );
  return res.json();
};

const gettop5mvmbti = async (value) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/top5mvmbti?mbti=${value}`,
    {
      method: 'GET',
    }
  );
  return res.json();
};

const getmvmatches = async (value) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/movie/${value}`,
    {
      method: 'GET',
    }
  );
  return res.json();
};

const getmvmbtipct = async (value) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/mvpct/${value}`,
    {
      method: 'GET',
    }
  );
  return res.json();
};

const getCharacter = async (movieId, name) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/character/${movieId}/${name}`,
    {
      method: 'GET',
    }
  );
  return res.json();
};

const getMovie = async (movieId) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/movie/${movieId}`,
    {
      method: 'GET',
    }
  );
  return res.json();
};

const getCharacterSameMBTI = async (movieId, name) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/findcsametype?mid=${movieId}&cname=${name}`,
    {
      method: 'GET',
    }
  );
  return res.json();
};

const getCharacterSameActorMBTI = async (movieId, name) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/samembtiactor?mvid=${movieId}&name=${name}`,
    {
      method: 'GET',
    }
  );
  return res.json();
};

const rankbymbti = async (value) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/actormbtiplayed`,
    {
      method: 'GET',
    }
  );
  return res.json();
};

const actorpct = async (value) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/actorpct/${value}`, {
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
      `http://${config.server_host}:${config.server_port}/movieList?title=${title}&startYearLow=${startYearLow}&startYearHigh=${startYearHigh}&RatingLow=${RatingLow}&RatingHigh=${RatingHigh}`,
      {
        method: 'GET',
      }
    );
    return res.json();
  }

const getMovieCharacterList = async (value) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/movieCharacterList?mvid=${value}`, {
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
