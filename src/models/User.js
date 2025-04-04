const {Model, DataTypes} = require('sequelize');

class User extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            cpf: DataTypes.STRING,
            password: DataTypes.STRING,
            admin: DataTypes.BOOLEAN,
            deletedAt:{
                type: DataTypes.DATE,
                allowNull: true,
                fields: 'deleted_at'
            }
        }, {
            sequelize,
            paranoid: true
        });
    }
    static associate(models) {
        this.hasMany(models.transaction, {foreignKey: 'user_id', as: 'transactions'});
    }
}

module.exports = User;