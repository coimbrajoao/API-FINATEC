const User = require('../models/User');
class UserRepository {

    async CreateUser(user) {

        return await User.create(user);
    }

    async GetUserByCpf(cpf) {
        return await User.findOne({ where: { cpf } });
    }

    async GetUserByEmail(email) {
        return await User.findOne({ where: { email } });
    }
    async GetAllUsers() {
        return await User.findAll({ attributes: { where: { deletedAt: null  } } });
    }
    async GetUserById(id) {
        return (await User.findByPk(id));
    }

    async UpdateUser(id, updatedFields) {
        console.log(updatedFields, id);
        return await User.update(updatedFields, { where: { id: id } });
    }

    async DeleteUser() {
        return await User.destroy();
    }

}

module.exports = new UserRepository();