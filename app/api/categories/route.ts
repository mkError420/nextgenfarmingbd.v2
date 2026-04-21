import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Category from '@/lib/models/Category';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

export async function GET(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  } finally {
    await mongoose.disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const categoryData = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'name_en', 'icon'];
    for (const field of requiredFields) {
      if (!categoryData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const category = new Category(categoryData);
    await category.save();
    
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  } finally {
    await mongoose.disconnect();
  }
}
