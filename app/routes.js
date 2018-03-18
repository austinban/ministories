import React from 'react';
import { Route, Switch, HashRouter } from 'react-router-dom';
import Home from './routes/home/Home';
import About from './routes/about/About';

export default (
	<HashRouter>
		<Switch>
			<Route exact path="/" component={Home} />
			<Route path="/about" component={About} />
		</Switch>
	</HashRouter>
);
