import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import CharacterPage from './pages/CharacterPage';
import HomePage from './pages/HomePage';
import Movieprofile from './pages/Movieprofile';
import ActorPage from './pages/ActorPage';
import ActorPercentPage from './pages/ActorPercent';
import MoviePage from './pages/MoviePage';
import 'antd/dist/antd.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';
import './index.css';

ReactDOM.render(
  <div className='App'>
    <Router>
      <Switch>
        <Route exact path='/' render={() => <HomePage />} />
        <Route exact path='/actorMbti' render={() => <ActorPage />} />
        <Route path='/actorPerc/:actid' render={() => <ActorPercentPage />} />

        <Route
          path='/characterInfo/:movieId/:name'
          render={() => <CharacterPage />}
        />
        <Route path='/movieInfo/:mvid' render={() => <Movieprofile />} />
        <Route exact path='/movieListInfo' render={() => <MoviePage />} />
      </Switch>
    </Router>
  </div>,
  document.getElementById('root')
);
