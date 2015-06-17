#! /usr/bin/node

require('shelljs/global');
var _ = require('lodash');


 exec('du -sk *', {silent: true}, function(code, stdout) {
 	var struct = orderData(stdout);

 	var reducedStruct = reduceBytes(struct);

 	_.forEach(reducedStruct, function(file) {
 		console.log(file.adjusted + ' ' +  file.unit + '      ' + file.path_name);
 	});
 });


function reduceBytes(structuredData) {
	var struct = structuredData;

 	_.forEach(struct, function(file, idx) {
 		var unit;
 		var bytes = file.bytes * 1024;
 		if (bytes < 1024) {
 			unit = 'bytes';
 		} else if (bytes < 1024000) {
 			unit = 'KB';
 			bytes /= 1000;
 		} else if (bytes < 1024000000) {
 			unit = 'MB';
 			bytes /= 1000000;
 		} else if (bytes < 1024000000000) {
 			unit = 'GB';
 			bytes /= 1000000000;
 		}
 		struct[idx]['unit'] = unit;
 		struct[idx]['adjusted'] = bytes.toFixed(2);
 	});

 	return struct;
}


function orderData(stdout) {
	var lines = stdout.split('\n');
 	var newLines = '', 
 		arr = [];
 	
 	_.forEach(lines, function(line) {
 		newLines += line.split('\t').join(' ') + '-';
 	});
 	
 	newLines = _.compact(newLines.split('-'));

 	_.forEach(newLines, function(line) {
 		var obj = {}, duo = line.split(' ');
 		var bytes = obj['bytes'] = Number(duo[0]);
 		var path_name = obj['path_name'] = duo[1];
 		arr.push(obj);
 	});
 	return arr;
}