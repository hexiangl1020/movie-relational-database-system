import config from './config.json';

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
};

export { getAllMovies };
