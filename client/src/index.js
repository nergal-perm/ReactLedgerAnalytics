import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import PivotTableByYear from './pivotYear';
import MonthlyDashboard from './monthlyDashboard';

ReactDOM.render(
  <Router history={browserHistory}>
  	<Route path='/' component={App}>
	  <Route path='yearTotals' component={PivotTableByYear} />
	  <Route path='monthlyDashboard' component={MonthlyDashboard} />
    </Route>
  </Router>,
  document.getElementById('root')
);
