import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';
import MoviePage from './pages/MoviePage';

ReactDOM.render(
  <div>
    <Router>
      <Switch>
        <Route exact path='/movieList' render={() => <MoviePage />} />
      </Switch>
    </Router>
  </div>,
  document.getElementById('root')
);
