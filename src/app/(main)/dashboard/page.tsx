'use client'

import { useEffect, useState } from 'react'
import { DashboardData } from '@/types'
import { useAuthStore } from '@/lib/store'

export default function DashboardPage() {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const { token } = useAuthStore()

    useEffect(() => {
        if (token) {
            fetchDashboardData()
        } else {
            setError('로그인이 필요합니다.')
            setIsLoading(false)
        }
    }, [token])

    const fetchDashboardData = async () => {
        try {
            const response = await fetch('/api/dashboard', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || '대시보드 데이터를 불러오는데 실패했습니다.')
            }

            setDashboardData(data.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="mt-2 text-secondary-600">로딩 중...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
            </div>
        )
    }

    if (!dashboardData) {
        return (
            <div className="text-center py-12">
                <p className="text-secondary-600">대시보드 데이터가 없습니다.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* 헤더 */}
            <div>
                <h1 className="text-3xl font-bold text-secondary-900">대시보드</h1>
                <p className="text-secondary-600 mt-1">
                    웨딩 준비 현황을 한눈에 확인하세요
                </p>
            </div>

            {/* D-Day 카드 */}
            {dashboardData.weddingDate && (
                <div className="card">
                    <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                        🎉 결혼식 D-Day
                    </h2>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-primary-600 mb-2">
                            {Math.ceil((new Date(dashboardData.weddingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}일
                        </div>
                        <p className="text-secondary-600">
                            {new Date(dashboardData.weddingDate).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                weekday: 'long'
                            })}
                        </p>
                    </div>
                </div>
            )}

            {/* 예산 요약 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                        총 예산
                    </h3>
                    <p className="text-2xl font-bold text-secondary-900">
                        {dashboardData.totalBudget.toLocaleString()}원
                    </p>
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                        지출 금액
                    </h3>
                    <p className="text-2xl font-bold text-red-600">
                        {dashboardData.spentAmount.toLocaleString()}원
                    </p>
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                        남은 예산
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                        {dashboardData.remainingBudget.toLocaleString()}원
                    </p>
                </div>
            </div>

            {/* 최근 활동 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 최근 할 일 */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                        최근 할 일
                    </h3>
                    {dashboardData.recentTodos.length > 0 ? (
                        <div className="space-y-2">
                            {dashboardData.recentTodos.map((todo) => (
                                <div key={todo.id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={todo.isCompleted}
                                        readOnly
                                        className="rounded"
                                    />
                                    <span className={`text-sm ${todo.isCompleted ? 'line-through text-secondary-500' : 'text-secondary-900'}`}>
                                        {todo.content}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-secondary-500 text-sm">등록된 할 일이 없습니다.</p>
                    )}
                </div>

                {/* 최근 업체 */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                        최근 업체
                    </h3>
                    {dashboardData.recentVendors.length > 0 ? (
                        <div className="space-y-2">
                            {dashboardData.recentVendors.map((vendor) => (
                                <div key={vendor.id} className="text-sm">
                                    <p className="font-medium text-secondary-900">{vendor.name}</p>
                                    <p className="text-secondary-500">{vendor.category}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-secondary-500 text-sm">등록된 업체가 없습니다.</p>
                    )}
                </div>

                {/* 최근 예산 항목 */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                        최근 예산 항목
                    </h3>
                    {dashboardData.recentBudgetItems.length > 0 ? (
                        <div className="space-y-2">
                            {dashboardData.recentBudgetItems.map((item) => (
                                <div key={item.id} className="text-sm">
                                    <p className="font-medium text-secondary-900">{item.item}</p>
                                    <p className="text-secondary-500">
                                        {item.amount.toLocaleString()}원 · {item.paidBy}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-secondary-500 text-sm">등록된 예산 항목이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
