const mongoose = require("mongoose")
const categoryModel = require("../models/category.model")
const transactionModel = require("../models/transaction.model")

const addCategory = async (req, res) => {
    try {
        const { name, type } = req.body

        if (!name || !type) {
            return res.status(400).json({
                message: "All fields are required."
            })
        }

        const category = await categoryModel.create({
            user: req.user.id,
            name, type
        })

        res.status(201).json({
            message: "New category created",
            category
        })
    }
    catch (e) {
        res.status(500).json({
            note: "Category creation unsuccesfull",
            message: e
        })
    }
}

const getCategory = async (req, res) => {
    try {
        const categories = await categoryModel.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Fetch succesull",
            categories
        })
    }
    catch (e) {
        res.status(200).json({
            message: e.message,
            note: "fetch failed"
        })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const categoryID = req.params.id

        if (!mongoose.Types.ObjectId.isValid(categoryID)) {
            return res.status(400).json({
                message: "Invalid category ID"
            })
        }

        const category = await categoryModel.findOne({
            _id: categoryID,
            user: req.user.id
        })

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            })
        }

        const transaction = await transactionModel.deleteMany({
            category: categoryID,
            user: req.user.id
        })

        await categoryModel.findByIdAndDelete(categoryID)

        res.status(200).json({
            message: `Category and related ${transaction.deletedCount} transaction deleted`
        })

    }
    catch (e) {
        res.status(500).json({
            note: "Message deletion failed",
            message: e.message
        })
    }
}

const updateCategoryName = async (req, res) => {
    try {
        const categoryID = req.params.id

        if (!mongoose.Types.ObjectId.isValid(categoryID)) {
            return res.status(400).json({
                message: "Invalid ID"
            })
        }

        const name = req.body.name

        if (!name) {
            return res.status(400).json({
                message: "Name is required"
            })
        }

        const updated = await categoryModel.findOneAndUpdate(
            { _id: categoryID, user: req.user.id },
            { name }, { returnDocument: "after" }
        )

        if (!updated) {
            return res.status(404).json({
                message: "category not found"
            })
        }

        res.status(200).json({
            message: "Category updated successfully",
            category: updated
        })
    }
    catch (e) {
        if (e.code === 11000) {
            return res.status(400).json({
                message: "Category name already exists"
            })
        } else {
            console.log(e)
            return res.status(500).json({
                message: "Update failed"
            })
        }
    }
}

module.exports = { addCategory, getCategory, deleteCategory, updateCategoryName }