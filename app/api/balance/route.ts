import { NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = 'https://eth.blockscout.com/api';
const TIMEOUT = 30000; // 30 seconds timeout
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds delay between retries

async function fetchWithRetry(url: string, params: any, retries = MAX_RETRIES) {
  try {
    const response = await axios.get(url, {
      params,
      timeout: TIMEOUT,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CryptoAddressAnalyzer/1.0'
      }
    });
    return response;
  } catch (error: any) {
    if (retries > 0) {
      // Check for rate limit or timeout errors
      if (error.response?.status === 429 || error.code === 'ECONNABORTED' || error.response?.status === 524) {
        console.log(`Rate limited or timeout, retrying in ${RETRY_DELAY}ms... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return fetchWithRetry(url, params, retries - 1);
      }
    }
    throw error;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const network = searchParams.get('network');

  if (!address || !network) {
    return NextResponse.json({ 
      status: '0',
      message: 'Address and network are required',
      result: null
    }, { status: 400 });
  }

  try {
    // Get balance
    let balanceResponse;
    try {
      balanceResponse = await fetchWithRetry(API_BASE_URL, {
        module: 'account',
        action: 'balance',
        address: address
      });
    } catch (error: any) {
      console.error('Balance fetch error:', error);
      return NextResponse.json({ 
        status: '0',
        message: 'Failed to fetch balance',
        result: null
      }, { status: 500 });
    }

    if (!balanceResponse.data || !balanceResponse.data.result) {
      return NextResponse.json({ 
        status: '0',
        message: 'No balance data found',
        result: null
      }, { status: 404 });
    }

    return NextResponse.json({
      status: '1',
      message: 'OK',
      result: balanceResponse.data.result
    });

  } catch (error: any) {
    console.error('Balance API Error:', error);
    
    if (error.response?.status === 429) {
      return NextResponse.json({ 
        status: '0',
        message: 'Rate limit exceeded - please try again in a few minutes',
        result: null
      }, { status: 429 });
    } else if (error.code === 'ECONNABORTED') {
      return NextResponse.json({ 
        status: '0',
        message: 'Request timeout - server took too long to respond',
        result: null
      }, { status: 504 });
    } else if (error.response?.status === 524) {
      return NextResponse.json({ 
        status: '0',
        message: 'Gateway timeout - please try again',
        result: null
      }, { status: 524 });
    }
    
    return NextResponse.json({ 
      status: '0',
      message: 'Failed to fetch balance',
      result: null
    }, { status: 500 });
  }
} 