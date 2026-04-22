import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/lib/models/User';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

export async function POST(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const { phone, name } = await request.json();
    
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Find or create user by phone number
    let user = await User.findOne({ phone });
    
    if (!user) {
      if (!name) {
        return NextResponse.json({ error: 'Name is required for new users' }, { status: 400 });
      }
      
      // Create new user
      user = new User({
        name,
        phone,
        role: 'user',
        isActive: true,
      });
      await user.save();
    }
    
    // Return user data without sensitive information
    const userData = {
      id: user._id.toString(),
      name: user.name,
      phone: user.phone,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    };
    
    return NextResponse.json(userData);
  } catch (error: any) {
    console.error('Error in customer login:', error);
    return NextResponse.json({ error: 'Login failed', details: error.message }, { status: 500 });
  }
}
