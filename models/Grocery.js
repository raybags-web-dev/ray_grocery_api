const mongoose = require("mongoose");
// task object 
const groceryObject = {
        name: {
            type: String,
            required: [true, "name is required"],
            trim: true,
            maxlength: [50, "name can\'t have more than 20 characters"],
            minlength: [3, "can\'t have less than 3 characters"]
        },
        term: {
            type: String,
            required: [true, "name is required"],
            trim: true,
            maxlength: [50, "term can\'t have more than 20 characters"],
            minlength: [3, "can\'t have less than 3 characters"]
        },
        department: {
            type: String,
            required: [true, "department name is required"],
            trim: true,
            maxlength: [50, "term can\'t have more than 20 characters"],
            minlength: [3, "can\'t have less than 3 characters"]
        },
        createdAt: {
            type: Date,
            immutable: true
        },
        details: {
            type: String,
            required: [true, "details required"],
            trim: true,
            maxlength: [200, "details  can\'t have more than 200 characters"],
            minlength: [3, "can\'t have less than 5 characters"]
        },
    }
    // task schema 
const GrocerySchema = new mongoose.Schema(groceryObject, { timestamps: true })
module.exports = mongoose.model('Grocery', GrocerySchema);