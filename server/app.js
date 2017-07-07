const express = require('express');
const bodyParser = require('body-parser');

const testRoutes = require('./routes/test');

let port = process.env.PORT || 3001;
let app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/api/test', testRoutes);

app.listen(port);
console.log('Magic happens on port ' + port);