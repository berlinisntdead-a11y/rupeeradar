import './globals.css'

export const metadata = {
  title: 'RupeeRadar — Best EUR to INR Transfer Rates',
  description: 'Compare remittance providers sending money from Europe to India. Find the best exchange rates and lowest fees.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
