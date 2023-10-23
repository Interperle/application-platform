import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReduxProvider } from '@/store/provider'
import Apl_Header from '@/components/header'
import Apl_Footer from "@/components/footer";


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
    <html lang="en">
      <body className={`${inter.className} bg-[#FDCC89]`}>
        <ReduxProvider>
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
              {children}
            </div>
            <Apl_Footer/>
          </div>
        </ReduxProvider>
      </body>
    </html>
  )
}
