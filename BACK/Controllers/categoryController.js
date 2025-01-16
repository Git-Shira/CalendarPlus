const Category = require("../Models/Category");
const Event = require("../Models/Event");
const User = require("../Models/User");

// Get all categories
exports.getAllCategories = async (request, response) => {
    const userId = request.user._id;
    if (!userId) {
        return response.status(401).send('Access denied. No token provided.');
    }

    try {
        const categories = await Category.find({ userId: userId }).collation({ locale: 'en', strength: 1 }).sort({ name: 1 });
        if (!categories || categories.length === 0)
            return response.status(400).send({ error: "No categories found for this user" });

        response.status(200).send({ message: "All categories", categories: categories });
    } catch (error) {
        console.error(error);
        response.status(500).send({ error: "Something went wrong" });
    }
};

// Create a new category
exports.createCategory = async (request, response) => {
    const userId = request.user._id;
    if (!userId) {
        return response.status(401).send('Access denied. No token provided.');
    }
    const { name, color } = request.body;

    try {
        const existingCategory = await Category.findOne({ userId: userId, name: name });
        if (existingCategory) {
            return response.status(400).send({ message: "Category with this name already exists for this user" });
        }

        const category = new Category({
            userId,
            name,
            color: color || '' 
        });

        await category.save();

        await User.findByIdAndUpdate(
            userId,
            { $push: { categories: category._id } }, 
            { new: true }
        );

        response.status(200).send({ message: "Category created successfully", category: category });
    } catch (error) {
        console.error(error);
        response.status(500).send({ error: "An error occurred while creating the category" });
    }
};

// Update an existing category
exports.updateCategory = async (request, response) => {
    const userId = request.user._id;
    if (!userId) {
        return response.status(401).send('Access denied. No token provided.');
    }

    const id = request.params.id;
    const update = request.body;

    try {
        let user = await User.findOne({ _id: userId });
        if (!user)
            return response.status(404).send({ error: "User does not exist" });

        const category = await Category.findByIdAndUpdate(id, update, { new: true });
        if (!category)
            return response.status(400).send({ error: "Category does not exist" });

        response.status(200).send({ message: "Category updated successfully", category: category });
    } catch (error) {
        console.error(error);
        response.status(500).send({ error: "Something went wrong" });
    }
};

// Delete a category
exports.deleteCategory = async (request, response) => {
    const userId = request.user._id;
    if (!userId) {
        return response.status(401).send('Access denied. No token provided.');
    }
    const categoryId = request.params.id;

    try {
        const category = await Category.findByIdAndDelete(categoryId);
        if (!category) {
            return response.status(400).send({ message: "Category not found" });
        }

        await User.updateOne(
            { _id: userId },
            { $pull: { categories: categoryId } } 
        );

        await Event.updateMany(
            { category: categoryId },
            { $unset: { category: 1 } } 
        );

        response.status(200).send({ message: "Category deleted successfully", category: category });
    } catch (error) {
        console.error(error);
        response.status(500).send({ error: "An error occurred while deleting the category" });
    }
};
