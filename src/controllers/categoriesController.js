const repository = require('../repository/categorieRepository');
const { existsOrError, } = require('../validation/validation');


exports.post = async (req, res) => {
    const { name, description } = req.body;

    try {
        const fields = { name, description };
        for (const field in fields) {
            existsOrError(fields[field], `The field ${field} is required`);
        }

        const category = await repository.getByName(name);
        if (category) {
            return res.status(409).json({ error: "Category already exists" });
        }

        const newCategory = await repository.create({ name, description });
        return res.status(201).json(newCategory);

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.get = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Valores padrão: page = 1, limit = 10
    const offset = (page - 1) * parseInt(limit);

    try {
        // Supondo que o método getAll do repositório aceita `limit` e `offset`
        const categories = await repository.getAll(limit, offset);

        // Contar o total de categorias para calcular o total de páginas
        const totalCategories = await repository.countAll();
        const totalPages = Math.ceil(totalCategories / parseInt(limit));

        return res.status(200).json({
            categories,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                offset,
                totalItems: totalCategories,
                totalPages,
            },
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getById = async (req, res) => {
    const { id } = req.params;

    try {

        existsOrError(id, "The field id is required");
        const category = await repository.getById(id);

        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        return res.status(200).json(category);

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }

};

exports.put = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {

        existsOrError(id, "The field id is required");

        const getCategory = await repository.getById(id);

        if (!getCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (description) updatedFields.description = description;

        const updatedCategory = await repository.update(id, updatedFields);
        return res.status(200).json({ message: "Category updated successfully" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;


    try {
        existsOrError(id, "The field id is required");

        const getCategory = await repository.getById(id);

        if (!getCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        const deletedCategory = await repository.delete(id);
        return res.status(200).json({ message: "Category deleted successfully" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }

};