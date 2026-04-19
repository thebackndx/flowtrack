const express = require("express");
const dotenv = require("dotenv")
const authRouter = require("./routes/auth.route")

const app = express();

dotenv.config()
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is runing")
})

app.use("/api/auth", authRouter)


module.exports = app