const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors");
const app = express();

require("dotenv").config()
const authMiddleware = require("./middlewares/auth.middleware")
const authRoutes = require("./routes/auth.route")
const testRoutes = require("./routes/test.route")
const transactionRoutes = require("./routes/transaction.route")
const categoryRoutes = require("./routes/category.route")

app.use(cors({
    origin: "https://flowtrack-beige.vercel.app/",
    credentials: true
}));
app.use(express.json())
app.use(cookieParser())


app.get("/", (req, res) => {
  res.send("Server is runing");
});

app.use("/api/auth", authRoutes)
app.use("/api/test", testRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/transaction", transactionRoutes)


module.exports = app
