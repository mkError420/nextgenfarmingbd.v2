import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Banner from '@/lib/models/Banner';
import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

// Helper function to compress image for mobile
const compressForMobile = async (imagePath: string): Promise<string> => {
  try {
    console.log('Compressing image for mobile:', imagePath);
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const parsedPath = path.parse(imagePath);
    const mobileFilename = `${parsedPath.name}-mobile${parsedPath.ext}`;
    const mobilePath = path.join(uploadsDir, mobileFilename);
    const sourcePath = path.join(process.cwd(), 'public', imagePath);
    
    console.log('Source path:', sourcePath);
    console.log('Mobile path:', mobilePath);
    
    // Check if source file exists
    const fs = require('fs');
    if (!fs.existsSync(sourcePath)) {
      console.error('Source image does not exist:', sourcePath);
      return imagePath;
    }
    
    // Compress for mobile: resize to max width 768px, quality 70%
    await sharp(sourcePath)
      .resize(768, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: 70 })
      .toFile(mobilePath);
    
    console.log('Compression successful:', mobileFilename);
    return `/uploads/${mobileFilename}`;
  } catch (error) {
    console.error('Error compressing image for mobile:', error);
    return imagePath; // Return original if compression fails
  }
};

export async function GET(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position');
    const isActive = searchParams.get('isActive');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    let query: any = {};
    if (position) {
      query.position = position;
    }
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }
    
    const banners = await Banner.find(query)
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .skip(offset);
    
    const total = await Banner.countDocuments(query);
    
    return NextResponse.json({ 
      banners,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Starting banner creation...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const bannerData = await request.json();
    console.log('Received banner data:', JSON.stringify(bannerData, null, 2));
    
    // Validate required fields
    const requiredFields = ['title', 'image'];
    for (const field of requiredFields) {
      if (!bannerData[field]) {
        console.error(`Missing required field: ${field}`);
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    
    // Compress image for mobile (temporarily disabled for debugging)
    if (bannerData.image) {
      console.log('Skipping image compression for debugging...');
      bannerData.mobileImage = bannerData.image; // Use same image for now
      // bannerData.mobileImage = await compressForMobile(bannerData.image);
    }
    
    // Set default order if not provided
    if (!bannerData.order) {
      console.log('Setting default order...');
      const maxOrder = await Banner.findOne({}).sort({ order: -1 });
      bannerData.order = maxOrder ? maxOrder.order + 1 : 1;
      console.log('Order set to:', bannerData.order);
    }
    
    console.log('Creating banner document...');
    const banner = new Banner(bannerData);
    await banner.save();
    console.log('Banner saved successfully');
    
    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json({ error: 'Failed to create banner', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
