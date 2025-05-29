const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://eth.blockscout.com/api';

export const nftTransactionsAPI = {
  async getNFTTransactions(address: string) {
    try {
      const response = await fetch(
        `${BASE_URL}?module=account&action=tokennfttx&address=${address}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching NFT transactions:', error);
      throw error;
    }
  }
}; 