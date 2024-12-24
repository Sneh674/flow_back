const express = require("express");
const router = express();
const { verifyAccessToken } = require("../helpers/jwt.js");
const { addNewField } = require("../controllers/app/tracker_controller.js");

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
  res.json({ userid: userId, message:"user home page" });
});

router.post("/home/addnewtracker",verifyAccessToken,addNewField)

module.exports = router;
