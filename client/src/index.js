import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import CharacterPage from './pages/CharacterPage';
import HomePage from './pages/HomePage';
import Movieprofile from './pages/Movieprofile';
import 'antd/dist/antd.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"

ReactDOM.render(
  <div>
    <Router>
      <Switch>
	  	<Route exact
							path="/"
							render={() => (
								<HomePage />
							)}/>
        <Route 
							path="/characterInfo/:movieId/:name"
							render={() => (
								<CharacterPage />
							)}/>
       <Route
							path="/movie/:mvid"
							render={() => (
								<Movieprofile />
							)}/>
      </Switch>
    </Router>
  </div>,
  document.getElementById('root')
);

