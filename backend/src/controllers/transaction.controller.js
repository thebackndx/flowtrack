const mongoose = require("mongoose")
const transactionModel = require("../models/transaction.model")
const categoryModel = require("../models/category.model")

const addTransaction = async (req, res) => {
    try {
        const { type, amount, title, note, category } = req.body

        if (!type || !amount || !category || !title) {
            return res.status(400).json({
                message: "All fields are required."
            })
        }

        const categoryDoc = await categoryModel.findOne({
            _id: category,
            user: req.user.id
        })

        if (!categoryDoc) {
            return res.status(400).json({
                message: "Invalid category"
            })
        }

        if (categoryDoc.type != type) {
            return res.status(400).json({
                message: "Category type mismatch"
            })
        }

        const transcation = await transactionModel.create({
            user: req.user.id,
            type, amount, title, note, category
        })

        res.status(201).json({
            message: "Transaction succesfull",
            transcation
        })
    }
    catch (e) {
        return res.json({
            note: "Transaction unsuccessfull",
            message: e
        })
    }
}

const getTransaction = async (req, res) => {
    try {
        const transactions = await transactionModel.find({
            user: req.user.id,
        }).populate("category")

        res.status(200).json({
            message: "fetch succesfull",
            transactions
        })
    }
    catch (e) {
        res.status(500).json({
            message: "Fetching failed"
        })
    }
}

const deleteTransaction = async (req, res) => {
    try {
        const transcationID = req.params.id

        if (!mongoose.Types.ObjectId.isValid(transcationID)) {
            return res.status(400).json({
                message: "Invalid transaction id"
            })
        }

        const deleted = await transactionModel.findOneAndDelete({
            _id: transcationID,
            user: req.user.id
        })

        if (!deleted) {
            return res.status(404).json({
                message: "Transaction not found"
            })
        }

        res.status(200).json({
            message: "Transaction deleted successfully",
            transaction: deleted
        })

    }
    catch (e) {
        res.status(500).json({
            note: "Deletion failed",
            message: e
        })
    }
}

const updateTransaction = async (req, res) => {
    try {
        const transactionID = req.params.id

        if (!mongoose.Types.ObjectId.isValid(transactionID)) {
            return res.status(400).json({
                message: "Inavlid transaction id"
            })
        }

        const existing = await transactionModel.findOne({
            _id: transactionID,
            user: req.user.id
        })

        if (!existing) {
            return res.status(404).json({
                message: "Transaction not found"
            })
        }

        const newType = req.body.type || existing.type
        const newCategory = req.body.category || existing.category

        const categoryDoc = await categoryModel.findOne({
            _id: newCategory,
            user: req.user.id
        })

        if (!categoryDoc) {
            return res.status(400).json({
                message: "Invalid category"
            })
        }

        if (categoryDoc.type !== newType) {
            return res.status(400).json({
                message: "Category type mismatch"
            })
        }

        const updated = await transactionModel.findOneAndUpdate(
            { _id: transactionID, user: req.user.id },
            req.body,
            { returnDocument: "after" }
        )

        if (!updated) {
            return res.status(404).json({
                message: "Transaction not found"
            })
        }

        res.status(200).json({
            message: "Transaction updated successfully"
        })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Update failed"
        })
    }
}

const getSummary = async (req, res) => {
    try {
        const userId = req.user.id

        const sortBy = req.query.sortBy || "date"
        const order = req.query.order === "asc" ? 1 : -1

        const filter = { user: userId }

        if (req.query.range === "24h") {
            const last24h = new Date()
            last24h.setHours(last24h.getHours() - 24)
            filter.date = { $gte: last24h }
        }

        if (req.query.range === "7d") {
            const last7d = new Date()
            last7d.setDate(last7d.getDate() - 7)
            filter.date = { $gte: last7d }
        }

        if (req.query.range === "30d") {
            const last30d = new Date()
            last30d.setDate(last30d.getDate() - 30)
            filter.date = { $gte: last30d }
        }

        const transactions = await transactionModel
            .find(filter)
            .sort({ [sortBy]: order })

        const matchStage = {
            user: new mongoose.Types.ObjectId(req.user.id)
        }

        if (filter.date) {
            matchStage.date = filter.date
        }

        const result = await transactionModel.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" }
                }
            }
        ])

        let totalIncome = 0
        let totalExpense = 0

        result.forEach(item => {
            if (item._id === "income") totalIncome = item.total
            if (item._id === "expense") totalExpense = item.total
        })

        const balance = totalIncome - totalExpense

        res.status(200).json({
            summary: {
                totalIncome,
                totalExpense,
                balance
            },
            transactions
        })

    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Failed to fetch summary"
        })
    }
}


module.exports = { addTransaction, getTransaction, deleteTransaction, updateTransaction, getSummary }