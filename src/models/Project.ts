import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  tags: string[];
  image: string;
  startDate?: Date;
  endDate?: Date;
  isOngoing: boolean;
}

const ProjectSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], default: [] },
  image: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  isOngoing: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
