import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import Movieprofile from './pages/Movieprofile';
import ActorPage from './pages/ActorPage';
import ActorPercentPage from './pages/ActorPercent';
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
       <Route exact
							path="/actormbtiplayed"
							render={() => (
								<ActorPage />
							)}/>
		<Route 
							path="/actorpct/:actid"
							render={() => (
								<ActorPercentPage />
							)}/>
		/>
      </Switch>
    </Router>
  </div>,
  document.getElementById('root')
);