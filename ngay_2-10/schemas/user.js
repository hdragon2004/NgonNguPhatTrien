let mongoose = require('mongoose');

let schema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    fullName: {
        type: String,
        default: ""
    },
    avatarUrl: {
        type: String,
        default: ""
    },
    status: {
        type: Boolean,
        default: false
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role',
        required: true
    },
    loginCount: {
        type: Number,
        default: 0,
        min: 0
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = new mongoose.model('user', schema)
