'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/store'

const navigation = [
    { name: '대시보드', href: '/dashboard', icon: '🏠' },
    { name: '할 일', href: '/todos', icon: '✅' },
    { name: '업체 관리', href: '/vendors', icon: '🏢' },
    { name: '예산 관리', href: '/budget', icon: '💰' },
    { name: '위시리스트', href: '/wishlist', icon: '🎁' },
    { name: '마이페이지', href: '/profile', icon: '👤' },
]

export default function Sidebar() {
    const pathname = usePathname()
    const { user, logout } = useAuthStore()

    const handleLogout = () => {
        logout()
    }

    return (
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <div className="flex flex-col h-full">
                {/* 로고 */}
                <div className="flex items-center justify-center h-16 px-4 border-b border-secondary-200">
                    <h1 className="text-xl font-bold text-primary-600">
                        Our Wedding Mate
                    </h1>
                </div>

                {/* 사용자 정보 */}
                <div className="p-4 border-b border-secondary-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-medium">
                                {user?.name?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-secondary-900">
                                {user?.name || '사용자'}
                            </p>
                            <p className="text-xs text-secondary-500">
                                {user?.email || ''}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 네비게이션 */}
                <nav className="flex-1 px-4 py-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                                    }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* 로그아웃 버튼 */}
                <div className="p-4 border-t border-secondary-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 transition-colors"
                    >
                        <span className="text-lg">🚪</span>
                        <span>로그아웃</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
