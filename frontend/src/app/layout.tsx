import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReduxProvider } from '@/store/provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Generation-D Bewerbung',
  description: 'Bewirb dich beim Social Startup Wettbewerb Generation-D.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={`${inter.className} bg-[#FDCC89]`}>
        <ReduxProvider>
          <div className="flex flex-col min-h-screen justify-center">
            <div className="flex-grow flex items-center justify-center">
              {children}
            </div>
          </div>
        </ReduxProvider>
      </body>
    </html>
  )
}
