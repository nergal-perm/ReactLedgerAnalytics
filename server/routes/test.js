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
    jan: '-01-31',
    feb: '-02-28',
    mar: '-03-31',
    apr: '-04-30',
    may: '-05-31',
    jun: '-06-30',
    jul: '-07-31',
    aug: '-08-31',
    sep: '-09-30',
    oct: '-10-31',
    nov: '-11-30',
    dec: '-12-31'
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
    let periodStr = req.query.month;
    let periodDate = req.query.year + months[req.query.month];
    let args = {
        activeIncome: [ 'register', '-J', '-M' , '\"^Доходы:Актив\"', '-X', 'руб', '--invert', '--period', periodStr ],
        passiveIncome: ['register', '-J', '-M', '\"^Доходы:Пассив\" and not \"Рента\"', '-X', 'руб', '--invert', '--period', periodStr],
        spouseIncome: [ 'register', '-J', '-M' , '\"^Доходы:Ленкин\"', '-X', 'руб', '--invert', '--period', periodStr ],
        expenses: [ 'register', '-J', '-M' , '\"^Расходы\"', '-X', 'руб', '--period', periodStr ],
        assetsTransactions: [ 'register', '-J', '-M', '\"Инвестиции\"', '-B', '-X', 'руб', '--period', periodStr],
        portfolio: [ 'balance', '\"Инвестиции\"', '-J', '-V', '--price-db', 'prices.db', '-e', periodDate ],
        netWorth: [ 'balance', '\"^Накопления\"', 'or', '\"^Активы\"', 'or', '\"Инвестиции\"', '-V', '--price-db', 'prices.db', '-e', '2017-06-30', '-X', 'руб', '-J' ]
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