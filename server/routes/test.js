const express = require('express');
const crossSpawn = require('cross-spawn');
const async = require('async');
let conf = require('nconf');

const router = express.Router();

// Middleware for routers
/*
1. Нужно определить корректные аргументы дат для подстановки в запросы к ledger на основании параметра http-запроса
1. Может быть, вообще придется написать какой-то обобщенный конструктор запросов к ledger?
1. Возможно, по крайней мере, на первое время, нужно залогировать получившиеся запросы к ledger в консоль
1. Нужно получить данные от ledger и перенаправить их в парсеры, которые обработают их на основании rest-точки (типа пользовательского запроса)

 */

conf.argv()
    .env()
    .file({ file: 'server/finance.json', search: true });


router.get('/oldData', function(req, res) {
    var result = {
        periods: conf.get('periods').length,
        activeIncome: conf.get('activeIncome'),
        activeIncomeMA: conf.get('activeIncome').simpleSMA(12),
        investmentsBuys: conf.get('investmentBuys').length,
        investmentsSells: conf.get('investmentBuys').length,
        portfolio: conf.get('portfolio').length,
        netWorth: conf.get('netWorth').length
    };
    res.json({
        ma: conf.get('activeIncome').simpleSMA(12)
    });
});


router.get('/', function(req, res) {
    const argsFixedPart = ['-f', 'ledger.ledger'];
    let periodStr = 'jun';
    let args = {
        activeIncome: [ 'register', '-J', '-M' , '\"^Доходы:Актив\"', '-X', 'руб', '--invert', '--period', periodStr ],
        passiveIncome: ['register', '-J', '-M', '\"^Доходы:Пассив\" and not \"Рента\"', '-X', 'руб', '--invert', '--period', periodStr],
        spouseIncome: [ 'register', '-J', '-M' , '\"^Доходы:Ленкин\"', '-X', 'руб', '--invert', '--period', periodStr ],
        expenses: [ 'register', '-J', '-M' , '\"^Расходы\"', '-X', 'руб', '--period', periodStr ],
        assetsTransactions: [ 'register', '-J', '-M', '\"Инвестиции\"', '-B', '-X', 'руб', '--period', periodStr],
        portfolio: [ 'balance', '\"Инвестиции\"', '-J', '-V', '--price-db', 'prices.db', '-e', '2017-06-30' ],
        netWorth: [ 'balance', '\"^Накопления\"', 'or', '\"^Активы\"', 'or', '\"Инвестиции\"', '-V', '--price-db', 'prices.db', '-e', '2017-06-30', '-X', 'руб', '-J' ]
    };
    let opts = { cwd: 'C:\\Tools\\ledger\\data'};

    let finalResult = {};

    async.eachOf(args, handleLedgerResponse, finishProcessing);

    function handleLedgerResponse(args, key, callback) {
        console.log(args);
        let result = crossSpawn.spawn('C:\\Tools\\ledger\\ledger.exe', argsFixedPart.concat(args), opts);
        let output = '';
        result.stdout.on('data', function(chunk) {
            output += chunk;
        });
        result.stdout.on('close', function() {
            finalResult[key] = getValueFrom(output.split('\n'));
            callback();
        });
    }

    function getValueFrom(incomingArray) {
        if (Array.isArray(incomingArray) && incomingArray.length >= 2) {
            let foundValues = incomingArray[incomingArray.length - 2].match(/[+-]?([0-9]*[.])?[0-9]+$/g);
            if (foundValues.length > 0) {
                return Number.parseFloat(foundValues[foundValues.length-1]);
            }
        } else {
            return 0;
        }
    }

    function finishProcessing(err) {
        console.log('Finished');
        if(err) {
            res.json({message: 'Error'});
        } else {
            res.json({
                message: 'Completed successfully, see console',
                result: finalResult
            });
        }
    }

});

// Moving average calculation
// taken from https://rosettacode.org/wiki/Averages/Simple_moving_average#JavaScript
// subtly changed to reflect my algorithm
Array.prototype.simpleSMA=function(N) {
    return this.map(function(el,index, _arr) {
        return _arr.filter(function(x2,i2) {
            return i2 <= index && i2 > index - N;
        })
        .reduce(function(current, last){
            return (current + last);
        })/Math.min(index+1, N);
    });
};


module.exports = router;