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

OrderSchema.virtual('answered').get(() => {
  if (!this.answerAt) {
    return false;
  }
  return true;
});

export default mongoose.model('Help_Order', OrderSchema);
