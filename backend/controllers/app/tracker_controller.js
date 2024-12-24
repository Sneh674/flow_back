const createHTTPError = require("http-errors");

const addNewField = async (req, res, next) => {
  try {
    console.log(req.user.id);
    const userId = req.user.id;
    const {mainCategory, subCategory, desc, budget, amount, date, note}=req.body
    res.json({id: userId})
  } catch (error) {
    return next(createHTTPError(500, "Can't add new field"));
  }
};

module.exports = { addNewField };
