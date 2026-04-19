const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user,
        required: true
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    note: {
        type: String,
        default: "",
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: category,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true
})

const transactionModel = mongoose.model("transactions", transactionSchema)

module.exports = transactionModel