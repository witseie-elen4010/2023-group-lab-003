const mongoose = require('mongoose');

const loggingSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    action:{
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const Log = mongoose.model('Log', loggingSchema);
module.exports = Log;
