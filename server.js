//require.paths.unshift(__dirname + "/vendor");
// to run http://aqoon.local:8000/stat?ip=128.121.50.133&title=Oberon%20Associates

process.addListener('uncoughtException', function(err, stack) {
	console.log('------------------');
	console.log('Exception ' + err);
	console.log(err.stack);
	console.log('------------------');
})

var LiveStats = require('./lib/livestats');

new LiveStats({
	port: 8000
})	

