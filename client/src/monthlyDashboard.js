import React, { Component } from  'react';

class MonthlyDashboard extends Component {
	constructor(props) {
    	super(props);
    	this.handleUserInput = this.handleUserInput.bind(this);
    	this.state = {
      		period: "2016-06",
      		monthlyDashboard: {},
      		activeIncome: []
    	};
  	}

  	componentDidMount() {
		this.setPeriodData(this.state.period);
  	}
	
  	setPeriodData(period) {
  	  	getMonthlyDashboard(period, (periodData) => {
  	    	var newState = {
  	    		period: period
  	    	};

  	    	if (periodData.length !== 0) {
  	    		newState.activeIncome = periodData[0].activeIncome;
  	    		newState.passiveIncome = periodData[0].passiveIncome;
  	    	}

  	    	this.setState(newState);      
  	  	});          		
  	}

  	handleUserInput(event) {
  	  	var statePeriod = event.target.value;
  	  	this.setPeriodData(statePeriod);
  	}

	render() {
		return (
			<div>
				<MonthFilter statePeriod={this.state.period} onUserInput={this.handleUserInput} />
				<p>Активный доход: 
					<Sparkline sparkData={this.state.activeIncome} />
				</p>
				<p>Пассивный доход: 
					<Sparkline sparkData={this.state.passiveIncome} />
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


class Sparkline extends Component {
	constructor(props) {
		super(props);
	}

	componentDidUpdate() {
		this.drawSparkline();
		this.canvas.style.display='inline';
	}

	render() {
		return (
			<canvas 
				ref={(canvas) => { this.canvas = canvas;}} />
		);
	}

	drawSparkline() {
		var co = this.canvas;		
		var p = this.props.sparkData;
		var w = p.length * 6;
		var h = 20;
		co.height = h;
		co.width = w;
		co.style.height = h;
		co.style.width = w;


		var min = 9999;
		var max = -1;

		

		for ( var i = 0; i < p.length; i++ ) {
		  p[i] = p[i] - 0;
		  if ( p[i] < min ) min = p[i];
		  if ( p[i] > max ) max = p[i];
		}


		var c = co.getContext("2d");
		c.strokeStyle = "red";
	    c.lineWidth = 1.0;

    	for ( i = 0; i < p.length; i++ ) {
      		if ( i === 0 )
        		c.moveTo( (w / p.length) * i, h - (((p[i] - min) / (max - min)) * h) );
 			var x = (w / p.length) * i;
 			var y = h - (((p[i] - min) / (max - min)) * h);     	
      		c.lineTo( x, y );
    	}
    	c.stroke();
	    return co;
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