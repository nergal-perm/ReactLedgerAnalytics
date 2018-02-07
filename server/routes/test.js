const express = require('express');
const crossSpawn = require('cross-spawn');
const async = require('async');

const router = express.Router();

const dc = require('../controllers/dashboardController');


// Middleware for routers
/*
1. Нужно определить корректные аргументы дат для подстановки в запросы к ledger на основании параметра http-запроса
1. Может быть, вообще придется написать какой-то обобщенный конструктор запросов к ledger?
1. Возможно, по крайней мере, на первое время, нужно залогировать получившиеся запросы к ledger в консоль
1. Нужно получить данные от ledger и перенаправить их в парсеры, которые обработают их на основании rest-точки (типа пользовательского запроса)

 */

router.get('/dashboardDataMonth', function(req, res) {
    res.json({
        data: dc.getMonthData(),
        success: true
    });
});

router.get('/dashboardDataAverage', function(req, res) {
    res.json({
        data: dc.getAverageData(),
        success: true
    });
});

router.get('/dashboardDataRatios', function(req, res) {
    res.json({
        data: dc.getRatioData(),
        success: true
    })
});

let output = '';

const months = {
    jan: { full: '-01-31', short: '-01'},
    feb: { full: '-02-28', short: '-02'},
    mar: { full: '-03-31', short: '-03'},
    apr: { full: '-04-30', short: '-04'},
    may: { full: '-05-31', short: '-05'},
    jun: { full: '-06-30', short: '-06'},
    jul: { full: '-07-31', short: '-07'},
    aug: { full: '-08-31', short: '-08'},
    sep: { full: '-09-30', short: '-09'},
    oct: { full: '-10-31', short: '-10'},
    nov: { full: '-11-30', short: '-11'},
    dec: { full: '-12-31', short: '-12'}
}

router.get('/', function(req, res) {
    const WINDOWS_PATHS = {
        cwd: 'C:\\Tools\\ledger\\data',
        executable: 'C:\\Tools\\ledger\\ledger.exe'
    };
    const LINUX_PATHS = {
        cwd: '/home/eugene/Dropbox/Finance',
        executable: '/usr/bin/ledger'
    };
    
    const argsFixedPart = ['-f', 'ledger.txt'];
    console.log(JSON.stringify(req.query));
    let periodStr = req.query.year + months[req.query.month].short;
    let periodDate = req.query.year + months[req.query.month].full;
    let args = {
        activeIncome: [ 'register', '-J', '-M' , '\"^Доходы:Актив\"', '-X', 'руб', '--invert', '--period', periodStr ],
        passiveIncome: ['register', '-J', '-M', '\"^Доходы:Пассив\" and not \"Рента\"', '-X', 'руб', '--invert', '--period', periodStr],
        spouseIncome: [ 'register', '-J', '-M' , '\"^Доходы:Ленкин\"', '-X', 'руб', '--invert', '--period', periodStr ],
        expenses: [ 'register', '-J', '-M' , '\"^Расходы\"', '-X', 'руб', '--period', periodStr ],
        assetsTransactions: [ 'register', '-J', '-M', '\"Инвестиции\"', '-B', '-X', 'руб', '--period', periodStr],
        portfolio: [ 'balance', '\"Инвестиции\"', '-J', '-V', '--price-db', 'prices.db', '-e', periodDate ],
        netWorth: [ 'balance', '\"^Накопления\"', 'or', '\"^Активы\"', 'or', '\"Инвестиции\"', '-V', '--price-db', 'prices.db', '-e', periodDate, '-X', 'руб', '-J' ]
    };
    let opts = { cwd: LINUX_PATHS.cwd};

    let finalResult = {};

    async.eachOfSeries(args, handleLedgerResponse, finishProcessing);

    function handleLedgerResponse(args, key, callback) {
        let result = crossSpawn.spawn(LINUX_PATHS.executable, argsFixedPart.concat(args), opts);
        output = '';
        result.stdout.on('data', addChunk);
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
            finalResult.totalActiveIncome = finalResult.activeIncome + finalResult.spouseIncome;
            res.json({
                message: 'Completed successfully, see console',
                result: finalResult
            });
        }
    }

});

function addChunk(chunk) {
    output += chunk;
}


module.exports = router;