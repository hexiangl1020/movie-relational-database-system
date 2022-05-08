import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

<<<<<<< HEAD
import CharacterPage from './pages/CharacterPage';
=======
import HomePage from './pages/HomePage';
import Movieprofile from './pages/Movieprofile';
>>>>>>> da7653a356a8fca7be9bc7d69a152119fb157293
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

