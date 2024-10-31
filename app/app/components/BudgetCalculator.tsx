"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Calculator, Percent, DollarSign } from 'lucide-react'

export default function BudgetCalculator() {
  const [totalBudget, setTotalBudget] = useState(10000)
  const [channels, setChannels] = useState([
    { id: 1, name: 'Google Ads', allocation: 40, cpc: 2.5, convRate: 2.5 },
    { id: 2, name: 'LinkedIn Ads', allocation: 30, cpc: 5.5, convRate: 1.8 },
    { id: 3, name: 'Facebook Ads', allocation: 20, cpc: 1.2, convRate: 1.5 },
    { id: 4, name: 'Twitter Ads', allocation: 10, cpc: 2.0, convRate: 1.2 }
  ])

  const calculateMetrics = (channel) => {
    const budget = (totalBudget * channel.allocation) / 100
    const clicks = Math.floor(budget / channel.cpc)
    const conversions = Math.floor(clicks * (channel.convRate / 100))
    const cpa = conversions > 0 ? budget / conversions : 0
    return { budget, clicks, conversions, cpa }
  }

  const totalAllocation = channels.reduce((sum, channel) => sum + channel.allocation, 0)

  const handleAllocationChange = (id, value) => {
    const newValue = Math.max(0, Math.min(100, value))
    setChannels(channels.map(channel =>
      channel.id === id ? { ...channel, allocation: newValue } : channel
    ))
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-6 h-6" />
            Multi-Channel Marketing Budget Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Total Monthly Budget ($)</label>
            <Input
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(Math.max(0, Number(e.target.value)))}
              className="w-full"
              min="0"
            />
          </div>

          {totalAllocation !== 100 && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription className="flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Total allocation must equal 100% (currently: {totalAllocation}%)
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {channels.map(channel => {
              const metrics = calculateMetrics(channel)
              return (
                <div key={channel.id} className="border rounded p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">{channel.name}</h3>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={channel.allocation}
                        onChange={(e) => handleAllocationChange(channel.id, Number(e.target.value))}
                        className="w-20"
                        min="0"
                        max="100"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-sm">
                      <div className="text-muted-foreground">Budget</div>
                      <div className="font-medium">${metrics.budget.toLocaleString()}</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-muted-foreground">Est. Clicks</div>
                      <div className="font-medium">{metrics.clicks.toLocaleString()}</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-muted-foreground">Est. Conversions</div>
                      <div className="font-medium">{metrics.conversions.toLocaleString()}</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-muted-foreground">Est. CPA</div>
                      <div className="font-medium">
                        ${metrics.cpa > 0 ? metrics.cpa.toFixed(2) : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-secondary rounded">
            <h3 className="font-medium mb-2">Summary Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Total Clicks</div>
                <div className="font-medium">
                  {channels.reduce((sum, channel) => sum + calculateMetrics(channel).clicks, 0).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Conversions</div>
                <div className="font-medium">
                  {channels.reduce((sum, channel) => sum + calculateMetrics(channel).conversions, 0).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Avg. CPA</div>
                <div className="font-medium">
                  ${(totalBudget / channels.reduce((sum, channel) => sum + calculateMetrics(channel).conversions, 0) || 0).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
