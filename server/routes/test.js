const express = require('express');
const crossSpawn = require('cross-spawn');
const async = require('async');

const router = express.Router();

router.get('/', function(req, res) {
    const argsFixedPart = ['-f', 'ledger.ledger'];
    let periodStr = 'jun';
    let args = {
        activeIncome: [ 'register', '-j', '-M' , '\"^Доходы:Актив\"', '-X', 'руб', '--invert', '--period', periodStr ],
        spouseIncome: [ 'register', '-j', '-M' , '\"^Доходы:Ленкин\"', '-X', 'руб', '--invert', '--period', periodStr ],
        expenses: [ 'register', '-j', '-M' , '\"^Расходы\"', '-X', 'руб', '--invert', '--period', periodStr ],
        assetsTransactions: [ 'register', '-M', '\"Инвестиции\"', '-B', '-X', 'руб', '--period', periodStr],
        // ledger -f ledger.ledger balance "Инвестиции" -e "2016/12/31" -V --price-db prices.db
        portfolio: [ 'balance', '\"Инвестиции\"', '-e', '\"2017\/06\/30\"', '-V', '--price-db', 'prices.db' ]
    };
    let opts = { cwd: 'C:\\Tools\\ledger\\data'};

    let finalResult = {};

    async.eachOf(args, handleLedgerResponse, finishProcessing);

    function handleLedgerResponse(args, key, callback) {
        console.log(args);
        let result = crossSpawn.spawn('C:\\Tools\\ledger\\ledger.exe', argsFixedPart.concat(args), opts);
        let output = '';
        let errorMessage = '';
        result.stdout.on('data', function(chunk) {
            output += chunk;
        });
        result.stdout.on('close', function() {
            finalResult[key] = output;
            callback();
        });
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

module.exports = router;