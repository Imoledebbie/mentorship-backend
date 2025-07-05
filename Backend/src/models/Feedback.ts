import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  sessionId: mongoose.Types.ObjectId;
  menteeId: mongoose.Types.ObjectId;
  rating: number;
  comments: string;
  createdAt: Date;
}

const FeedbackSchema: Schema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
  menteeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comments: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
