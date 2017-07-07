const conf = require('nconf');
const Vector = require('../utils/Vector');

conf.argv()
    .env()
    .file('finance', { file: 'server/finance.json', search: true });

function getDashboardData() {
    const activeIncome = new Vector(conf.get('activeIncome').slice(-24));
    const portfolio = new Vector(conf.get('portfolio').slice(-24));
    const expenses = new Vector(conf.get('expenses').slice(-24));
    const monthlyProfit = activeIncome.subtract(expenses);
    const beginPortfolio = new Vector(conf.get('portfolio').slice(-25, -1));
    const invBuys = new Vector(conf.get('investmentBuys').slice(-24));
    const invSells = new Vector(conf.get('investmentSells').slice(-24));
    const passiveIncome = portfolio.subtract(invBuys).add(invSells).subtract(beginPortfolio);
    const netWorth = new Vector(conf.get('netWorth').slice(-24));

    console.log(portfolio.items);
    console.log(beginPortfolio.items);

    return [
        {paramName: 'Активный доход за месяц', firstValue: activeIncome.firstItem(), sparkData: activeIncome.items, valueThisMonth: activeIncome.lastItem()},
        {paramName: 'Расходы за месяц', firstValue: expenses.firstItem(), sparkData: expenses.items, valueThisMonth:expenses.lastItem()},
        {paramName: 'Активный доход минус расходы', firstValue: monthlyProfit.firstItem(), sparkData: monthlyProfit.items, valueThisMonth: monthlyProfit.lastItem()},
        {paramName: 'Пассивный доход', firstValue: passiveIncome.firstItem(), sparkData: passiveIncome.items, valueThisMonth: passiveIncome.lastItem()},
        {paramName: 'Портфель', firstValue: portfolio.firstItem(), sparkData: portfolio.items, valueThisMonth: portfolio.lastItem()},
        {paramName: 'Чистые активы', firstValue: netWorth.firstItem(), sparkData: netWorth.items, valueThisMonth: netWorth.lastItem()},
    ];
}


module.exports = {
    getDashboardData: getDashboardData
};