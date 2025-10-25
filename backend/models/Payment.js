const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'USD'
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['stripe', 'telebirr', 'cbe', 'manual']
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    stripePaymentIntentId: String,
    stripeCustomerId: String,
    transactionId: String,
    description: String,
    metadata: Object
}, {
    timestamps: true
});

// Index for efficient queries
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ paymentStatus: 1 });
paymentSchema.index({ stripePaymentIntentId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Payment', paymentSchema);