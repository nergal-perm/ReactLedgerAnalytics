import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import PivotTableByYear from './pivotYear';

ReactDOM.render(
  <Router history={browserHistory}>
  	<Route path='/' component={App}>
	  <Route path='yearTotals' component={PivotTableByYear} />
    </Route>
  </Router>,
  document.getElementById('root')
);