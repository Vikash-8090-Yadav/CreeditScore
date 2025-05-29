export default function Footer() {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">About</h3>
            <p className="mt-4 text-base text-gray-500">
              Crypto Address Analyzer helps you understand and evaluate Ethereum addresses with detailed analytics and credit scoring.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="https://ethereum.org" target="_blank" rel="noopener noreferrer" className="text-base text-gray-500 hover:text-gray-900">
                  Ethereum.org
                </a>
              </li>
              <li>
                <a href="https://etherscan.io" target="_blank" rel="noopener noreferrer" className="text-base text-gray-500 hover:text-gray-900">
                  Etherscan
                </a>
              </li>
              <li>
                <a href="https://blockscout.com" target="_blank" rel="noopener noreferrer" className="text-base text-gray-500 hover:text-gray-900">
                  Blockscout
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Crypto Address Analyzer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 