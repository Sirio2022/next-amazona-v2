import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/header/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Amazing Ecommerce',
  description: 'Ecommerce made with Next.js and TailwindCSS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className='min-h-screen flex flex-col'>
          <Header />
          {children}
          <footer className='footer footer-center p-4 bg-base-300 text-base-content'>
            <p>
              Copyright &copy; 2024 - All rights reserved by Juan Manuel Alvarez.
            </p>
          </footer>
        </div>
      </body>
    </html>
  )
}
