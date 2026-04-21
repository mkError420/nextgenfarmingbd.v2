import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  name_en: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  weight?: string;
  inStock: boolean;
  description?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  name_en: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  oldPrice: {
    type: Number,
    min: 0,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0,
  },
  weight: {
    type: String,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
  },
  tags: [{
    type: String,
  }],
}, {
  timestamps: true,
});

// Create indexes for better performance
ProductSchema.index({ category: 1, createdAt: -1 });
ProductSchema.index({ name: 'text', name_en: 'text' });
ProductSchema.index({ price: 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
