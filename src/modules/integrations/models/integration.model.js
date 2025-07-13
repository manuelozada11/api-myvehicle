import mongoose from 'mongoose';

const integrationSchema = new mongoose.Schema({
  owner_id: { type: String, required: true },
  activity_id: { type: String, required: true },
  aspect_type: { type: String, required: true },
  object_id: { type: String, required: true },
  created_at: { type: Date, required: true },
  gear_id: { type: String, required: true },
  distance: { type: Number, required: true }
}, { timestamps: true });

export const IntegrationModel = mongoose.model('integrations', integrationSchema);