const Grocery = require("../models/Grocery");
const asyncMiddleware = require("../middleware/async");
const { createCustomError } = require("../errors/custom-error");

// create grocery
const createGrocery = asyncMiddleware(async(req, res) => {
    const grocery = await Grocery.create(req.body);
    res.status(201).json({ grocery });
})


// get all tasks
const getAllGroceries = asyncMiddleware(async(req, res) => {
    const all_groceries = await Grocery.find({});

    if (all_groceries.length < 1) return res.status(404).json({ "message": "grocery database is empty. Please save some groceries" });
    res.status(200).send(all_groceries);
})


// get grocery
const getGrocery = asyncMiddleware(async(req, res) => {
    // req id in params 
    const { id: groceryID } = req.params;
    // db document
    const grocery = await Grocery.findOne({ _id: groceryID });
    if (!grocery) return res.status(404).json({ "message": "Resource could not be found" });
    res.status(200).json({ grocery });
})


// delete grocery
const deleteGrocery = asyncMiddleware(async(req, res) => {
    // req id in params 
    const { id: groceryID } = req.params;
    // db document
    const grocery = await Grocery.findByIdAndDelete({ _id: groceryID });
    if (!grocery) return res.status(404).json({ "message": "Resource could not be found" });
    res.status(200).json(`grocery with id: ${groceryID} deleted successfully`);
})


// update grocery
const updateGrocery = asyncMiddleware(async(req, res) => {
    // req id in params 
    const { id: groceryID } = req.params;
    // db document
    const grocery = await Grocery.findByIdAndUpdate({ _id: groceryID }, req.body, { new: true, runValidators: true });
    if (!grocery) return res.status(404).json({ "message": "resource could not be found" });
    if (!req.body.name || !req.body.term || !req.body.details) return res.status(400).json({ "message": "some values missing. Fill-in missing values" });
    // destructure name and isCompleted values from the req.body object
    const { name, term } = req.body
    res.status(200).json({ id: groceryID, name, term, status: "success: update done!" });
})

module.exports = {
    getAllGroceries,
    createGrocery,
    getGrocery,
    updateGrocery,
    deleteGrocery,
};