import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Banner from '@/lib/models/Banner';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const { id } = params;
    const updateData = await request.json();

    // Check if banner exists
    const banner = await Banner.findById(id);
    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    const updatedBanner = await Banner.findByIdAndUpdate(id, updateData, { new: true });
    
    return NextResponse.json(updatedBanner);
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
  } finally {
    await mongoose.disconnect();
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const { id } = params;

    // Check if banner exists
    const banner = await Banner.findById(id);
    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    await Banner.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  } finally {
    await mongoose.disconnect();
  }
}
