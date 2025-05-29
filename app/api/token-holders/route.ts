import { NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = 'https://eth.blockscout.com/api';
const TIMEOUT = 30000; // 30 seconds timeout
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds delay between retries

interface NFTTransaction {
  blockHash: string;
  blockNumber: string;
  confirmations: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  from: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  hash: string;
  input: string;
  nonce: string;
  timeStamp: string;
  to: string;
  tokenID: string;
  tokenName: string;
  tokenSymbol: string;
  transactionIndex: string;
  value: string;
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
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  try {
    // Get NFT transactions with retry
    let nftResponse;
    try {
      nftResponse = await fetchWithRetry(API_BASE_URL, {
        module: 'account',
        action: 'tokennfttx',
        address: address
      });
    } catch (error: any) {
      console.error('NFT transactions fetch error:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch NFT transactions',
        details: error.message
      }, { status: 500 });
    }

    if (!nftResponse.data || !nftResponse.data.result) {
      return NextResponse.json({ error: 'Failed to fetch NFT transactions' }, { status: 500 });
    }

    const transactions = nftResponse.data.result as NFTTransaction[];

    // Process transactions data
    const processedTransactions = transactions.map(tx => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      tokenID: tx.tokenID,
      tokenName: tx.tokenName,
      tokenSymbol: tx.tokenSymbol,
      timestamp: tx.timeStamp,
      blockNumber: tx.blockNumber,
      contractAddress: tx.contractAddress
    }));

    // Group transactions by token
    const tokenStats = transactions.reduce((acc: any, tx) => {
      const key = tx.contractAddress;
      if (!acc[key]) {
        acc[key] = {
          contractAddress: tx.contractAddress,
          tokenName: tx.tokenName,
          tokenSymbol: tx.tokenSymbol,
          transactions: [],
          uniqueTokenIDs: new Set()
        };
      }
      acc[key].transactions.push(tx);
      acc[key].uniqueTokenIDs.add(tx.tokenID);
      return acc;
    }, {});

    // Convert token stats to array and add counts
    const tokenStatsArray = Object.values(tokenStats).map((stat: any) => ({
      ...stat,
      transactionCount: stat.transactions.length,
      uniqueTokenCount: stat.uniqueTokenIDs.size,
      uniqueTokenIDs: Array.from(stat.uniqueTokenIDs)
    }));

    return NextResponse.json({
      status: '1',
      result: {
        address,
        transactions: processedTransactions,
        tokenStats: tokenStatsArray
      }
    });

  } catch (error: any) {
    console.error('NFT Transactions API Error:', error);
    
    if (error.response?.status === 429) {
      return NextResponse.json({ 
        error: 'Rate limit exceeded - please try again in a few minutes',
        details: 'The API is currently rate limited. Please wait before trying again.'
      }, { status: 429 });
    } else if (error.code === 'ECONNABORTED') {
      return NextResponse.json({ 
        error: 'Request timeout - server took too long to respond',
        details: 'The request timed out. Please try again.'
      }, { status: 504 });
    } else if (error.response?.status === 524) {
      return NextResponse.json({ 
        error: 'Gateway timeout - please try again',
        details: 'The gateway timed out. Please try again.'
      }, { status: 524 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to fetch NFT transactions',
      details: error.message
    }, { status: 500 });
  }
} 