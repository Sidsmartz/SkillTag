import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication {
  _id: mongoose.Types.ObjectId;
  gig: {
    _id: mongoose.Types.ObjectId;
    title: string;
    company?: string;
    duration?: string;
    stipend?: string;
    location?: string;
    deadline?: string;
  };
  status: 'applied' | 'shortlisted' | 'selected' | 'completed';
  appliedAt: Date;
  bookmarked: boolean;
  boosted: boolean;
}

export interface IStudent extends Document {
  name: string;
  email: string;
  avatarUrl?: string;
  image?: string;
  description?: string;
  phone?: string;
  status?: string;
  gender?: string;
  dateOfBirth?: string;
  education?: string;
  skills?: string[];
  applications: IApplication[];
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema({
  gig: {
    _id: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    company: { type: String },
    duration: { type: String },
    stipend: { type: String },
    location: { type: String },
    deadline: { type: String },
  },
  status: { 
    type: String, 
    enum: ['applied', 'shortlisted', 'selected', 'completed'],
    default: 'applied'
  },
  appliedAt: { type: Date, default: Date.now },
  bookmarked: { type: Boolean, default: false },
  boosted: { type: Boolean, default: false },
});

const StudentSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatarUrl: { type: String },
  image: { type: String },
  description: { type: String },
  phone: { type: String },
  status: { type: String },
  gender: { type: String },
  dateOfBirth: { type: String },
  education: { type: String },
  skills: [{ type: String }],
  applications: [ApplicationSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
