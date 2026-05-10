import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function deleteS3Object(url: string) {
  if (!url) return;
  
  try {
    // Extract the key from the URL
    // URL format: https://pub-xxxx.r2.dev/projects/filename.png
    // We need: projects/filename.png
    const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, '');
    if (!publicUrl) return;

    // Remove the public URL prefix to get the key
    // This handles both cases: with and without trailing slash
    let key = url.replace(publicUrl, '');
    if (key.startsWith('/')) {
      key = key.substring(1);
    }
    
    if (key === url) {
      console.warn('Could not extract S3 key from URL:', url);
      return;
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    });

    await s3Client.send(command);
    console.log('Successfully deleted S3 object:', key);
  } catch (error) {
    console.error('Failed to delete S3 object:', error);
  }
}
