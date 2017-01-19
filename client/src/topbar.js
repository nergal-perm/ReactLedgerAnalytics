import React, { Component } from 'react';
import { Link } from 'react-router';

class TopBar extends Component {
	render() {
		return (
			<div className="nav navbar navbar-fixed-top navbar-inverse" role="navigation">
				<div className="container-fluid">
					<div className="navbar-header">
						<button className="navbar-toggle collapsed" type="button" dataToggle="collapse" dataTarget="#navbar" ariaExpanded="false" ariaControls="navbar">
							<span className="sr-only">Панель навигации </span>
							<span className="icon-bar" />
							<span className="icon-bar" />
							<span className="icon-bar" />
						</button>
						<a className="navbar-brand" href="/">Ledger Analytics</a>
					</div>
					<div className="navbar-collapse collapse" id="navbar">
						<ul className="nav navbar-nav navbar-right">
							<li><Link to='/yearTotals'>Итоги года</Link></li>
							<li><Link to='/monthlyDashboard'>Итоги месяца</Link></li>
						</ul>
					</div>
				</div>
			</div>
		);
	}
};

export default TopBar;