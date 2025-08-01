import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  email: string;
  avatarUrl?: string;
  education?: string;
  skills?: string[];
  applications: mongoose.Types.ObjectId[]; // references Application
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatarUrl: { type: String },
  education: { type: String },
  skills: [{ type: String }],
  applications: [{ type: Schema.Types.ObjectId, ref: 'Application' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
