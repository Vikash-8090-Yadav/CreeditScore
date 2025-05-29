"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Wifi, Clock, Search, RefreshCw, Home, AlertCircle } from "lucide-react"

interface ErrorDisplayProps {
  error: string
  onRetry: () => void
}

const errorConfig = {
  network_error: {
    icon: Wifi,
    title: "Network Connection Error",
    description: "Unable to connect to the blockchain network. Please check your internet connection and try again.",
    suggestion: "This usually resolves itself within a few minutes. You can also try switching networks.",
  },
  no_activity: {
    icon: Search,
    title: "No Activity Found",
    description:
      "We couldn't find any transaction history for this address. This might be a new address or one with very limited activity.",
    suggestion: "Make sure the address is correct and has some transaction history on the selected network.",
  },
  rate_limit: {
    icon: Clock,
    title: "Rate Limit Exceeded",
    description: "Too many requests have been made recently. Please wait a moment before trying again.",
    suggestion:
      "Our systems are designed to handle high traffic, but sometimes we need to slow things down to ensure quality service for everyone.",
  },
  invalid_address: {
    icon: AlertTriangle,
    title: "Invalid Address Format",
    description:
      "The address format doesn't match the selected network. Please verify the address and network selection.",
    suggestion: "Double-check that you've selected the correct network for your address.",
  },
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  const config = errorConfig[error as keyof typeof errorConfig] || errorConfig.network_error
  const Icon = config.icon

  const getErrorMessage = () => {
    switch (error) {
      case "network_error":
        return "Network error occurred. Please check your connection and try again."
      case "no_activity":
        return "No activity found for this address."
      case "rate_limit":
        return "Rate limit exceeded. Please try again later."
      case "coming_soon":
        return "Analysis for this blockchain is coming soon! Currently, we only support Ethereum."
      default:
        return "An unexpected error occurred. Please try again."
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon className="w-10 h-10 text-red-500" />
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{config.title}</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">{getErrorMessage()}</p>

          {/* Suggestion */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-700">
              <strong>💡 Tip:</strong> {config.suggestion}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {error !== "coming_soon" && (
              <Button onClick={onRetry} className="bg-gradient-to-r from-blue-600 to-purple-600">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Still having issues?</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                Check Network Status
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                Contact Support
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                View Documentation
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
