import React, { Component } from  'react';
import updateSparks from './spark.js'; 

class MonthlyDashboard extends Component {
	constructor(props) {
    	super(props);
    	this.handleUserInput = this.handleUserInput.bind(this);
    	this.state = {
      		period: "2016-06",
      		monthlyDashboard: {},
      		activeIncome: '10,20,10,20'
    	};
  	}

  	componentDidMount() {
  	  	getMonthlyDashboard(this.state.period, (periodData) => {
  	    	this.setState ({
  	      		period: this.state.period,
  	      		monthlyDashboard: periodData[0],
  	      		activeIncome: '10,20,10,20'
  	    	});      
  	  	});        
  	}
	
  	handleUserInput(event) {
  	  	var statePeriod = event.target.value;
  	  	getMonthlyDashboard(statePeriod, (periodData) => {
  	    	this.setState({
	  	      	period:statePeriod,
	  	      	monthlyDashboard: periodData[0],
	  	      	activeIncome:"30,10,20,10,30,50"
  	    	});      
  	  	});
  	}

// { this.state.monthlyDashboard.activeIncome && this.state.monthlyDashboard.activeIncome.join(',')}

	render() {
		return (
			<div>
				<MonthFilter statePeriod={this.state.period} onUserInput={this.handleUserInput} />
				<p>Just some tests with sparkline: 
					<span className="sparkline">{this.state.activeIncome}</span>
				</p>
			</div>
		);
	}
}

class MonthFilter extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.onUserInput(event);
  }
  

  render() {
    return (
      <div className="form form-inline">
        <div className="form-group">
          <label htmlFor="#monthInput" 
                 className="control-label">Период:</label>
          <input id="monthInput" type="text"  
                 value={this.props.statePeriod} 
                 onChange={this.handleChange}
                 className="form-control"/>
        </div>
      </div>
    );
  }
}

function getMonthlyDashboard(period, cb) {
  return fetch('monthlyDashboard?month=' + period, {
    accept: 'application/json'
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

function checkStatus(response) {
  if(response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error('HTTP Error ${response.statusText');
    error.status = response.statusText;
    error.response = response;
    console.log(error); //eslint-disable-line no-console
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

export default MonthlyDashboard;