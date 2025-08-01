import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  gig: mongoose.Types.ObjectId; // references Gig
  student: mongoose.Types.ObjectId; // references Student
  status: string; // e.g., 'applied', 'reviewed', 'accepted', 'rejected'
  appliedAt: Date;
  updatedAt: Date;
}

const ApplicationSchema: Schema = new Schema({
  gig: { type: Schema.Types.ObjectId, ref: 'Gig', required: true },
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  status: { type: String, default: 'applied' },
  appliedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);
