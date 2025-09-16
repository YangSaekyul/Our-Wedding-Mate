import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '@/components/common/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Our Wedding Mate - 웨딩 플래너',
    description: '예비 신혼부부를 위한 100% 프라이빗 협업 플래닝 툴',
    keywords: ['웨딩', '플래너', '결혼준비', '예산관리', '체크리스트'],
    authors: [{ name: 'Our Wedding Mate Team' }],
    openGraph: {
        title: 'Our Wedding Mate - 웨딩 플래너',
        description: '예비 신혼부부를 위한 100% 프라이빗 협업 플래닝 툴',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ko">
            <body className={inter.className}>
                <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
                    {children}
                    <Footer />
                </div>
            </body>
        </html>
    )
}
