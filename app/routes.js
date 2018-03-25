import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './routes/home/Home';
import About from './routes/about/About';

// Google Analytics
import ReactGA from 'react-ga';
ReactGA.initialize('UA-89118704-2');
ReactGA.pageview(window.location.pathname + window.location.search);

export default (
	<Switch>
		<Route exact path="/" component={Home} />
		<Route path="/about" component={About} />
	</Switch>
);
