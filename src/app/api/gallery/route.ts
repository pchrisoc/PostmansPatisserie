import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import ExifParser from 'exif-parser';
import fetch from 'node-fetch';

// Define interfaces for our gallery images and Drive files
interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  thumbnail?: string;
  createdTime?: string; // Add createdTime field to the interface
  takenDate?: string; // Add date when photo was taken from EXIF
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

// Function to extract EXIF data from image
async function getExifData(fileId: string): Promise<Date | null> {
  try {
    // Get direct download URL for the file
    const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    // Fetch the file as an ArrayBuffer
    const response = await fetch(directUrl);
    if (!response.ok) {
      console.error(`Failed to fetch image for EXIF extraction: ${response.status}`);
      return null;
    }
    
    const buffer = await response.arrayBuffer();
    
    // Parse EXIF data
    const parser = ExifParser.create(Buffer.from(buffer));
    const result = parser.parse();
    
    // Get the date taken from EXIF data
    if (result && result.tags && result.tags.DateTimeOriginal) {
      // EXIF date is stored as seconds since epoch
      return new Date(result.tags.DateTimeOriginal * 1000);
    }
    
    // If no DateTimeOriginal, try other date fields
    if (result && result.tags && result.tags.DateTime) {
      return new Date(result.tags.DateTime * 1000);
    }
    
    return null;
  } catch (error) {
    console.error(`Error extracting EXIF data: ${error}`);
    return null;
  }
}

// Main function to get images from Google Drive (primary method)
async function getImagesFromGoogleDrive(): Promise<GalleryImage[]> {
  try {
    const auth = getAuthClient();
    const drive = google.drive({ version: 'v3', auth });
    
    // Get the folder ID from .env.local
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    
    if (!folderId) {
      console.error('No Google Drive folder ID specified in environment variables');
      throw new Error('Missing Google Drive folder ID configuration');
    }
    
    // Query files from the specified folder
    // Only get image files (JPEG, PNG, GIF, etc.)
    const response = await drive.files.list({
      q: `'${folderId}' in parents and (mimeType contains 'image/') and trashed = false`,
      pageSize: 100,
      fields: 'files(id, name, mimeType, webContentLink, thumbnailLink, createdTime)', // Added createdTime
      orderBy: 'createdTime desc', // Sort by most recent first
    });
    
    // Log the actual timestamps to verify what we're getting from Google Drive
    console.log('Image timestamps from Google Drive:');
    if (response.data.files && response.data.files.length > 0) {
      for (const file of response.data.files.slice(0, 5)) { // Log first 5 for debugging
        console.log(`${file.name}: ${file.createdTime}`);
      }
    }

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
          
          // Try to extract EXIF data to get the date the photo was taken
          const exifDate = file.mimeType?.includes('jpeg') || file.mimeType?.includes('jpg') 
            ? await getExifData(file.id as string) 
            : null;
            
          const takenDate = exifDate ? exifDate.toISOString() : null;
          
          console.log(`Processed image: ${file.name}, Taken date: ${takenDate || 'Unknown'}`);
          
          return {
            id: file.id as string,
            src: directUrl,
            alt: file.name || 'Gallery image',
            title: (file.name || 'Untitled').replace(/\.[^/.]+$/, ''), // Remove file extension
            thumbnail: thumbnailUrl,
            createdTime: file.createdTime, // Include the createdTime field
            takenDate: takenDate,
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

export async function GET() {
  try {
    // First try to get images from Google Drive (using the folder ID from .env.local)
    const images = await getImagesFromGoogleDrive();
    
    if (images.length === 0) {
      console.log('No images found in Google Drive. Please check your folder ID and permissions.');
    } else {
      console.log(`Returning ${images.length} images to the gallery`);
      
      // Sort images by date taken (newest first)
      // If takenDate is not available, fall back to createdTime, then sort alphabetically as last resort
      images.sort((a, b) => {
        // If both have takenDate, sort by that
        if (a.takenDate && b.takenDate) {
          return new Date(b.takenDate).getTime() - new Date(a.takenDate).getTime();
        }
        
        // If only one has takenDate, prefer the one with takenDate
        if (a.takenDate) return -1;
        if (b.takenDate) return 1;
        
        // If neither has takenDate, fall back to createdTime
        if (a.createdTime && b.createdTime) {
          return new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime();
        }
        
        // Last resort: alphabetical sorting
        return a.title.localeCompare(b.title);
      });
      
      // Log the sorted results
      console.log('Photos sorted by date taken (newest first):');
      images.slice(0, 5).forEach(img => {
        console.log(`${img.title}: Taken ${img.takenDate || 'Unknown'}, Uploaded ${img.createdTime}`);
      });
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