import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  content?: string;
  tags: string[];
  image: string;
  gallery?: string[];
  githubUrl?: string;
  demoUrl?: string;
  startDate?: Date;
  endDate?: Date;
  isOngoing: boolean;
  client?: string;
  role?: string;
  slug: string;
}

const ProjectSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String },
  tags: { type: [String], default: [] },
  image: { type: String, required: true },
  gallery: { type: [String], default: [] },
  githubUrl: { type: String },
  demoUrl: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  isOngoing: { type: Boolean, default: false },
  client: { type: String },
  role: { type: String },
  slug: { type: String, required: true, unique: true, index: true }
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
