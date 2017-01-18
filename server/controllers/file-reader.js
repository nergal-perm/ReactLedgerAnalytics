const config = require('config');

module.exports.getFilePath = function() {
	return config.get('localFilePath');
}

