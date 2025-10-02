let mongoose = require('mongoose');

let schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Role name is required"],
        unique: true
    },
    description: {
        type: String,
        default: ""
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = new mongoose.model('role', schema)
