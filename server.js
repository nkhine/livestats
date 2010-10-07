require.paths.unshift(__dirname + "/vendor");

var LiveStats = require('./lib/livestats');

new LiveStats({
	port: 8000,
	geoipServer: {
		hostname: 'geoip.peepcode.com'
		, port: 80
	}
})	

