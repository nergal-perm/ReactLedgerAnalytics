import React from 'react';
import ReactDOM from 'react-dom';

var MyComp = React.createClass({
	render: function() {
		return (
			<div className="jumbotron">
				<h1>Hello there, {this.props.name}</h1>
			</div>
		);
	}
});

ReactDOM.render(<MyComp name="Eugene" />, document.querySelector('.container'));