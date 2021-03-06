const conf = require('nconf');
const Vector = require('../utils/Vector');
const Format = require('../utils/Formatter');

conf.argv()
    .env()
    .file('finance', { file: 'server/finance.json', search: true });

/*
    Массивы данных для последующей обработки
 */
const helpVectors = {
    portfolio: new Vector(conf.get('portfolio').slice(1)),
    portfolioBegin: new Vector(conf.get('portfolio').slice(0,-1)),
    invBuys: new Vector(conf.get('investmentBuys').slice(1)),
    invSells: new Vector(conf.get('investmentSells').slice(1))
};

const history = {
    activeIncome: conf.get('activeIncome'),
    expenses: conf.get('expenses'),
    monthlyProfit: new Vector(conf.get('activeIncome')).subtract(new Vector(conf.get('expenses'))).items,
    portfolio: conf.get('portfolio').slice(1),
    portfolioBegin: conf.get('portfolio').slice(0,-1),
    invBuys: conf.get('investmentBuys').slice(1),
    invSells: conf.get('investmentSells').slice(1),
    passiveIncome: helpVectors.portfolio.subtract(helpVectors.invBuys).add(helpVectors.invSells).subtract(helpVectors.portfolioBegin).items,
    netWorth: conf.get('netWorth')
};

const portfolioAverage = new Vector(new Vector(history.portfolio).simpleSMA(12));
const netWorth = new Vector(history.netWorth.slice(-24));
const averageExpenses = new Vector(new Vector(history.expenses).simpleSMA(12).slice(-24));
const averagePassiveIncome = new Vector(new Vector(history.passiveIncome).simpleSMA(12).slice(-24));

function getMonthData() {
    const activeIncome = new Vector(history.activeIncome.slice(-24));
    const expenses = new Vector(history.expenses.slice(-24));
    const monthlyProfit = new Vector(history.monthlyProfit.slice(-24));
    const passiveIncome = new Vector(history.passiveIncome.slice(-24));
    const portfolio = new Vector(history.portfolio.slice(-24));


    return [{
        paramName: 'Активный доход за месяц',
        firstValue: Format.asThousands(activeIncome.firstItem()),
        sparkData: activeIncome.items,
        valueThisMonth: Format.asThousands(activeIncome.lastItem())
    }, {
        paramName: 'Расходы за месяц',
        firstValue: Format.asThousands(expenses.firstItem()),
        sparkData: expenses.items,
        valueThisMonth: Format.asThousands(expenses.lastItem())
    }, {
        paramName: 'Активный доход минус расходы',
        firstValue: Format.asThousands(monthlyProfit.firstItem()),
        sparkData: monthlyProfit.items,
        valueThisMonth: Format.asThousands(monthlyProfit.lastItem())
    }, {
        paramName: 'Пассивный доход',
        firstValue: Format.asThousands(passiveIncome.firstItem()),
        sparkData: passiveIncome.items,
        valueThisMonth: Format.asThousands(passiveIncome.lastItem())
    }, {
        paramName: 'Портфель',
        firstValue: Format.asThousands(portfolio.firstItem()),
        sparkData: portfolio.items,
        valueThisMonth: Format.asThousands(portfolio.lastItem())
    }, {
        paramName: 'Чистые активы',
        firstValue: Format.asThousands(netWorth.firstItem()),
        sparkData: netWorth.items,
        valueThisMonth: Format.asThousands(netWorth.lastItem())
    }];
}

function getAverageData() {
    const activeIncome = new Vector(new Vector(history.activeIncome).simpleSMA(12).slice(-24));
    const monthlyProfit = new Vector(new Vector(history.monthlyProfit).simpleSMA(12).slice(-24));
    const passiveIncomeRate = averagePassiveIncome.divideByVector(portfolioAverage).multiplyByNumber(24);

    return [{
        paramName: 'Средний активный доход',
        firstValue: Format.asThousands(activeIncome.firstItem()),
        sparkData: activeIncome.items,
        valueThisMonth: Format.asThousands(activeIncome.lastItem())
    }, {
        paramName: 'Средняя величина расходов',
        firstValue: Format.asThousands(averageExpenses.firstItem()),
        sparkData: averageExpenses.items,
        valueThisMonth: Format.asThousands(averageExpenses.lastItem())
    }, {
        paramName: 'Средний доход - средний расход',
        firstValue: Format.asThousands(monthlyProfit.firstItem()),
        sparkData: monthlyProfit.items,
        valueThisMonth: Format.asThousands(monthlyProfit.lastItem())
    }, {
        paramName: 'Средний пассивный доход',
        firstValue: Format.asThousands(averagePassiveIncome.firstItem()),
        sparkData: averagePassiveIncome.items,
        valueThisMonth: Format.asThousands(averagePassiveIncome.lastItem())
    }, {
        paramName: 'Средняя доходность',
        firstValue: Format.asPercent(passiveIncomeRate.firstItem(),2),
        sparkData: passiveIncomeRate.items,
        valueThisMonth: Format.asPercent(passiveIncomeRate.lastItem(),2)
    }];
}

function getRatioData() {
    let initialIncome = 429078.15;
    const cumulativeActiveIncome = new Vector(history.activeIncome.map(function(item) {
        return initialIncome += item;
    }));
    const wealthRatio = new Vector(new Vector(history.portfolio).divideByVector(cumulativeActiveIncome).items.slice(-24));
    const safetyMarginRatio = netWorth.divideByVector(averageExpenses);
    const independenceRatio = averagePassiveIncome.divideByVector(averageExpenses);

    return [{
        paramName: 'Индекс богатства',
        firstValue: Format.asPercent(wealthRatio.firstItem()),
        sparkData: wealthRatio.items,
        valueThisMonth: Format.asPercent(wealthRatio.lastItem())
    }, {
        paramName: 'Запас прочности',
        firstValue: Format.asUnits(safetyMarginRatio.firstItem(), 2, 'мес.'),
        sparkData: safetyMarginRatio.items,
        valueThisMonth: Format.asUnits(safetyMarginRatio.lastItem(), 2, 'мес.')
    }, {
        paramName: 'Независимость',
        firstValue: Format.asPercent(independenceRatio.firstItem()),
        sparkData: independenceRatio.items,
        valueThisMonth: Format.asPercent(independenceRatio.lastItem())
    }];
}

module.exports = {
    getMonthData: getMonthData,
    getAverageData: getAverageData,
    getRatioData: getRatioData
};