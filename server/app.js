const express = require('express');
const reports = require('./controllers/reports');

const app = express();

app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/build'));
}

app.get('/api/welcome', (req, res) => {
    res.json([{
    	envVariable: process.env.NODE_ENV
    }]);
});

app.get('/api/yearoverview/:year', (req, res) => {
	reports.getYearOverview(req.params.year, (err, yearReport) => {
		if (err) {
			sendJsonResponse(res, 500, {message: err.message});
		} else {
			sendJsonResponse(res, 200, yearReport);
		}
	});
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});

function sendJsonResponse(res, status, content) {
	res.status(status);
	res.json(content);
}