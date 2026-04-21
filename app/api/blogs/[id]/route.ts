import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Blog from '@/lib/models/Blog';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const { id } = params;
    const updateData = await request.json();

    // Check if blog exists
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // If status is being changed to published and not already published, set publishedAt
    if (updateData.status === 'published' && blog.status !== 'published' && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
    
    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  } finally {
    await mongoose.disconnect();
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const { id } = params;

    // Check if blog exists
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    await Blog.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  } finally {
    await mongoose.disconnect();
  }
}
