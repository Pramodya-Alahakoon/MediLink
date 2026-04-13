import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      required: [true, 'Payment ID is required'],
      index: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    fee: {
      type: Number,
      default: 0,
    },
    netAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['initiated', 'processing', 'success', 'failed', 'cancelled'],
      default: 'initiated',
    },
    stripeEventId: {
      type: String,
      unique: true,
      sparse: true,
    },
    errorMessage: String,
    retryCount: {
      type: Number,
      default: 0,
    },
    metadata: {
      ipAddress: String,
      userAgent: String,
    },
  },
  {
    timestamps: true,
    indexes: [{ paymentId: 1, createdAt: -1 }],
  }
);

export default mongoose.model('Transaction', transactionSchema);
