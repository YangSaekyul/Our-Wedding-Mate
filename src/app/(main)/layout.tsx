'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import Sidebar from '@/components/common/Sidebar'

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isAuthenticated, user } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login')
        }
    }, [isAuthenticated, router])

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="mt-2 text-secondary-600">로딩 중...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-secondary-50">
            <div className="flex">
                <Sidebar />
                <main className="flex-1 ml-64">
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
