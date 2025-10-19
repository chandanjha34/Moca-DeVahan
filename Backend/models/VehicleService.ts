import mongoose, { Schema, Document } from "mongoose";

export interface IVehicleService extends Document {
  vehicleId: string;
  serviceHashes: string[];
}

const VehicleServiceSchema = new Schema<IVehicleService>({
  vehicleId: { type: String, required: true, unique: true },
  serviceHashes: { type: [String], default: [] },
});

export default mongoose.models.VehicleService ||
  mongoose.model<IVehicleService>("VehicleService", VehicleServiceSchema);
