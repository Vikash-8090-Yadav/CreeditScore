import { NextResponse } from 'next/server';
import axios from 'axios';
import { ethers } from 'ethers';

const API_BASE_URL = 'https://eth.blockscout.com/api';
const TIMEOUT = 30000; // 30 seconds timeout
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds delay between retries

interface Transaction {
  value: string;
  timeStamp: number;
  isInternal: boolean;
  tokenSymbol?: string;
  contractAddress?: string;
}

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

  if (!address) {
    return NextResponse.json({ 
      status: '0',
      message: 'Address is required',
      result: null
    }, { status: 400 });
  }

  try {
    // Get normal transactions
    let txResponse;
    try {
      txResponse = await fetchWithRetry(API_BASE_URL, {
        module: 'account',
        action: 'txlist',
        address: address,
        startblock: 0,
        endblock: 99999999,
        sort: 'desc'
      });
    } catch (error: any) {
      console.error('Transaction fetch error:', error);
      return NextResponse.json({ 
        status: '0',
        message: 'Failed to fetch transactions',
        result: null
      }, { status: 500 });
    }

    if (!txResponse.data || !txResponse.data.result) {
      return NextResponse.json({ 
        status: '0',
        message: 'No transaction data found',
        result: null
      }, { status: 404 });
    }

    const transactions = txResponse.data.result;

    // Calculate transaction statistics
    const totalTransactions = transactions.length;
    const firstActivity = transactions.length > 0 ? transactions[transactions.length - 1].timeStamp : 'N/A';
    const lastActivity = transactions.length > 0 ? transactions[0].timeStamp : 'N/A';

    // Calculate total volume
    const totalVolume = transactions.reduce((acc: number, tx: any) => {
      return acc + parseFloat(tx.value);
    }, 0);

    return NextResponse.json({
      status: '1',
      message: 'OK',
      result: {
        totalTransactions,
        firstActivity,
        lastActivity,
        totalVolume: totalVolume.toString(),
        transactions: transactions.slice(0, 10) // Return only last 10 transactions
      }
    });

  } catch (error: any) {
    console.error('Transactions API Error:', error);
    
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
      message: 'Failed to fetch transactions',
      result: null
    }, { status: 500 });
  }
} 