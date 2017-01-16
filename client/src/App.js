import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
      <PivotTableByYear />
    );
  }
}

class PivotTableByYear extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: 2016
    };
    this.handleUserInput = this.handleUserInput.bind(this);
  }

  handleUserInput(event) {
    var stateYear = parseInt(event.target.value, 10);
    getTotalsByMonth(stateYear, (yearData) => {
      this.setState({
        year:stateYear,
        totalsByMonth: yearData
      });      
    });
  }

  render() {
    return (
      <div>
        <YearFilter stateYear={this.state.year} onUserInput={this.handleUserInput}/>
        <TotalsTable yearData={this.state.totalsByMonth} stateYear={this.state.year}/>
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
      <div>
        <label htmlFor="#yearInput">Год:</label>
        <input id="yearInput" type="number"  
               value={this.props.stateYear} 
               onChange={this.handleChange}/>
      </div>
    );
  }
}

class TotalsTable extends Component {
  render() {
    return (
      <table>
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
        {getPivotTableRows(this.props.yearData, this.props.stateYear)}
      </table>
    );
  }
}

function getPivotTableRows(yearData, stateYear) {
  if (!yearData) { return <tbody /> ;}
  var rows = [["Активный доход", "", "", "", "", "", "", "", "", "", "", "", ""],
              ["Рента", "", "", "", "", "", "", "", "", "", "", "", ""],
              ["Пассивный доход (общий), в т.ч.", "", "", "", "", "", "", "", "", "", "", "", ""],
              ["Реализованный доход", "", "", "", "", "", "", "", "", "", "", "", ""],
              ["Ленкин доход", "", "", "", "", "", "", "", "", "", "", "", ""],
              ["Расходы семьи", "", "", "", "", "", "", "", "", "", "", "", ""],
              ["Инвестиции", "", "", "", "", "", "", "", "", "", "", "", ""],
              ["Стоимость портфеля", "", "", "", "", "", "", "", "", "", "", "", ""],
              ["Стоимость чистых активов", "", "", "", "", "", "", "", "", "", "", "", ""]];

  yearData.forEach(function(item) {
    if (item.date.year === stateYear) {
      rows[0][item.date.month] = item.activeIncome;
      rows[1][item.date.month] = item.rentIncome;
      rows[2][item.date.month] = item.passiveIncomeTotal;
      rows[3][item.date.month] = item.passiveIncomeFixed;
      rows[4][item.date.month] = item.spouseIncome;
      rows[5][item.date.month] = item.expenses;
      rows[6][item.date.month] = item.investments;
      rows[7][item.date.month] = item.marketValue;
      rows[8][item.date.month] = item.netWorth;
    };
  });

  var rowItems = rows.map(function(item) {
    var row = item.map(function (rowItem, index) {
      return <td key={"column" + index.toString()}>{ rowItem }</td>;
    });
    return row;
  });
  var result = rowItems.map(function(item, index) {
    return <tr key={"row" + index.toString()}>{ item }</tr>
  })
  return <tbody>{result}</tbody>;
}

function getTotalsByMonth(year, cb) {
  return fetch('totalsByMonth?data.year=' + year, {
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

export default App;