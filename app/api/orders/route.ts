import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Order from '@/lib/models/Order';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

export async function GET(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query: any = {};
    
    if (userId) {
      query.userId = userId;
    }
    
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    const total = await Order.countDocuments(query);

    return NextResponse.json({ 
      orders,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  } finally {
    await mongoose.disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const orderData = await request.json();
    
    // Validate required fields
    const requiredFields = ['userId', 'items', 'totalAmount', 'shippingAddress', 'paymentMethod'];
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Validate items
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 });
    }

    const order = new Order(orderData);
    await order.save();
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  } finally {
    await mongoose.disconnect();
  }
}
