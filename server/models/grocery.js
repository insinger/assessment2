// Model for groceries table
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("grocery_list", {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
		autoIncrement: true,
      allowNull: false
    },
    upc12: {
      type: DataTypes.BIGINT(12),
      allowNull: false
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    timestamps: false,
	 freezeTableName: true
  });
};
