import React, { Component } from 'react';

var totalsByMonth = [{
  id: 201701,
  date: {
    year: 2017,
    month: 1
  },
  activeIncome: 100000,
  rentIncome: 5000,
  passiveIncomeTotal: 400,
  passiveIncomeFixed: 150,
  spouseIncome: 1000,
  expenses: 30000,
  investments: 22000,
  marketValue: 88000,
  netWorth: 150000
}, {
  id: 201702,
  date: {
    year: 2016,
    month: 2
  },
  activeIncome: 50000,
  rentIncome: 5000,
  passiveIncomeTotal: 400,
  passiveIncomeFixed: 150,
  spouseIncome: 1000,
  expenses: 30000,
  investments: 22000,
  marketValue: 88000,
  netWorth: 150000
}, {
  id: 201703,
  date: {
    year: 2017,
    month: 3
  },    
  activeIncome: 125000,
  rentIncome: 5000,
  passiveIncomeTotal: 400,
  passiveIncomeFixed: 150,
  spouseIncome: 1000,
  expenses: 30000,
  investments: 22000,
  marketValue: 88000,
  netWorth: 150000
}];


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
    this.setState({
      year:parseInt(event.target.value, 10)
    });
  }

  render() {
    return (
      <div>
        <YearFilter stateYear={this.state.year} onUserInput={this.handleUserInput}/>
        <TotalsTable yearData={totalsByMonth} stateYear={this.state.year}/>
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
    console.log('Iterating... ' + typeof item.date.year + ' vs. ' + typeof stateYear);
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

export default App;