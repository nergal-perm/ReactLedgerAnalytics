const fileReader = require('./file-reader');
const path = require('path');
const fs = require('fs');

module.exports.getYearOverview = function(year, cb) {
	
	// Проверим, что файлы найдены по указанному пути
	checkFilesAreFound((err, result) => {
		if(err) {
			cb(err);
			return;
		}
		cb(null, {
			message: result.message
		});		
	});
	// Сравним дату последнего разбора файлов с датой последнего изменения файлов
	//   Если дата последнего разбора меньше даты последнего изменения, то разберем файл еще раз
	//   Если дата последнего разбора больше даты последнего изменения, то приступим к созданию отчета
}


function checkFilesAreFound(cb) {
	var pathToFile = path.join(fileReader.getFilePath(), 'ledger.ledger');
	fs.access(pathToFile,  (err) => {
		if (err) {
			cb(err);
			return;
		} else {
			cb(null, {
				message: "Main ledger file was found at " + pathToFile
			});
			return;
		}
	});
}