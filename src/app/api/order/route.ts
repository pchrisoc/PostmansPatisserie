import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// Define interface for order data
interface OrderData {
  name: string;
  email: string;
  phone: string;
  message: string;
  timestamp: string;
}

// Initialize the OAuth2 client with credentials
const getAuthClient = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  // Set credentials using refresh token
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return oauth2Client;
};

// Function to ensure the Orders sheet exists
async function ensureOrdersSheetExists(sheets: any, spreadsheetId: string) {
  try {
    // Get information about the spreadsheet
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    // Check if the Orders sheet already exists
    const ordersSheetExists = spreadsheet.data.sheets.some(
      (sheet: any) => sheet.properties.title === 'Orders'
    );

    if (!ordersSheetExists) {
      // Create a new sheet called "Orders"
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: 'Orders',
                  gridProperties: {
                    rowCount: 1000,
                    columnCount: 5,
                  },
                },
              },
            },
          ],
        },
      });

      console.log('Created "Orders" sheet in the spreadsheet');

      // Add headers to the new sheet
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Orders!A1:E1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [['Timestamp', 'Name', 'Email', 'Phone', 'Order Details']],
        },
      });

      console.log('Added headers to the Orders sheet');
    }

    return true;
  } catch (error) {
    console.error('Error ensuring Orders sheet exists:', error);
    throw error;
  }
}

// Function to add order data to Google Sheet
async function addOrderToSheet(orderData: OrderData) {
  try {
    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Get the sheet ID from environment variables
    const sheetId = process.env.GOOGLE_SHEET_ID;
    
    if (!sheetId) {
      console.error('No Google Sheet ID specified in environment variables');
      throw new Error('Missing Google Sheet ID configuration');
    }
    
    // Make sure the Orders sheet exists before trying to use it
    await ensureOrdersSheetExists(sheets, sheetId);
    
    // Format data for the sheet (as a row)
    const values = [
      [
        orderData.timestamp,
        orderData.name,
        orderData.email,
        orderData.phone,
        orderData.message
      ]
    ];
    
    // Append the data to the sheet
    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Orders!A2', // Start after the header row
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values,
      },
    });
    
    console.log(`Order added to sheet: ${appendResponse.data.updates?.updatedCells} cells updated`);
    return appendResponse.data;
  } catch (error) {
    console.error('Error adding order to Google Sheet:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const orderData: Omit<OrderData, 'timestamp'> = await request.json();
    
    // Validate required fields
    if (!orderData.name || !orderData.email || !orderData.phone || !orderData.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Add timestamp
    const completeOrderData: OrderData = {
      ...orderData,
      timestamp: new Date().toISOString(),
    };
    
    // Add to Google Sheet
    await addOrderToSheet(completeOrderData);
    
    // Return success response
    return NextResponse.json({ 
      success: true,
      message: 'Order submitted successfully' 
    });
  } catch (error) {
    console.error('Error in Order API:', error);
    return NextResponse.json(
      { error: 'Failed to submit order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}