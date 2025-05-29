import axios from 'axios';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export const transactionAPI = {
  async getTransactions(address: string) {
    let retries = MAX_RETRIES;
    
    while (retries > 0) {
      try {
        const response = await axios.get(`/api/transactions?address=${address}`);
        return response.data;
      } catch (error: any) {
        console.error('Transaction API Error:', error);
        
        // If we get a rate limit error, wait and retry
        if (error.response?.status === 429 && retries > 1) {
          console.log(`Rate limited, retrying in ${RETRY_DELAY}ms... (${retries - 1} retries left)`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          retries--;
          continue;
        }
        
        // For other errors, throw with more details
        throw new Error(error.response?.data?.error || 'network_error');
      }
    }
    
    throw new Error('network_error');
  }
}; 