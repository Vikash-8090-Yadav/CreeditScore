"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, Search, BarChart3, CheckCircle } from "lucide-react"

interface LoadingExperienceProps {
  address: string
  network: string
}

const stages = [
  {
    id: 1,
    title: "Connecting to Blockchain",
    description: "Establishing secure connection to network nodes",
    icon: Search,
    duration: 3000,
  },
  {
    id: 2,
    title: "Fetching Transaction History",
    description: "Retrieving and parsing transaction data",
    icon: BarChart3,
    duration: 5000,
  },
  {
    id: 3,
    title: "Analyzing Risk Patterns",
    description: "Running AI analysis on transaction patterns",
    icon: Shield,
    duration: 7000,
  },
  {
    id: 4,
    title: "Generating Credit Score",
    description: "Calculating final score and recommendations",
    icon: CheckCircle,
    duration: 5000,
  },
]

export default function LoadingExperience({ address, network }: LoadingExperienceProps) {
  const [currentStage, setCurrentStage] = useState(0)
  const [progress, setProgress] = useState(0)
  const [stageProgress, setStageProgress] = useState(0)

  useEffect(() => {
    let stageTimer: NodeJS.Timeout
    let progressTimer: NodeJS.Timeout

    const runStage = (stageIndex: number) => {
      if (stageIndex >= stages.length) return

      const stage = stages[stageIndex]
      setCurrentStage(stageIndex)
      setStageProgress(0)

      // Animate stage progress
      const startTime = Date.now()
      progressTimer = setInterval(() => {
        const elapsed = Date.now() - startTime
        const stageProgressValue = Math.min((elapsed / stage.duration) * 100, 100)
        setStageProgress(stageProgressValue)

        // Update overall progress
        const overallProgress = (stageIndex * 100 + stageProgressValue) / stages.length
        setProgress(overallProgress)
      }, 50)

      // Move to next stage
      stageTimer = setTimeout(() => {
        clearInterval(progressTimer)
        runStage(stageIndex + 1)
      }, stage.duration)
    }

    runStage(0)

    return () => {
      clearTimeout(stageTimer)
      clearInterval(progressTimer)
    }
  }, [])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Address</h1>
            <p className="text-gray-600">
              {formatAddress(address)} on {network.charAt(0).toUpperCase() + network.slice(1)}
            </p>
          </div>

          {/* Overall Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Stages */}
          <div className="space-y-4">
            {stages.map((stage, index) => {
              const isActive = index === currentStage
              const isCompleted = index < currentStage
              const Icon = stage.icon

              return (
                <div
                  key={stage.id}
                  className={`flex items-center p-4 rounded-lg border-2 transition-all duration-300 ${
                    isActive
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : isCompleted
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                      isActive
                        ? "bg-blue-500 text-white"
                        : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className={`w-5 h-5 ${isActive ? "animate-pulse" : ""}`} />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3
                      className={`font-semibold ${
                        isActive ? "text-blue-900" : isCompleted ? "text-green-900" : "text-gray-700"
                      }`}
                    >
                      {stage.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        isActive ? "text-blue-700" : isCompleted ? "text-green-700" : "text-gray-500"
                      }`}
                    >
                      {stage.description}
                    </p>

                    {isActive && (
                      <div className="mt-2">
                        <Progress value={stageProgress} className="h-1" />
                      </div>
                    )}
                  </div>

                  {isActive && (
                    <div className="ml-4">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Fun Facts */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">💡 Did you know?</h4>
            <p className="text-sm text-gray-700">
              We analyze over 50 different risk factors including transaction patterns, smart contract interactions, and
              network behavior to generate your score.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
