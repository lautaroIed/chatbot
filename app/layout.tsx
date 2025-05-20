import { Inter } from 'next/font/google'
import './globals.css'
import './markdown-styles.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>{children}</body>
    </html>
  )
}

