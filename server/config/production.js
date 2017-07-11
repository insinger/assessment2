'use strict';
var fs=require("fs");

console.log("NODE_ENV: * production *");


function must_get_env(key) {
	var val=process.env[key];
	if (!val) {
		var msg="Aborting startup due to missing environment variable '"+key+"'";
		// ensure message is written before program is terminated by process.exit()
		fs.writeSync(1,msg+"\n"); // stdout
		fs.writeSync(2,msg+"\n"); // stderr
		process.exit(1);
	}
	return val;
}

module.exports = {
  domain_name: "http://localhost:3000",
  PORT: 3000,

  DATABASE_NAME: must_get_env("CONFIG_"+"DATABASE_NAME"),
  MYSQL_USERNAME: must_get_env("CONFIG_"+"MYSQL_USERNAME"),
  MYSQL_PASSWORD: must_get_env("CONFIG_"+"MYSQL_PASSWORD");
  MYSQL_HOSTNAME: must_get_env("CONFIG_"+"MYSQL_HOSTNAME");
  MYSQL_PORT:     must_get_env("CONFIG_"+"MYSQL_PORT");
  MYSQL_LOGGING: console.log,

  version: '1.0.0'
};
