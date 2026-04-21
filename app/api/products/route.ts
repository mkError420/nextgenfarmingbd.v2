import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Product from '@/lib/models/Product';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

export async function GET(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const id = searchParams.get('id');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('API - Category filter:', category);
    console.log('API - Search term:', search);

    if (id) {
      // Get single product by ID
      const product = await Product.findById(id);
      
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json(product);
    }

    // Build query
    let query: any = {};
    
    if (category) {
      query.category = category;
      console.log('API - Query with category filter:', query);
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { name_en: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    let queryBuilder = Product.find(query).sort({ createdAt: -1 });
    
    if (limit) {
      queryBuilder = queryBuilder.limit(limit);
    }
    
    const products = await queryBuilder.skip(offset);

    const total = await Product.countDocuments(query);

    console.log('API - Total products found:', total);
    console.log('API - Products returned:', products.length);
    
    // Log unique categories from products
    const uniqueCategories = await Product.distinct('category');
    console.log('API - All unique categories in products:', uniqueCategories);

    return NextResponse.json({ 
      products,
      pagination: {
        total,
        limit: limit || total,
        offset,
        hasMore: limit ? offset + limit < total : false
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const productData = await request.json();
    
    console.log('Product data received:', productData);
    
    // Validate required fields
    const requiredFields = ['name', 'name_en', 'price', 'category', 'images'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    
    // Validate images array
    if (!Array.isArray(productData.images) || productData.images.length === 0) {
      return NextResponse.json({ error: 'At least one image is required' }, { status: 400 });
    }

    const product = new Product(productData);
    await product.save();
    
    console.log('Product saved successfully:', product);
    
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    if (error.errors) {
      console.error('Validation errors:', error.errors);
    }
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
