const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true
    }
}, {
    timestamps: true
})

const categoryModel = mongoose.model("categories", categorySchema)

module.exports = categoryModel