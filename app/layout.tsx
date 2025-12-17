import type { Metadata } from 'next'
import { Quicksand } from 'next/font/google'
import './globals.css'

const quicksand = Quicksand({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Grandpa's Hug",
  description: 'Your friend for stories, fun & gentle advice',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={quicksand.className}>
        <div className="app-container">
            {children}
        </div>
      </body>
    </html>
  )
}
