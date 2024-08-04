const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    name: {
        type: String,
        required: true   
    },
    count: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        bookedOnDate:{
            type:Date,
            default:Date.now()
        }
    },
    days: {
        type: Number,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listing: {
        type: Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    }
});

// Pre-save hook to calculate the number of days based on startDate and endDate
bookingSchema.pre('save', function(next) {
    if (this.date.startDate && this.date.endDate) {
        const timeDiff = Math.abs(this.date.endDate - this.date.startDate);
        this.days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    }
    next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
