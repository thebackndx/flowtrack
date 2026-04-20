const mongoose = require("mongoose")
const categoryModel = require("../models/category.model")
const transactionModel= require("../models/transaction.model")

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
        })

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
    try{
        const categoryID = req.params.id

        if(!mongoose.Types.ObjectId.isValid(categoryID)) {
            return res.status(400).json({
                message : "Invalid category ID"
            })
        }

        const category = await categoryModel.findOne({
            _id : categoryID,
            user : req.user.id
        })

        if(!category) {
            return res.status(404).json({
                message : "Category not found"
            })
        }

        const transaction = await transactionModel.deleteMany({
            category : categoryID,
            user : req.user.id
        })

        await categoryModel.findByIdAndDelete(categoryID)

        res.status(200).json({
            message : `Category and related ${transaction.deletedCount} transaction deleted`
        })

    }
    catch(e){
        res.status(500).json({
            note : "Message deletion failed",
            message : e.message
        })
    }
}

module.exports = { addCategory, getCategory, deleteCategory }