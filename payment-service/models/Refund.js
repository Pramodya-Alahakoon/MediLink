import mongoose from 'mongoose';

const refundSchema = new mongoose.Schema(
  {
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      required: [true, 'Payment ID is required'],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Refund amount is required'],
    },
    reason: {
      type: String,
      enum: ['customer_request', 'duplicate', 'fraudulent', 'service_quality', 'other'],
      required: [true, 'Refund reason is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    stripeRefundId: {
      type: String,
      unique: true,
      sparse: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    approvedBy: mongoose.Schema.Types.ObjectId,
    notes: String,
    failureReason: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Refund', refundSchema);
