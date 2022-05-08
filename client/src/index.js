import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import CharacterPage from './pages/CharacterPage';
import 'antd/dist/antd.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"

ReactDOM.render(
  <div>
    <Router>
      <Switch>
        <Route 
							path="/characterInfo/:movieId/:name"
							render={() => (
								<CharacterPage />
							)}/>
      </Switch>
    </Router>
  </div>,
  document.getElementById('root')
);

