const { existsOrError, } = require('../validation/validation');
const CategoryService = require('../services/categoryService');
const categoryService = new CategoryService();

exports.post = async (req, res) => {
    const { name, description } = req.body;

    try {
        const category = await categoryService.create({ name, description });
        return res.status(201).json({ message: "Category created successfully", category });
    } catch (err) {
     
        console.log(err);
        if (err.message === "Category already exists") {
            return res.status(409).json({ error: "Category already exists" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.get = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Valores padrão: page = 1, limit = 10
    const offset = (page - 1) * parseInt(limit);

    try {
        const result = await categoryService.getAll(limit, offset);
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getById = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await categoryService.getById(id);
        return res.status(200).json(category);
    } catch (err) {
        console.log(err);
        if (err.message === "Category not found") {
            return res.status(404).json({ error: "Category not found" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.put = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {

        existsOrError(id, "The field id is required");
        
        await categoryService.update(id, { name, description });
        return res.status(200).json({ message: "Category updated successfully" });
    } catch (err) {
        if (err.message === "Category not found") {
            return res.status(404).json({ error: "Category not found" });
        }
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;

    try {
        existsOrError(id, "The field id is required");

        await categoryService.delete(id);
        return res.status(200).json({ message: "Category deleted successfully" });

    } catch (err) {
        if (err.message === "Category not found") {
            return res.status(404).json({ error: "Category not found" });
        }
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }

};