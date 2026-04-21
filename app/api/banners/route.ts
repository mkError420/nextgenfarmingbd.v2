import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Banner from '@/lib/models/Banner';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

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
    await mongoose.connect(MONGODB_URI);
    
    const bannerData = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'image'];
    for (const field of requiredFields) {
      if (!bannerData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    
    // Set default order if not provided
    if (!bannerData.order) {
      const maxOrder = await Banner.findOne({}).sort({ order: -1 });
      bannerData.order = maxOrder ? maxOrder.order + 1 : 1;
    }
    
    const banner = new Banner(bannerData);
    await banner.save();
    
    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
  }
}
