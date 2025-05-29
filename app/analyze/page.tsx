"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import LoadingExperience from "@/components/loading-experience"
import ErrorDisplay from "@/components/error-display"
import CreditScoreCircle from "@/components/credit-score-circle"
import AddressOverview from "@/components/address-overview"
import NFTTransactions from "@/components/nft-transactions"
import Footer from "@/components/footer"
import { balanceAPI } from "@/services/balance-api"
import { transactionAPI } from "@/services/transaction-api"
import { nftTransactionsAPI } from "@/services/nft-transactions-api"
import { ethers } from "ethers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Wallet,
  Activity,
  TrendingUp,
  Shield,
  ArrowLeft,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Sparkles,
  BarChart3,
  Clock,
  Coins,
} from "lucide-react"

interface AnalysisData {
  address: string
  network: string
  balance: string
  totalTransactions: number
  firstActivity: string
  lastActivity: string
  creditScore: number
  riskLevel: string
  recommendations: string[]
}

interface NFTTransaction {
  blockHash: string
  blockNumber: string
  confirmations: string
  contractAddress: string
  from: string
  gas: string
  gasPrice: string
  gasUsed: string
  hash: string
  input: string
  logIndex: string
  nonce: string
  timeStamp: string
  to: string
  tokenDecimal: string
  tokenID: string
  tokenName: string
  tokenSymbol: string
  transactionIndex: string
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(parseInt(timestamp) * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
};

export default function AnalyzePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [stage, setStage] = useState<"loading" | "results" | "error">("loading")
  const [error, setError] = useState<string | null>(null)
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [nftTransactions, setNFTTransactions] = useState<NFTTransaction[]>([])
  const [copied, setCopied] = useState(false)

  const address = searchParams.get("address")
  const network = searchParams.get("network")

  const calculateCreditScore = (data: any) => {
    let score = 0
    const recommendations: string[] = []

    // Balance factor (up to 30 points)
    const balanceInEth = Number.parseFloat(data.balance)
    if (balanceInEth > 10) {
      score += 30
    } else if (balanceInEth > 5) {
      score += 20
    } else if (balanceInEth > 1) {
      score += 10
    } else {
      recommendations.push("Consider maintaining a higher balance for better credit score")
    }

    // Transaction history factor (up to 40 points)
    const txCount = data.totalTransactions
    if (txCount > 1000) {
      score += 40
    } else if (txCount > 500) {
      score += 30
    } else if (txCount > 100) {
      score += 20
    } else if (txCount > 10) {
      score += 10
    } else {
      recommendations.push("Increase transaction activity to improve credit score")
    }

    // Account age factor (up to 30 points)
    const firstActivity = Number.parseInt(data.firstActivity)
    const lastActivity = Number.parseInt(data.lastActivity)
    const accountAge = lastActivity - firstActivity
    const daysActive = accountAge / (24 * 60 * 60) // Convert to days

    if (daysActive > 365) {
      score += 30
    } else if (daysActive > 180) {
      score += 20
    } else if (daysActive > 90) {
      score += 10
    } else {
      recommendations.push("Account is relatively new - maintain consistent activity")
    }

    // Determine risk level
    let riskLevel = "Low"
    if (score < 50) {
      riskLevel = "High"
    } else if (score < 70) {
      riskLevel = "Medium"
    }

    return { score, riskLevel, recommendations }
  }

