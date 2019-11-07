import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    student_id: {
      type: Number,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
    },
    answerAt: {
      type: Date,
    },
    answered: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

export default mongoose.model('Help_Order', OrderSchema);
