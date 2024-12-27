const express = require("express");
const router = express();
const { verifyAccessToken } = require("../helpers/jwt.js");
const { addNewField, showAllTransactions, editTransaction, editSubCategory } = require("../controllers/app/tracker_controller.js");
const {deleteTransaction, deleteSubCategory}= require("../controllers/app/tracker_controller2.js");

/**
 * @openapi
 * /home:
 *   get:
 *     summary: Get user ID from the home route
 *     description: This endpoint retrieves the user ID from the authenticated user after verifying the access token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userid:
 *                   type: string
 *                   description: The user ID of the authenticated user.
 *       401:
 *         description: Unauthorized, invalid or missing access token
 *       500:
 *         description: Server error during the process
 */
router.get("/home", verifyAccessToken, (req, res) => {
  const userId = req.user.id;
  res.json({ userid: userId, message: "user home page" });
});

/**
 * @openapi
 * /home/addnewtracker:
 *   post:
 *     summary: Add a new tracker field (main category, subcategory, or transaction)
 *     description: Creates a new main category, subcategory, or appends transactions to an existing subcategory for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mainCategory:
 *                 type: string
 *                 description: The main category name (e.g., inflow, outflow, savings).
 *                 example: inflow
 *               subCategory:
 *                 type: string
 *                 description: The subcategory name (e.g., Salary, Petrol).
 *                 example: Salary
 *               desc:
 *                 type: string
 *                 description: A description for the subcategory.
 *                 example: Monthly salary deposit
 *               budget:
 *                 type: number
 *                 description: The budget amount for the subcategory (optional for inflow).
 *                 example: 5000
 *               amount:
 *                 type: number
 *                 description: The transaction amount.
 *                 example: 1000
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: The transaction date and time.
 *                 example: 2024-12-25T10:00:00Z
 *               note:
 *                 type: string
 *                 description: Additional notes for the transaction (optional).
 *                 example: Bonus payment
 *     responses:
 *       201:
 *         description: Successfully created a new main category or added data to an existing one.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: New main category created
 *                 data:
 *                   type: object
 *                   description: The updated or newly created CashFlow document.
 *       200:
 *         description: Successfully updated the existing category or subcategory.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Field updated successfully
 *                 data:
 *                   type: object
 *                   description: The updated CashFlow document.
 *       401:
 *         description: Unauthorized, invalid or missing access token.
 *       500:
 *         description: Server error during the process.
 */
router.post("/home/addnewtracker", verifyAccessToken, addNewField);
router.get("/home/showAllTransactions", verifyAccessToken, showAllTransactions);

// router.patch("/home/:mainCategory/:subCategory/:dateTransaction", verifyAccessToken, editTransaction);
router.patch("/home/:mainCategory/:subCategory/:transactionId", verifyAccessToken, editTransaction);

router.patch("/home/:mainCategory/:subCategory", verifyAccessToken, editSubCategory);

router.delete("/home/:mainCategory/:id",verifyAccessToken,deleteSubCategory)
router.delete("/home/:mainCategory/:subCategory/:id",verifyAccessToken,deleteTransaction)

module.exports = router;
