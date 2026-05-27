import ComparisonTable from './components/ComparisonTable'
import providers from '../data/providers.json'

// Revalidate the page server-side every 5 minutes
export const revalidate = 300

const FALLBACK_RATE = 111.33

async function getLiveMidMarketRate() {
  try {
    const res = await fetch('https://api.wise.com/v1/rates?source=EUR&target=INR', {
      next: { revalidate: 300 },
    })
    if (!res.ok) throw new Error(`Wise API responded ${res.status}`)
    const data = await res.json()
    const rate = data[0]?.rate
    if (!rate || isNaN(rate)) throw new Error('Invalid rate in response')
    return { rate, live: true }
  } catch (err) {
    console.warn('Wise rate fetch failed, using fallback:', err.message)
    return { rate: FALLBACK_RATE, live: false }
  }
}

export default async function Home() {
  const { rate: midMarketRate, live } = await getLiveMidMarketRate()

  const now = new Date()
  const rateUpdatedAt = live
    ? `updated ${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} UTC`
    : 'using cached rate'

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-5 flex items-center gap-3">
          <span className="text-2xl font-bold text-green-600">RupeeRadar</span>
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

        {/* Interactive table — client component */}
        <ComparisonTable
          providers={providers}
          midMarketRate={midMarketRate}
          rateUpdatedAt={rateUpdatedAt}
        />

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Mid-market rate sourced from Wise API. Provider markups are indicative — verify before sending.
        </p>
      </div>
    </main>
  )
}
