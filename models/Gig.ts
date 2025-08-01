import mongoose, { Schema, Document } from 'mongoose';

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
  applications: mongoose.Types.ObjectId[]; // references Application
  applicants: mongoose.Types.ObjectId[]; // references Student
}

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
  applications: [{ type: Schema.Types.ObjectId, ref: 'Application' }],
  applicants: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
});

export default mongoose.models.Gig || mongoose.model<IGig>('Gig', GigSchema);
