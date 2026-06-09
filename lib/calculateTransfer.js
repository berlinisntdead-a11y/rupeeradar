/**
 * Calculates transfer output for a given provider against a live mid-market rate.
 *
 * @param {number} amount           - Amount sent in EUR
 * @param {object} provider         - Provider entry from providers.json
 * @param {number} midMarketRate    - Live EUR/INR mid-market rate (from Wise API)
 * @returns {{ fee: number, amountReceived: number, effectiveRate: number }}
 */
export function calculateTransfer(amount, provider, midMarketRate) {
  // Provider's effective rate = mid-market minus their markup
  const effectiveRate = midMarketRate * (1 - (provider.rate_markup_percent ?? 0) / 100)

  // Flat fee — some providers waive it above a threshold (e.g. XE: €3 below €1k, free above)
  const flatFee = (provider.fee_flat_free_above != null && amount >= provider.fee_flat_free_above)
    ? 0
    : (provider.fee_flat ?? 0)

  const fee = flatFee + (amount * (provider.fee_percent ?? 0)) / 100

  const amountAfterFee = Math.max(0, amount - fee)
  const amountReceived = amountAfterFee * effectiveRate

  return {
    fee: Math.max(0, fee),
    amountReceived: Math.max(0, amountReceived),
    effectiveRate,
  }
}
