const express = require('express');
const crossSpawn = require('cross-spawn');

const router = express.Router();

router.get('/', function(req, res) {
    let args = [ '-f', 'ledger.ledger', 'register', '-M' , '\"^Доходы\"', '-X', 'руб', '--invert', '--period', '2017' ];
    let opts = { cwd: 'C:\\Tools\\ledger\\data'};
    let result = crossSpawn.spawn('C:\\Tools\\ledger\\ledger.exe', args, opts);
    let output = '';
    let errorMessage = '';
    result.stderr.on('data', function(chunk) {
        errorMessage += chunk;
    });
    result.stdout.on('data', function(chunk) {
        output += chunk;
    });
    result.stdout.on('close', function() {
        res.json({message: output.split("\n") || errorMessage});
    })
});

module.exports = router;