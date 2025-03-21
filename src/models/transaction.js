const {Model, DataTypes} = require('sequelize');

class Transaction extends Model {
    static init(sequelize) {
        super.init({
            value: DataTypes.DECIMAL(10, 2),
            description: DataTypes.STRING,
            type: DataTypes.ENUM('credit', 'debit'),
            category_id: DataTypes.INTEGER,
            user_id: DataTypes.INTEGER
        }, {
            sequelize
        });
    }
    static associations(models) {
        this.belongsTo(models.category, {foreignKey: 'category_id', as: 'category'});
        this.belongsTo(models.user, {foreignKey: 'user_id', as: 'user'}); 
    }

}

module.exports = Transaction;