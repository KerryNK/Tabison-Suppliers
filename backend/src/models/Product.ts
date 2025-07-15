import mongoose, { Schema, Document } from "mongoose";

export interface ICostBreakdown {
  item: string;
  cost: number;
}
export interface IProduct extends Document {
  name: string;
  category: "military" | "safety" | "official";
  material: "PVC" | "Rubber" | "Leather";
  height: 14 | 22;
  eyelets: number;
  imageUrl?: string;
  sellingPrice: { wholesale: number; retail: number };
  baseCost: number;
  materials: ICostBreakdown[];
  labour: ICostBreakdown[];
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ["military", "safety", "official"], required: true },
  material: { type: String, enum: ["PVC", "Rubber", "Leather"], required: true },
  height: { type: Number, enum: [14, 22], required: true },
  eyelets: { type: Number, required: true },
  imageUrl: String,
  sellingPrice: {
    wholesale: { type: Number, required: true },
    retail: { type: Number, required: true }
  },
  baseCost: { type: Number, required: true },
  materials: [{ item: String, cost: Number }],
  labour: [{ item: String, cost: Number }]
});

export default mongoose.model<IProduct>("Product", ProductSchema); 