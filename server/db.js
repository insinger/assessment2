var config = require('./config');
var Sequelize = require("sequelize");

// Create Sequelize DB connection
var sequelize = new Sequelize(
	config.DATABASE_NAME,
	config.MYSQL_USERNAME,
	config.MYSQL_PASSWORD,
	{
		host: config.MYSQL_HOSTNAME,
		port: config.MYSQL_PORT,
		logging: config.MYSQL_LOGGING,
		dialect: 'mysql',
		pool: {
			max: 5,
			min: 0,
			idle: 10000,
		},
	}
);

// Import DB Models - sequelize.import() returns a Sequelize Model object
const GroceryModel = sequelize.import('./models/grocery');

// Define Model Associations
// None - single table in this case

// Exports Models
module.exports = {
  Grocery: GroceryModel,
};