  useEffect(() => {
    if (!address || !network) {
      router.push("/")
      return
    }

    // Check if network is Ethereum
    if (network.toLowerCase() !== "ethereum") {
      setError("coming_soon")
      setStage("error")
      return
    }

    const runAnalysis = async () => {
      try {
        // Get balance data
        const balanceData = await balanceAPI.getBalance(address, network)

        if (balanceData.status !== "1" || !balanceData.result) {
          throw new Error(balanceData.message || "Failed to fetch balance")
        }

        // Get transaction data
        const txResponse = await transactionAPI.getTransactions(address)

        if (txResponse.status !== "1" || !txResponse.result) {
          throw new Error(txResponse.message || "Failed to fetch transactions")
        }

        // Get NFT transactions
        const nftResponse = await nftTransactionsAPI.getNFTTransactions(address)

        if (nftResponse.status === "1" && nftResponse.result) {
          setNFTTransactions(nftResponse.result)
        }

        // Convert balance from wei to ether
        const balanceInEth = ethers.formatEther(balanceData.result)

        // Calculate credit score
        const { score, riskLevel, recommendations } = calculateCreditScore({
          balance: balanceInEth,
          totalTransactions: txResponse.result.totalTransactions,
          firstActivity: txResponse.result.firstActivity,
          lastActivity: txResponse.result.lastActivity,
        })

        setAnalysisData({
          address,
          network,
          balance: balanceInEth,
          totalTransactions: txResponse.result.totalTransactions || 0,
          firstActivity: formatTimestamp(txResponse.result.firstActivity || "0"),
          lastActivity: formatTimestamp(txResponse.result.lastActivity || "0"),
          creditScore: score,
          riskLevel,
          recommendations,
        })
      } catch (err: any) {
        console.error("Analysis error:", err)
        setError(err.message || "Failed to analyze address")
      } finally {
        setStage("results")
      }
    }

    runAnalysis()
  }, [address, network, router])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`
  }

  const copyAddress = async () => {
    if (analysisData?.address) {
      await navigator.clipboard.writeText(analysisData.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return <CheckCircle className="w-4 h-4" />
      case "medium":
        return <AlertTriangle className="w-4 h-4" />
      case "high":
        return <XCircle className="w-4 h-4" />
      default:
        return <Shield className="w-4 h-4" />
    }
  }

  if (stage === "loading") {
    return <LoadingExperience address={address!} network={network!} />
  }

  if (stage === "error") {
    return (
      <ErrorDisplay
        error={error!}
        onRetry={() => {
          setStage("loading")
          setError(null)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center hover:bg-blue-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CryptoScore
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {analysisData && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
                <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Analysis Complete</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Address Analysis Results</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Comprehensive analysis of your Ethereum address activity and credit assessment
              </p>
            </div>

            <AddressOverview
              address={analysisData.address}
              network={analysisData.network}
              balance={analysisData.balance}
              totalTransactions={analysisData.totalTransactions}
              firstActivity={analysisData.firstActivity}
              lastActivity={analysisData.lastActivity}
            />

            {/* Credit Analysis Card */}
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                <CardTitle className="flex items-center text-2xl">
                  <TrendingUp className="w-6 h-6 mr-3 text-indigo-600" />
                  Credit Analysis
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Credit Score Section */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Credit Score</h3>
                    <div className="flex flex-col items-center">
                      <CreditScoreCircle score={analysisData.creditScore} />
                      <div className="mt-6 text-center">
                        <div
                          className={`inline-flex items-center px-4 py-2 rounded-full border ${getRiskColor(analysisData.riskLevel)}`}
                        >
                          {getRiskIcon(analysisData.riskLevel)}
                          <span className="ml-2 font-semibold">{analysisData.riskLevel} Risk</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations Section */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl p-8 border border-amber-200">
                    <h3 className="text-xl font-bold text-amber-900 mb-6 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Recommendations
                    </h3>
                    <div className="space-y-4">
                      {analysisData.recommendations.length > 0 ? (
                        analysisData.recommendations.map((rec, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 p-4 bg-white/60 rounded-lg border border-amber-200"
                          >
                            <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs font-bold">{index + 1}</span>
                            </div>
                            <p className="text-sm text-amber-800 leading-relaxed">{rec}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                          <p className="text-green-700 font-semibold">Excellent Standing!</p>
                          <p className="text-sm text-green-600 mt-1">
                            No recommendations - your account is in great shape
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NFT Transactions */}
            {nftTransactions.length > 0 && (
              <NFTTransactions transactions={nftTransactions} />
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
