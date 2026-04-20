const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth.middleware")
const transactionController = require("../controllers/transaction.controller")

router.post("/", authMiddleware, transactionController.addTransaction)

router.get("/", authMiddleware, transactionController.getTransaction)

router.delete("/:id", authMiddleware, transactionController.deleteTransaction)

router.patch("/:id", authMiddleware, transactionController.updateTransaction)

module.exports = router