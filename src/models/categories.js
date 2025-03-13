const {Model, DataTypes} = require('sequelize');

class categories extends Model {

    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            description: DataTypes.STRING
        }, {
            sequelize
        });
    }
}

module.exports = categories;