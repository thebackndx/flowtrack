const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const generateToken = require("../utils/generateToken")
const { mongo, default: mongoose } = require("mongoose")

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            })
        }

        const userExist = await userModel.findOne({ email })

        if (userExist) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword
        })

        const token = generateToken(user._id)

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })

        res.status(201).json({
            message: "User registered successfully",
            user: user,
            token: token
        })
    }
    catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message : "All fields are required"
            })
        }

        const user = await userModel.findOne({email})

        if(!user) {
            return res.status(400).json({
                message : "Invalid credentials"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return res.status(400).json({
                message : "Invalid credentials"
            })
        }

        const token = generateToken(user._id)

        res.cookie("token", token, {
            httpOnly : true,
            secure: false,
            sameSite : "lax"
        })

        res.status(200).json({
            message : "Login successfull.",
            user : user,
            token
        })

    }
    catch(e){
        res.status(500).json({
            message : e
        })
    }


}

module.exports = {
    registerUser, loginUser
}