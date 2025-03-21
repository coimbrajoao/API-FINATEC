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

    static associate(models) {
        this.hasMany(models.transaction, {foreignKey: 'category_id', as: 'transactions'});
    }
}

module.exports = categories;