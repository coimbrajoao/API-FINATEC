const Category = require('../models/categories');


class CategoryRepository {

    async getAll(limit, offset) {
        const parsedLimit = Number(limit) || 10;
        const parsedOffset = Number(offset) || 1;
        return await Category.findAll({ parsedOffset, parsedLimit });
    }

    async countAll() {
        return await Category.count();
    }
    async getById(id) {
        return await Category.findByPk(id);
    }

    async create(category) {
        return await Category.create(category);
    }
 
    async update(id, updatedFields) {
        return await Category.update(updatedFields, { where: { id: id } });
    }

    async getByName(name) {
        return await Category.findOne({ where: { name } });
    }

    async delete(id) {
        return await Category.destroy({ where: { id } });
    }
}

module.exports = new CategoryRepository();