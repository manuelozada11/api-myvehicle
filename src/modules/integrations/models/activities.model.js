import mongoose from 'mongoose';

const activitiesSchema = new mongoose.Schema({
  userExtId: { type: String, required: true },
  integrationName: { type: String, required: true },
  activityId: { type: String, required: true },
  vehicleExtId: { type: String },
  distance: { type: Number },
  createdAt: { type: Date },
}, { timestamps: true }, { transform: (doc, ret) => {
  delete ret.__v;
  return ret;
}});

export const ActivitiesModel = mongoose.model('activitie', activitiesSchema);