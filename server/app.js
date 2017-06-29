const express = require('express');
const bodyParser = require('body-parser');

const testRoutes = require('./routes/test');

let port = process.env.PORT || 3001;
let app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api/test', testRoutes);

app.listen(port);
console.log('Magic happens on port ' + port);