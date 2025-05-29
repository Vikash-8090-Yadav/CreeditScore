"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Coins, History, Shield, TrendingUp, ExternalLink, Download } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface DetailedAnalysisProps {
  data: any
  onBack: () => void
}

const mockTransactionHistory = [
  { date: "2024-01", transactions: 45, volume: 12500 },
  { date: "2024-02", transactions: 52, volume: 15800 },
  { date: "2024-03", transactions: 38, volume: 9200 },
  { date: "2024-04", transactions: 61, volume: 18900 },
  { date: "2024-05", transactions: 47, volume: 13400 },
  { date: "2024-06", transactions: 55, volume: 16700 },
]

const mockTokens = [
  { name: "ETH", symbol: "ETH", balance: "2.45", value: "$4,900", percentage: 45 },
  { name: "USDC", symbol: "USDC", balance: "3,200", value: "$3,200", percentage: 30 },
  { name: "LINK", symbol: "LINK", balance: "150", value: "$1,500", percentage: 15 },
  { name: "UNI", symbol: "UNI", balance: "80", value: "$800", percentage: 7 },
  { name: "Others", symbol: "OTHER", balance: "-", value: "$300", percentage: 3 },
]

const mockRiskAnalysis = [
  { category: "Transaction Patterns", score: 85, status: "Good" },
  { category: "Counterparty Risk", score: 72, status: "Medium" },
  { category: "Protocol Interactions", score: 90, status: "Excellent" },
  { category: "Liquidity Behavior", score: 78, status: "Good" },
  { category: "Compliance Score", score: 95, status: "Excellent" },
]

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

export default function DetailedAnalysis({ data, onBack }: DetailedAnalysisProps) {
  const [activeTab, setActiveTab] = useState("tokens")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack} className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Explorer
            </Button>
          </div>
        </div>

        {/* Score Summary */}
        <Card className="mb-8 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{data.score}</div>
                <div className="text-sm text-gray-600">Credit Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">{data.total_transactions.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">{data.tokens}</div>
                <div className="text-sm text-gray-600">Unique Tokens</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">{data.defi_protocols}</div>
                <div className="text-sm text-gray-600">DeFi Protocols</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/90 backdrop-blur-sm">
            <TabsTrigger value="tokens" className="flex items-center">
              <Coins className="w-4 h-4 mr-2" />
              Tokens
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Risk Analysis
            </TabsTrigger>
            <TabsTrigger value="improvement" className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Improvement
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tokens" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Token Holdings */}
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Token Holdings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTokens.map((token, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-xs font-bold">{token.symbol.slice(0, 2)}</span>
                          </div>
                          <div>
                            <div className="font-semibold">{token.name}</div>
                            <div className="text-sm text-gray-600">
                              {token.balance} {token.symbol}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{token.value}</div>
                          <div className="text-sm text-gray-600">{token.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Portfolio Distribution */}
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Portfolio Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mockTokens}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="percentage"
                        label={({ name, percentage }) => `${name} ${percentage}%`}
                      >
                        {mockTokens.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Token Metrics */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Token Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{data.tokens}</div>
                    <div className="text-sm text-blue-700">Unique Tokens</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">{data.nfts}</div>
                    <div className="text-sm text-green-700">NFT Collections</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1">$10.7K</div>
                    <div className="text-sm text-purple-700">Total Portfolio Value</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {/* Transaction History Chart */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Transaction Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockTransactionHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="transactions" fill="#3B82F6" />
                    <Line yAxisId="right" type="monotone" dataKey="volume" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">First Activity</span>
                    <Badge variant="secondary">{data.first_activity}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Last Activity</span>
                    <Badge variant="secondary">{data.last_activity}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Active Days</span>
                    <Badge variant="secondary">847 days</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Average Daily Transactions</span>
                    <Badge variant="secondary">3.2</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            {/* Risk Score Breakdown */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Risk Assessment Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRiskAnalysis.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{item.score}/100</span>
                          <Badge
                            variant={
                              item.status === "Excellent"
                                ? "default"
                                : item.status === "Good"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item.score >= 90 ? "bg-green-500" : item.score >= 75 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Factors */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Identified Risk Factors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.risk_factors.length > 0 ? (
                    data.risk_factors.map((factor: string, index: number) => (
                      <div key={index} className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                        <Shield className="w-5 h-5 text-red-500 mr-3" />
                        <span className="text-sm text-red-700">{factor}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
                      <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-green-700 font-medium">No significant risk factors detected</p>
                      <p className="text-green-600 text-sm">Your address shows healthy transaction patterns</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="improvement" className="space-y-6">
            {/* Improvement Recommendations */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Score Improvement Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Quick Wins (+20-50 points)</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h5 className="font-medium text-blue-900">Diversify Token Holdings</h5>
                        <p className="text-sm text-blue-700">Add 3-5 more established tokens to your portfolio</p>
                        <Badge variant="secondary" className="mt-2">
                          +25 points
                        </Badge>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h5 className="font-medium text-green-900">Increase DeFi Activity</h5>
                        <p className="text-sm text-green-700">Participate in 2-3 additional DeFi protocols</p>
                        <Badge variant="secondary" className="mt-2">
                          +30 points
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Long-term Strategies (+50-100 points)</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <h5 className="font-medium text-purple-900">Build Transaction History</h5>
                        <p className="text-sm text-purple-700">Maintain consistent activity over 6+ months</p>
                        <Badge variant="secondary" className="mt-2">
                          +60 points
                        </Badge>
                      </div>
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <h5 className="font-medium text-orange-900">Governance Participation</h5>
                        <p className="text-sm text-orange-700">Vote in DAO proposals and governance decisions</p>
                        <Badge variant="secondary" className="mt-2">
                          +40 points
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Score Projection */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Score Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Potential Score: {data.score + 85}</h3>
                  <p className="text-gray-600 mb-4">
                    By implementing our recommendations, you could improve your score by up to 85 points
                  </p>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Start Improvement Plan</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
