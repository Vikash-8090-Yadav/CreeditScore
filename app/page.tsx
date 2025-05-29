"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, TrendingUp, Users, ChevronRight, Search } from "lucide-react"
import { useRouter } from "next/navigation"

const networks = [
  { id: "ethereum", name: "Ethereum", logo: "🔷", color: "bg-blue-500" },
  { id: "bitcoin", name: "Bitcoin", logo: "₿", color: "bg-orange-500" },
  { id: "polygon", name: "Polygon", logo: "🔮", color: "bg-purple-500" },
  { id: "bsc", name: "BSC", logo: "🟡", color: "bg-yellow-500" },
  { id: "arbitrum", name: "Arbitrum", logo: "🔵", color: "bg-blue-600" },
  { id: "optimism", name: "Optimism", logo: "🔴", color: "bg-red-500" },
]

const features = [
  {
    icon: Shield,
    title: "Risk Assessment",
    description: "Advanced algorithms analyze transaction patterns and identify potential risks",
  },
  {
    icon: Zap,
    title: "Real-time Analysis",
    description: "Get instant insights with our lightning-fast blockchain data processing",
  },
  {
    icon: TrendingUp,
    title: "Credit Scoring",
    description: "Comprehensive scoring system from 300-850 based on on-chain activity",
  },
  {
    icon: Users,
    title: "Community Insights",
    description: "Compare your score with millions of other addresses in our network",
  },
]

export default function LandingPage() {
  const [address, setAddress] = useState("")
  const [selectedNetwork, setSelectedNetwork] = useState("ethereum")
  const [isValidating, setIsValidating] = useState(false)
  const [addressError, setAddressError] = useState("")
  const router = useRouter()

  const validateAddress = (addr: string) => {
    if (!addr) {
      setAddressError("")
      return false
    }

    // Basic validation for different networks
    const patterns = {
      ethereum: /^0x[a-fA-F0-9]{40}$/,
      bitcoin: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/,
      polygon: /^0x[a-fA-F0-9]{40}$/,
      bsc: /^0x[a-fA-F0-9]{40}$/,
      arbitrum: /^0x[a-fA-F0-9]{40}$/,
      optimism: /^0x[a-fA-F0-9]{40}$/,
    }

    const isValid = patterns[selectedNetwork as keyof typeof patterns]?.test(addr)
    setAddressError(isValid ? "" : "Invalid address format for selected network")
    return isValid
  }

  const handleAddressChange = (value: string) => {
    setAddress(value)
    if (value) {
      setIsValidating(true)
      setTimeout(() => {
        validateAddress(value)
        setIsValidating(false)
      }, 500)
    } else {
      setAddressError("")
    }
  }

  const handleAnalyze = () => {
    if (validateAddress(address)) {
      router.push(`/analyze?address=${encodeURIComponent(address)}&network=${selectedNetwork}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CryptoScore
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
              How it Works
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </a>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            🚀 Trusted by 100K+ users worldwide
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Know Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Crypto Credit Score
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Analyze any blockchain address instantly. Get comprehensive risk assessment, credit scoring, and actionable
            insights to make informed decisions.
          </p>

          {/* Address Input Section */}
          <Card className="max-w-2xl mx-auto mb-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Network Selector */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Select Network</label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {networks.map((network) => (
                      <button
                        key={network.id}
                        onClick={() => setSelectedNetwork(network.id)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          selectedNetwork === network.id
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="text-lg mb-1">{network.logo}</div>
                        <div className="text-xs font-medium text-gray-700">{network.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Address Input */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Wallet Address</label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Enter wallet address (e.g., 0x742d35Cc6634C0532925a3b8D..."
                      value={address}
                      onChange={(e) => handleAddressChange(e.target.value)}
                      className={`pr-12 h-12 text-sm ${addressError ? "border-red-500 focus:border-red-500" : ""}`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {isValidating ? (
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Search className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  {addressError && <p className="text-red-500 text-sm mt-1">{addressError}</p>}
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={!address || !!addressError || isValidating}
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Analyze Address
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Free Analysis
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Instant Results
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Privacy Protected
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Analysis Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get comprehensive insights into any blockchain address with our advanced analysis tools
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get your crypto credit score in just a few simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Enter Address", desc: "Paste any blockchain wallet address" },
              { step: "02", title: "AI Analysis", desc: "Our AI analyzes transaction history and patterns" },
              { step: "03", title: "Get Score", desc: "Receive detailed credit score and recommendations" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">CryptoScore</span>
              </div>
              <p className="text-gray-400 text-sm">
                The most trusted platform for blockchain address analysis and credit scoring.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 CryptoScore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
