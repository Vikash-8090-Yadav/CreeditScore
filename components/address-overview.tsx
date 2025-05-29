interface AddressOverviewProps {
  address: string;
  network: string;
  balance: string;
  totalTransactions: number;
  firstActivity: string;
  lastActivity: string;
}

export default function AddressOverview({
  address,
  network,
  balance,
  totalTransactions,
  firstActivity,
  lastActivity
}: AddressOverviewProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Address Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-lg mb-2">Basic Information</h3>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Address:</span> {address}
            </p>
            <p className="text-sm">
              <span className="font-medium">Network:</span> {network}
            </p>
            <p className="text-sm">
              <span className="font-medium">Balance:</span> {balance} ETH
            </p>
            <div className="mt-4">
              <a
                href={`https://eth.blockscout.com/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                View on Blockscout
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-lg mb-2">Activity Summary</h3>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Total Transactions:</span> {totalTransactions}
            </p>
            <p className="text-sm">
              <span className="font-medium">First Activity:</span> {firstActivity}
            </p>
            <p className="text-sm">
              <span className="font-medium">Last Activity:</span> {lastActivity}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 