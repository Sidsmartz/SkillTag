import mongoose, { Schema, Document } from 'mongoose';

export interface IApplicant {
  _id: mongoose.Types.ObjectId;
  student: {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
  };
  status: 'applied' | 'shortlisted' | 'selected' | 'completed';
  appliedAt: Date;
  bookmarked: boolean;
  boosted: boolean;
}

export interface IGig extends Document {
  gigTitle: string;
  category: string;
  description: string;
  duration: string;
  stipend: string;
  location: string;
  requiredSkills: string[];
  requiredExperience: string;
  numberOfPositions: number;
  additionalRequirements?: string;
  applicationDeadline: string;
  agreeToTerms: boolean;
  skills: string[];
  datePosted: Date;
  status: string;
  applicants: IApplicant[];
}

const ApplicantSchema = new Schema({
  student: {
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
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

const GigSchema: Schema = new Schema({
  gigTitle: { type: String, required: true },
  category: { type: String },
  description: { type: String },
  duration: { type: String },
  stipend: { type: String },
  location: { type: String },
  requiredSkills: [{ type: String }],
  requiredExperience: { type: String },
  numberOfPositions: { type: Number },
  additionalRequirements: { type: String },
  applicationDeadline: { type: String },
  agreeToTerms: { type: Boolean },
  skills: [{ type: String }],
  datePosted: { type: Date, default: Date.now },
  status: { type: String, default: 'active' },
  applicants: [ApplicantSchema],
});

export default mongoose.models.Gig || mongoose.model<IGig>('Gig', GigSchema);
