import * as Minio from 'minio'

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || '',
  secretKey: process.env.MINIO_SECRET_KEY || ''
})

const BUCKET_NAME = process.env.MINIO_BUCKET || 'creative-kindness'

export async function uploadImage(file: Buffer, fileName: string): Promise<string> {
  try {
    await minioClient.putObject(BUCKET_NAME, fileName, file)
    return `${process.env.NEXT_PUBLIC_MINIO_URL}/${BUCKET_NAME}/${fileName}`
  } catch (error) {
    console.error('Error uploading to MinIO:', error)
    throw new Error('Failed to upload image')
  }
}

export async function deleteImage(fileName: string): Promise<void> {
  try {
    await minioClient.removeObject(BUCKET_NAME, fileName)
  } catch (error) {
    console.error('Error deleting from MinIO:', error)
    throw new Error('Failed to delete image')
  }
}

export async function getImageUrl(fileName: string): Promise<string> {
  return `${process.env.NEXT_PUBLIC_MINIO_URL}/${BUCKET_NAME}/${fileName}`
}

export { minioClient, BUCKET_NAME }