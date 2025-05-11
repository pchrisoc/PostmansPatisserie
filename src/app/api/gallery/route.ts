import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// Define interfaces for our gallery images and Drive files
interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  thumbnail?: string;
}

// Initialize the OAuth2 client with credentials from .env.local
const getAuthClient = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  // Set credentials using refresh token from .env.local
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return oauth2Client;
};

// Main function to get images from Google Drive (primary method)
async function getImagesFromGoogleDrive(): Promise<GalleryImage[]> {
  try {
    const auth = getAuthClient();
    const drive = google.drive({ version: 'v3', auth });
    
    // Get the folder ID from .env.local
    const folderId = process.env.GOOGLE__DRIVE_FOLDER_ID;
    
    if (!folderId) {
      console.error('No Google Drive folder ID specified in environment variables');
      throw new Error('Missing Google Drive folder ID configuration');
    }
    
    // Query files from the specified folder
    // Only get image files (JPEG, PNG, GIF, etc.)
    const response = await drive.files.list({
      q: `'${folderId}' in parents and (mimeType contains 'image/') and trashed = false`,
      pageSize: 100,
      fields: 'files(id, name, mimeType, webContentLink, thumbnailLink)',
    });
    
    const files = response.data.files || [];
    
    if (files.length === 0) {
      console.log('No image files found in the specified Google Drive folder.');
      return [];
    }
    
    console.log(`Found ${files.length} images in Google Drive`);
    
    // Map Drive files to our gallery format using properly formatted URLs that work in browsers
    const galleryImages = await Promise.all(
      files.map(async (file) => {
        try {
          // Get a public link for the file - this avoids token expiration issues
          await drive.permissions.create({
            fileId: file.id as string,
            requestBody: {
              role: 'reader',
              type: 'anyone',
            },
          });
          
          // Create browser-compatible direct links
          // This format is more reliable for browser display: https://drive.google.com/thumbnail?id=FILE_ID&sz=w2048
          const directUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w2048`;
          const thumbnailUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w300`;
          
          console.log(`Processed image: ${file.name}, URL: ${directUrl}`);
          
          return {
            id: file.id as string,
            src: directUrl,
            alt: file.name || 'Gallery image',
            title: (file.name || 'Untitled').replace(/\.[^/.]+$/, ''), // Remove file extension
            thumbnail: thumbnailUrl,
          };
        } catch (error) {
          console.error(`Error processing file ${file.id} - ${file.name}:`, error);
          return null;
        }
      })
    );
    
    // Filter out any null entries from errors
    return galleryImages.filter(Boolean) as GalleryImage[];
  } catch (error) {
    console.error('Error fetching images from Google Drive:', error);
    return [];
  }
}

// Get images from a specific Google Photos album
async function getImagesFromAlbum(accessToken: string, albumId: string): Promise<GalleryImage[]> {
  const url = `https://photoslibrary.googleapis.com/v1/mediaItems:search`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      albumId: albumId,
      pageSize: 100,
    }),
  });
  
  if (!response.ok) {
    console.error(`Failed to get album images: ${response.status} ${response.statusText}`);
    const errorData = await response.text();
    console.error('Error response:', errorData);
    throw new Error(`Failed to get album images: ${response.statusText}`);
  }
  
  const data = await response.json();
  return mapMediaItemsToGalleryImages(data.mediaItems || []);
}

// Get recent images from Google Photos library
async function getRecentImages(accessToken: string): Promise<GalleryImage[]> {
  const url = `https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=30`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    console.error(`Failed to get recent images: ${response.status} ${response.statusText}`);
    const errorData = await response.text();
    console.error('Error response:', errorData);
    throw new Error(`Failed to get recent images: ${response.statusText}`);
  }
  
  const data = await response.json();
  return mapMediaItemsToGalleryImages(data.mediaItems || []);
}

// Map Google Photos media items to our gallery format
function mapMediaItemsToGalleryImages(mediaItems: any[]): GalleryImage[] {
  return mediaItems
    .filter(item => item.mimeType && item.mimeType.startsWith('image/'))
    .map(item => ({
      id: item.id,
      src: `${item.baseUrl}=w2048-h2048`, // Large size for display
      alt: item.filename || 'Gallery image',
      title: item.filename?.replace(/\.[^/.]+$/, '') || 'Untitled', // Remove file extension
      thumbnail: `${item.baseUrl}=w300-h300`, // Thumbnail
    }));
}

export async function GET(req: Request) {
  try {
    // First try to get images from Google Drive (using the folder ID from .env.local)
    let images = await getImagesFromGoogleDrive();
    

    if (images.length === 0) {
      console.log('No images found in Google Drive or Google Photos. Please check your folder ID and permissions.');
    } else {
      console.log(`Returning ${images.length} images to the gallery`);
    }
    
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error in Gallery API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}