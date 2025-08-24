import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { uploadImage } from '@/lib/minio'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const originalExt = file.name.split('.').pop() || 'jpg'
    const originalFileName = `original/${timestamp}.${originalExt}`
    const webpFileName = `webp/${timestamp}.webp`

    // Upload original image
    await uploadImage(buffer, originalFileName)

    // Convert to WebP and upload
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 80 })
      .toBuffer()
    
    const webpUrl = await uploadImage(webpBuffer, webpFileName)
    
    return NextResponse.json({ 
      imageUrl: webpUrl,
      originalUrl: `${process.env.NEXT_PUBLIC_MINIO_URL}/${process.env.MINIO_BUCKET || 'creative-kindness'}/${originalFileName}`
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}