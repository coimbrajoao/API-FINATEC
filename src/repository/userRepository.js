const User = require('../models/user');
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
    async GetAllUsers(offset, limit) {
        const parsedOffset = Number(offset) || 0;
        const parsedLimit = Number(limit) || 10; // Define um valor padrão
        const ofset =(parsedOffset - 1) * parsedLimit;
        return await User.findAndCountAll({ where: { deletedAt: null }, offset: ofset, limit: parsedLimit });
    }

    async GetUserById(id) {
        return (await User.findByPk(id));
    }

    async UpdateUser(id, updatedFields) {
        console.log(updatedFields, id);
        return await User.update(updatedFields, { where: { id: id } });
    }

}

module.exports = new UserRepository();