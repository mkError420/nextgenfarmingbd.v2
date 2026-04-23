import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    // Handle both 'files' (array) and 'file' (single) form field names
    let files = formData.getAll('files') as File[];
    if (!files || files.length === 0 || (files.length === 1 && files[0].name === '')) {
      const singleFile = formData.get('file') as File;
      if (singleFile && singleFile.name !== '') {
        files = [singleFile];
      }
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only JPG, JPEG, PNG, and WebP are allowed.' },
          { status: 400 }
        );
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: 'File size exceeds 5MB limit' },
          { status: 400 }
        );
      }
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Upload all files to local storage
    const uploadedUrls: string[] = [];
    for (const file of files) {
      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = path.extname(file.name);
      const filename = `${timestamp}-${randomString}${extension}`;
      const filepath = path.join(uploadsDir, filename);

      // Write file to local storage
      await writeFile(filepath, buffer);

      // Return the URL path
      uploadedUrls.push(`/uploads/${filename}`);
    }

    // Return the URLs of the uploaded files
    return NextResponse.json({ urls: uploadedUrls }, { status: 200 });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 });
  }
}
