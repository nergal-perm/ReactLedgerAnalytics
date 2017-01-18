import React, { Component } from  'react';

class PivotTableByYear extends Component {
  constructor(props) {
    super(props);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.state = {
      year: 2016
    };
  }

  componentDidMount() {
    getTotalsByYear(this.state.year, (yearData) => {
      console.log("Component did mount with " + yearData);
      this.setState ({
        year: this.state.year,
        totalsByYear: yearData[0]
      });      
    });        
  }

  handleUserInput(event) {
    var stateYear = parseInt(event.target.value, 10);
    getTotalsByYear(stateYear, (yearData) => {
      this.setState({
        year:stateYear,
        totalsByYear: yearData[0]
      });      
    });
  }

  render() {
    return (
      <div>
        <YearFilter stateYear={this.state.year} onUserInput={this.handleUserInput}/>
        <TotalsTable yearData={this.state.totalsByYear} stateYear={this.state.year}/>
      </div>
    );
  }
}

class YearFilter extends Component {
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
          <label htmlFor="#yearInput" 
                 className="control-label">Год:</label>
          <input id="yearInput" type="number"  
                 value={this.props.stateYear} 
                 onChange={this.handleChange}
                 className="form-control"/>
        </div>
      </div>
    );
  }
}

class TotalsTable extends Component {
  render() {
    return (
      <table className="table">
        <caption>Current year: {this.props.stateYear}</caption>
        <thead>
          <tr>
            <th>Статья</th>
            <th>Январь</th>
            <th>Февраль</th>
            <th>Март</th>
            <th>Апрель</th>
            <th>Май</th>
            <th>Июнь</th>
            <th>Июль</th>
            <th>Август</th>
            <th>Сентябрь</th>
            <th>Октябрь</th>
            <th>Ноябрь</th>
            <th>Декабрь</th>
          </tr>
        </thead>
        {getPivotTableRows(this.props.yearData)}
      </table>
    );
  }
}

class DataRow extends Component {
  render() {
    var tds = this.props.innerData.map((item, index) => {
      return <td key={"col" + index}>{item}</td>;
    });

    return <tr>{tds}</tr>
  }
}

function getPivotTableRows(yearData) {
  if (!yearData) { return <tbody /> ;}
  console.log(yearData);
  return (<tbody>
      <DataRow innerData={yearData.activeIncome} />
      <DataRow innerData={yearData.rentIncome} />
      <DataRow innerData={yearData.passiveIncomeTotal} />
      <DataRow innerData={yearData.passiveIncomeFixed} />
      <DataRow innerData={yearData.spouseIncome} />
      <DataRow innerData={yearData.expenses} />
      <DataRow innerData={yearData.investments} />
      <DataRow innerData={yearData.marketValue} />
      <DataRow innerData={yearData.netWorth} />
    </tbody>);
}

function getTotalsByYear(year, cb) {
  return fetch('totalsByYear?year=' + year, {
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

export default PivotTableByYear;