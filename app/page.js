'use client'

import { useState, useMemo } from 'react'
import providers from '../data/providers.json'
import { calculateTransfer } from '../lib/calculateTransfer'

export default function Home() {
  const [amount, setAmount] = useState(500)

  const results = useMemo(() => {
    return providers
      .map((provider) => ({
        ...provider,
        ...calculateTransfer(amount, provider),
      }))
      .sort((a, b) => b.amountReceived - a.amountReceived)
  }, [amount])

  const bestProvider = results[0]?.name

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center gap-3">
          <span className="text-2xl font-bold text-orange-500">RupeeRadar</span>
          <span className="text-sm text-gray-500 hidden sm:inline">Best EUR → INR transfer rates</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Send money to India
          </h1>
          <p className="text-gray-500 text-base sm:text-lg">
            Compare live fees and rates from top remittance providers
          </p>
        </div>

        {/* Amount input */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            You send (EUR)
          </label>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold text-gray-400">€</span>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
              className="flex-1 text-3xl font-bold text-gray-900 border-0 outline-none bg-transparent focus:ring-0 w-full"
              placeholder="500"
            />
          </div>
          {/* Quick-select amounts */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[100, 250, 500, 1000, 2000].map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  amount === preset
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                €{preset}
              </button>
            ))}
          </div>
        </div>

        {/* Results table — desktop */}
        <div className="hidden sm:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Provider</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Fee</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Rate (EUR/INR)</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Recipient gets</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Speed</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.map((r) => {
                const isBest = r.name === bestProvider
                return (
                  <tr
                    key={r.name}
                    className={isBest ? 'bg-orange-50' : 'hover:bg-gray-50 transition-colors'}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{r.name}</span>
                        {isBest && (
                          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            Best Value
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right text-gray-700">
                      €{r.fee.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-right text-gray-700">
                      {r.exchange_rate.toFixed(2)}
                    </td>
                    <td className={`px-5 py-4 text-right font-bold ${isBest ? 'text-orange-600' : 'text-gray-900'}`}>
                      ₹{r.amountReceived.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-5 py-4 text-right text-gray-500 text-xs">
                      {r.delivery_speed}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <a
                        href={r.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Send →
                      </a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Results cards — mobile */}
        <div className="sm:hidden flex flex-col gap-3">
          {results.map((r) => {
            const isBest = r.name === bestProvider
            return (
              <div
                key={r.name}
                className={`rounded-2xl border p-4 ${
                  isBest
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{r.name}</span>
                    {isBest && (
                      <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        Best Value
                      </span>
                    )}
                  </div>
                  <a
                    href={r.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Send →
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-y-1 text-sm">
                  <span className="text-gray-500">Recipient gets</span>
                  <span className={`text-right font-bold ${isBest ? 'text-orange-600' : 'text-gray-900'}`}>
                    ₹{r.amountReceived.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-gray-500">Fee</span>
                  <span className="text-right text-gray-700">€{r.fee.toFixed(2)}</span>
                  <span className="text-gray-500">Rate</span>
                  <span className="text-right text-gray-700">{r.exchange_rate.toFixed(2)}</span>
                  <span className="text-gray-500">Speed</span>
                  <span className="text-right text-gray-500 text-xs">{r.delivery_speed}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Rates are indicative and updated periodically. Always verify on the provider's site before sending.
        </p>
      </div>
    </main>
  )
}
