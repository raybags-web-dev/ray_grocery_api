const express = require("express")
const router = express.Router();

//  helper functions
const { getAllGroceries, createGrocery, getGrocery, updateGrocery, deleteGrocery } = require("../controllers/grocery");

// get all tasks and create tasks (routers chained since routers use the same path. )
router.route("/").get(getAllGroceries).post(createGrocery);
// 'get task', 'update task' and 'delete task' routers chained since they use same path 
router.route("/:id").get(getGrocery).patch(updateGrocery).delete(deleteGrocery);

module.exports = router;