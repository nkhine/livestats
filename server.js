require.paths.unshift(__dirname + "/vendor");

process.addListener('uncoughtException', function(err, stack) {
	console.log('------------------');
	console.log('Exception ' + err);
	console.log(err.stack);
	console.log('------------------');
};
	
	);
var LiveStats = require('./lib/livestats');

new LiveStats({
	port: 8000,
	geoipServer: {
		hostname: 'geoip.peepcode.com'
		, port: 80
	}
})	

