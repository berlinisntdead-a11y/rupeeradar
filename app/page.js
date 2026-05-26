'use client'

import { useState, useMemo } from 'react'
import providers from '../data/providers.json'
import { calculateTransfer } from '../lib/calculateTransfer'

const TYPE_BADGE = {
  fintech:     { label: 'Fintech',   classes: 'bg-blue-100 text-blue-700' },
  nri_bank:    { label: 'NRI Bank',  classes: 'bg-purple-100 text-purple-700' },
  traditional: { label: 'Traditional', classes: 'bg-gray-100 text-gray-600' },
}

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
  const worstReceived = results[results.length - 1]?.amountReceived ?? 0

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-5 flex items-center gap-3">
          <span className="text-2xl font-bold text-orange-500">RupeeRadar</span>
          <span className="text-sm text-gray-500 hidden sm:inline">Best EUR → INR transfer rates</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Send money to India
          </h1>
          <p className="text-gray-500 text-base sm:text-lg">
            Compare {providers.length} providers — fees, rates and delivery speed
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
            {[100, 250, 500, 1000, 2000, 5000].map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  amount === preset
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                €{preset.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Savings callout */}
        {results.length > 1 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-4 text-sm text-orange-800 flex items-center gap-2">
            <span className="text-lg">💡</span>
            <span>
              Best provider saves you{' '}
              <strong>
                ₹{Math.round(results[0].amountReceived - worstReceived).toLocaleString('en-IN')}
              </strong>{' '}
              vs the worst option for €{amount.toLocaleString()}
            </span>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-3 text-xs">
          {Object.values(TYPE_BADGE).map((b) => (
            <span key={b.label} className={`px-2 py-0.5 rounded-full font-medium ${b.classes}`}>
              {b.label}
            </span>
          ))}
        </div>

        {/* Results table — desktop */}
        <div className="hidden sm:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Provider</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Fee</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Rate</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Recipient gets</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Speed</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.map((r, i) => {
                const isBest = r.name === bestProvider
                const badge = TYPE_BADGE[r.type]
                return (
                  <tr
                    key={r.name}
                    className={isBest ? 'bg-orange-50' : 'hover:bg-gray-50 transition-colors'}
                  >
                    {/* Provider name + badges + notes */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900">{r.name}</span>
                        {isBest && (
                          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            Best Value
                          </span>
                        )}
                        {badge && (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.classes}`}>
                            {badge.label}
                          </span>
                        )}
                      </div>
                      {r.notes && (
                        <p className="text-xs text-gray-400 mt-0.5 max-w-xs">{r.notes}</p>
                      )}
                    </td>

                    {/* Fee */}
                    <td className="px-5 py-3.5 text-right text-gray-700 align-top">
                      {r.fee === 0 ? (
                        <span className="text-green-600 font-medium">Free</span>
                      ) : (
                        `€${r.fee.toFixed(2)}`
                      )}
                    </td>

                    {/* Rate */}
                    <td className="px-5 py-3.5 text-right text-gray-700 align-top">
                      {r.exchange_rate.toFixed(2)}
                    </td>

                    {/* Amount received */}
                    <td className={`px-5 py-3.5 text-right font-bold align-top ${isBest ? 'text-orange-600' : 'text-gray-900'}`}>
                      ₹{r.amountReceived.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>

                    {/* Speed */}
                    <td className="px-5 py-3.5 text-right text-gray-500 text-xs align-top whitespace-nowrap">
                      {r.delivery_speed}
                    </td>

                    {/* CTA */}
                    <td className="px-5 py-3.5 text-right align-top">
                      <a
                        href={r.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
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
            const badge = TYPE_BADGE[r.type]
            return (
              <div
                key={r.name}
                className={`rounded-2xl border p-4 ${
                  isBest ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2 gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-gray-900">{r.name}</span>
                      {isBest && (
                        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          Best Value
                        </span>
                      )}
                      {badge && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.classes}`}>
                          {badge.label}
                        </span>
                      )}
                    </div>
                    {r.notes && (
                      <p className="text-xs text-gray-400 mt-0.5">{r.notes}</p>
                    )}
                  </div>
                  <a
                    href={r.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Send →
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-y-1 text-sm mt-3">
                  <span className="text-gray-500">Recipient gets</span>
                  <span className={`text-right font-bold ${isBest ? 'text-orange-600' : 'text-gray-900'}`}>
                    ₹{r.amountReceived.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-gray-500">Fee</span>
                  <span className="text-right text-gray-700">
                    {r.fee === 0 ? <span className="text-green-600 font-medium">Free</span> : `€${r.fee.toFixed(2)}`}
                  </span>
                  <span className="text-gray-500">Rate</span>
                  <span className="text-right text-gray-700">{r.exchange_rate.toFixed(2)}</span>
                  <span className="text-gray-500">Speed</span>
                  <span className="text-right text-gray-500 text-xs">{r.delivery_speed}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Rates updated periodically. Mid-market EUR/INR ~111.33 (May 2026).
          Always verify on the provider's site before sending.
        </p>
      </div>
    </main>
  )
}
