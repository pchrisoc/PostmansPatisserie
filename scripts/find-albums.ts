// This script helps you find your Google Photos albums using a refresh token
// Run it with: npx ts-node scripts/find-albums.ts

import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Define interfaces for TypeScript
interface TokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

interface Album {
  id: string;
  title: string;
  productUrl: string;
  mediaItemsCount?: string;
  coverPhotoBaseUrl?: string;
}

interface AlbumsResponse {
  albums: Album[];
  nextPageToken?: string;
}

// Main function to find albums
async function findAlbums() {
  try {
    console.log('Starting Google Photos album finder...');
    console.log('This script uses your Google refresh token to list your albums.');
    console.log('\n=====================================================================');
    console.log('INSTRUCTIONS TO GET A NEW REFRESH TOKEN:');
    console.log('1. Go to https://developers.google.com/oauthplayground/');
    console.log('2. Click the gear icon ⚙️ in the top right');
    console.log('3. Check "Use your own OAuth credentials"');
    console.log('4. Enter your Client ID and Client Secret');
    console.log('5. Close the settings');
    console.log('6. In the left panel, find "Photos Library API v1"');
    console.log('7. Select the scope: https://www.googleapis.com/auth/photoslibrary');
    console.log('8. Click "Authorize APIs" and go through the authentication flow');
    console.log('9. Once authorized, click "Exchange authorization code for tokens"');
    console.log('10. Copy the refresh token and update your .env.local file');
    console.log('=====================================================================\n');
    
    // Get credentials from environment variables
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    
    if (!clientId || !clientSecret || !refreshToken) {
      console.error('Error: Missing Google API credentials in .env.local file.');
      console.error('Make sure you have GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN defined.');
      return;
    }
    
    // Exchange the refresh token for an access token
    console.log('Getting access token using refresh token...');
    const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);
    console.log('Successfully obtained access token');
    
    // Use the access token to list albums
    console.log('\nListing your Google Photos albums...');
    const albums = await listGooglePhotosAlbums(accessToken);
    
    if (albums.length === 0) {
      console.log('No albums found in your Google Photos account.');
      return;
    }
    
    console.log(`\nFound ${albums.length} albums in your Google Photos account:`);
    console.log('===========================================');
    
    albums.forEach((album, index) => {
      console.log(`${index + 1}. ${album.title}`);
      console.log(`   Album ID: ${album.id}`);
      console.log(`   Items: ${album.mediaItemsCount || 'Unknown'}`);
      if (album.productUrl) {
        console.log(`   URL: ${album.productUrl}`);
      }
      console.log('-------------------------------------------');
    });
    
    console.log('\nTo use one of these albums in your gallery:');
    console.log('1. Copy the Album ID you want to use');
    console.log('2. Update your .env.local file with:');
    console.log('   GOOGLE_PHOTOS_ALBUM_ID=your_selected_album_id');
    console.log('3. Restart your Next.js application');
    
  } catch (error) {
    console.error('Error finding albums:', error instanceof Error ? error.message : error);
  }
}

// Function to exchange a refresh token for an access token
async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string> {
  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token refresh failed:', tokenResponse.status, tokenResponse.statusText);
      console.error('Error details:', errorText);
      throw new Error(`Failed to refresh access token: ${tokenResponse.statusText}`);
    }
    
    const data = await tokenResponse.json() as TokenResponse;
    console.log(`Token scope: ${data.scope}`);
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Function to list Google Photos albums
async function listGooglePhotosAlbums(accessToken: string): Promise<Album[]> {
  try {
    const response = await fetch('https://photoslibrary.googleapis.com/v1/albums', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Album listing error: ${response.status} ${response.statusText}`);
      console.error('Error response:', errorText);
      
      if (response.status === 403) {
        console.error('\nPermission denied. This could be because:');
        console.error('1. Your refresh token doesn\'t have the necessary scope (should be https://www.googleapis.com/auth/photoslibrary)');
        console.error('2. The Google Photos Library API is not enabled in your Google Cloud project');
        console.error('3. There might be restrictions on your Google account or the API usage');
        
        // Verify token by getting a media item
        console.log('\nAttempting to verify token by getting recent media items...');
        await checkMediaItems(accessToken);
      }
      
      throw new Error(`Google Photos API error: ${response.statusText}`);
    }
    
    const data = await response.json() as AlbumsResponse;
    return data.albums || [];
  } catch (error) {
    console.error('Error listing albums:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Function to check media items as a fallback
async function checkMediaItems(accessToken: string) {
  try {
    const mediaResponse = await fetch('https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=1', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (mediaResponse.ok) {
      const mediaData = await mediaResponse.json();
      console.log('Successfully connected to the Google Photos API!');
      console.log(`Found ${mediaData.mediaItems?.length || 0} media items.`);
      console.log('This means your authentication is working, but you might not have any albums.');
    } else {
      const mediaErrorText = await mediaResponse.text();
      console.error('Media items check also failed:', mediaErrorText);
    }
  } catch (error) {
    console.error('Error checking media items:', error instanceof Error ? error.message : error);
  }
}

// Run the script
findAlbums();