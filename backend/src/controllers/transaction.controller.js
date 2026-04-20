const mongoose = require("mongoose")
const transactionModel = require("../models/transaction.model")

const addTransaction = async (req, res) => {
    try {
        const { type, amount, title, note, category, date } = req.body

        if (!type || !amount || !category || !title) {
            return res.status(400).json({
                message: "All fields are required."
            })
        }

        const transcation = await transactionModel.create({
            user: req.user.id,
            type, amount, title, note, category, date
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

        if(!mongoose.Types.ObjectId.isValid(transcationID)){
            return res.status(400).json({
                message : "Invalid transaction id"
            })
        }

        const deleted = await transactionModel.findOneAndDelete({
            _id : transcationID,
            user : req.user.id
        })

        if(!deleted){
            return res.status(404).json({
                message : "Transaction not found"
            })
        }

        res.status(200).json({
            message : "Transaction deleted successfully",
            transaction : deleted
        })

    }
    catch (e) {
        res.status(500).json({
            note: "Deletion failed",
            message : e
        })
    }
}

module.exports = { addTransaction, getTransaction, deleteTransaction }