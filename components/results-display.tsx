"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share2, TrendingUp, BarChart3, Shield, AlertTriangle, CheckCircle, RefreshCw, Coins, Users } from "lucide-react"
import DetailedAnalysis from "./detailed-analysis"
import { ethers } from "ethers"

interface ResultsDisplayProps {
  data: {
    address: string
    network: string
    score: number
    risk_level: string
    total_transactions: number
    regular_tx_count: number
    internal_tx_count: number
    total_volume: string
    first_activity: string
    last_activity: string
    tokens: number
    nfts: number
    defi_protocols: number
    risk_factors: string[]
    balance: number
    token_holders: any[]
    token_info: {
      name: string
      symbol: string
      totalSupply: string
      decimals: number
    }
  }
}

const formatNumber = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return value.toLocaleString();
};

const formatPercentage = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) return '0.00';
  return value.toFixed(2);
};

const formatBalance = (value: string | number | undefined | null): string => {
  if (value === undefined || value === null) return '0.00';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0.00';
  return num.toFixed(4);
};

const formatVolume = (value: string | number | undefined | null): string => {
  if (value === undefined || value === null) return '0.00';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0.00';
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function ResultsDisplay({ data }: ResultsDisplayProps) {
  const [displayScore, setDisplayScore] = useState(0)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Only animate if we have a valid score
    if (data && data.score && !isNaN(data.score)) {
      const duration = 2000
      const steps = 60
      const score = Number(data.score)
      const increment = score / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= score) {
          setDisplayScore(score)
          clearInterval(timer)
        } else {
          setDisplayScore(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    } else {
      // If no valid score, just set it directly
      setDisplayScore(0)
    }
  }, [data])

  const getScoreColor = (score: number) => {
    if (!score || isNaN(score)) return "text-gray-600"
    if (score >= 750) return "text-green-600"
    if (score >= 650) return "text-yellow-600"
    if (score >= 550) return "text-orange-600"
    return "text-red-600"
  }

  const getScoreGradient = (score: number) => {
    if (!score || isNaN(score)) return "from-gray-500 to-gray-600"
    if (score >= 750) return "from-green-500 to-green-600"
    if (score >= 650) return "from-yellow-500 to-yellow-600"
    if (score >= 550) return "from-orange-500 to-orange-600"
    return "from-red-500 to-red-600"
  }

  const getRiskIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "medium":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "high":
        return <Shield className="w-5 h-5 text-red-500" />
      default:
        return <Shield className="w-5 h-5 text-gray-500" />
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "My Crypto Credit Score",
        text: `Check out my crypto credit score: ${data.score}/850`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (showDetails) {
    return <DetailedAnalysis data={data} onBack={() => setShowDetails(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Button variant="ghost" onClick={() => window.history.back()} className="mb-4">
            ← Back to Search
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analysis Complete</h1>
          <p className="text-gray-600">
            {formatAddress(data.address)} on {data.network.charAt(0).toUpperCase() + data.network.slice(1)}
          </p>
        </div>

        {/* Score Reveal */}
        <Card className="mb-8 shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="relative mb-6">
                <div className={`w-48 h-48 mx-auto rounded-full bg-gradient-to-r ${getScoreGradient(data.score)} p-1`}>
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-5xl font-bold ${getScoreColor(data.score)}`}>
                        {data && data.score ? Math.round(data.score) : '0'}
                      </div>
                      <div className="text-gray-500 text-sm">/ 850</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <Badge variant="secondary" className="px-4 py-1">
                    {data.risk_level || 'Unknown'} Risk
                  </Badge>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Crypto Credit Score</h2>
              <p className="text-gray-600 mb-6">Based on comprehensive analysis of your on-chain activity</p>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={handleShare} variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Score
                </Button>
                <Button onClick={() => setShowDetails(true)}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Improve Score
                </Button>
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Track Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">ETH Balance</p>
                  <p className="text-2xl font-bold text-gray-900">{formatBalance(data.balance)} ETH</p>
                </div>
                <Coins className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(data.total_transactions)}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Volume</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${formatVolume(data.total_volume)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Risk Level</p>
                  <p className="text-2xl font-bold text-gray-900">{data.risk_level || 'Unknown'}</p>
                </div>
                {getRiskIcon(data.risk_level)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Overview */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">{formatNumber(data.tokens)}</div>
                <div className="text-sm text-blue-700">Unique Tokens</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">{formatNumber(data.nfts)}</div>
                <div className="text-sm text-purple-700">NFT Collections</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">{formatNumber(data.defi_protocols)}</div>
                <div className="text-sm text-green-700">DeFi Protocols</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">First Activity</div>
                <div className="text-lg font-semibold">{data.first_activity}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Last Activity</div>
                <div className="text-lg font-semibold">{data.last_activity}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Analysis */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
              Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-red-500 mr-3" />
                  <div>
                    <div className="font-semibold text-red-900">Risk Level: {data.risk_level}</div>
                    <div className="text-sm text-red-700">Score: {data.score}/850</div>
                  </div>
                </div>
              </div>
              
              {data.risk_factors.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Identified Risk Factors:</p>
                  {data.risk_factors.map((factor, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-sm text-gray-700">{factor}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Token Holders Section */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-500" />
              Token Holders Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.token_holders && data.token_holders.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Token Holders Overview */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Token Name</p>
                      <p className="text-2xl font-bold text-gray-900">{data.token_info.name || 'Unknown Token'}</p>
                      <p className="text-sm text-gray-500">{data.token_info.symbol || ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Supply</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {ethers.formatUnits(data.token_info.totalSupply || '0', data.token_info.decimals || 18)} {data.token_info.symbol || 'tokens'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Top Holders List */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">Top Token Holders</p>
                    {data.token_holders.slice(0, 5).map((holder, index) => {
                      const totalSupply = data.token_info.totalSupply || '0';
                      const holderValue = ethers.formatUnits(holder.value || '0', data.token_info.decimals || 18);
                      const holderPercentage = totalSupply !== '0' ? 
                        (Number(holder.value) / Number(totalSupply)) * 100 : 0;
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white text-xs font-bold">{index + 1}</span>
                            </div>
                            <div>
                              <div className="font-semibold">{holder.address.slice(0, 8)}...{holder.address.slice(-6)}</div>
                              <div className="text-sm text-gray-600">
                                {holderValue} {data.token_info.symbol || 'tokens'}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">
                              {formatPercentage(holderPercentage)}%
                            </div>
                            <div className="text-xs text-gray-500">of total supply</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Distribution Stats */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">Distribution Analysis</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Top 5 Holders</span>
                        <span className="font-medium">
                          {formatPercentage(
                            (data.token_holders.slice(0, 5).reduce((acc, h) => acc + Number(h.value), 0) / 
                            Number(data.token_info.totalSupply || '1')) * 100
                          )}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ 
                            width: `${formatPercentage(
                              (data.token_holders.slice(0, 5).reduce((acc, h) => acc + Number(h.value), 0) / 
                              Number(data.token_info.totalSupply || '1')) * 100
                            )}%` 
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Remaining Holders</span>
                        <span className="font-medium">
                          {formatPercentage(
                            (data.token_holders.slice(5).reduce((acc, h) => acc + Number(h.value), 0) / 
                            Number(data.token_info.totalSupply || '1')) * 100
                          )}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-pink-500 h-2 rounded-full" 
                          style={{ 
                            width: `${formatPercentage(
                              (data.token_holders.slice(5).reduce((acc, h) => acc + Number(h.value), 0) / 
                              Number(data.token_info.totalSupply || '1')) * 100
                            )}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center text-sm">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-2" />
                      <span className="text-gray-600">Top 5 Holders</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-3 h-3 bg-pink-500 rounded-full mr-2" />
                      <span className="text-gray-600">Remaining Holders</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-900 mb-2">No Token Holders Data Available</p>
                <p className="text-sm text-gray-600">
                  This address doesn't have any associated token holders data at the moment.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
