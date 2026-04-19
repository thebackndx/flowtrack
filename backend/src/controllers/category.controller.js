const categoryModel = require("../models/category.model")

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
            message : "New category created",
            category
        })
    }
    catch (e) {
        res.status(500).json({
            note : "Category creation unsuccesfull",
            message : e
        })
    }
}

module.exports = { addCategory }