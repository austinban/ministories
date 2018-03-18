import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './routes/home/Home';
import About from './routes/about/About';
import ReactGA from 'react-ga';
ReactGA.initialize('UA-89118704-2');

function fireTracking() {
    ReactGA.pageview(window.location.hash);
}

export default (
	<Switch onUpdate={fireTracking}>
		<Route exact path="/" component={Home} />
		<Route path="/about" component={About} />
	</Switch>
);
