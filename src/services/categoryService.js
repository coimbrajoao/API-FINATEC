const repository = require('../repository/categorieRepository');
const { existsOrError, } = require('../validation/validation');


class CategoryService {

    async create(category) {
        const { name, description } = category;


        const fields = { name, description };
        for (const field in fields) {
            existsOrError(fields[field], `The field ${field} is required`);
        }

        const categoryExists = await repository.getByName(name);
        if (categoryExists) {
            throw new Error("Category already exists");
        }

        const newCategory = await repository.create({ name, description });
        return newCategory;

    }

    async getAll(limit, offset) {
        const categories = await repository.getAll(limit, offset);
        const totalCategories = await repository.countAll();
        const totalPages = Math.ceil(totalCategories / parseInt(limit));

        return { categories, pagination: { page: 1, limit: parseInt(limit), offset, totalItems: totalCategories, totalPages } };
    }

    async update(id, updatedFields) {
        const category = await repository.getById(id);
        if (!category) {
            throw new Error("Category not found");
        }
        const updatedCategory = {}
        if (updatedFields.name) {
            updatedCategory.name = updatedFields.name;
        }
        if (updatedFields.description) {
            updatedCategory.description = updatedFields.description;
        }
        return await repository.update(id, updatedCategory);
    }

    async delete(id) {
        const category = await repository.getById(id);
        if (!category) {
            throw new Error("Category not found");
        }
        return await repository.delete(id);
    }

    async getById(id) {
        const category = await repository.getById(id);
        if (!category) {
            throw new Error("Category not found");
        }
        return category;
    }
}

module.exports = CategoryService;