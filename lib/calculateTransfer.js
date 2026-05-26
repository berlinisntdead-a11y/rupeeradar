/**
 * Calculates transfer output for a given provider.
 * @param {number} amount - Send amount in EUR
 * @param {object} provider - Provider entry from providers.json
 * @returns {{ fee: number, amountReceived: number, effectiveRate: number }}
 */
export function calculateTransfer(amount, provider) {
  const fee = provider.fee_flat + (amount * provider.fee_percent) / 100
  const amountAfterFee = amount - fee
  const amountReceived = amountAfterFee * provider.exchange_rate
  const effectiveRate = amountReceived / amount

  return {
    fee: Math.max(0, fee),
    amountReceived: Math.max(0, amountReceived),
    effectiveRate: Math.max(0, effectiveRate),
  }
}
