'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store'
import { BudgetItem, CreateBudgetItemData } from '@/types'

export default function BudgetPage() {
    const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [showAddForm, setShowAddForm] = useState(false)
    const [newItem, setNewItem] = useState<CreateBudgetItemData>({
        category: '',
        item: '',
        amount: 0,
        paidBy: '공동'
    })
    const { token } = useAuthStore()

    useEffect(() => {
        if (token) {
            fetchBudgetItems()
        } else {
            setError('로그인이 필요합니다.')
            setIsLoading(false)
        }
    }, [token])

    const fetchBudgetItems = async () => {
        try {
            const response = await fetch('/api/budget', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || '예산 항목을 불러오는데 실패했습니다.')
            }

            setBudgetItems(data.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newItem.item.trim() || newItem.amount <= 0) return

        try {
            const response = await fetch('/api/budget', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newItem)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || '예산 항목 추가에 실패했습니다.')
            }

            setNewItem({
                category: '',
                item: '',
                amount: 0,
                paidBy: '공동'
            })
            setShowAddForm(false)
            fetchBudgetItems()
        } catch (err) {
            setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
        }
    }

    // 예산 통계 계산
    const totalBudget = budgetItems.reduce((sum, item) => sum + item.amount, 0)
    const spentByGroom = budgetItems
        .filter(item => item.paidBy === '신랑')
        .reduce((sum, item) => sum + item.amount, 0)
    const spentByBride = budgetItems
        .filter(item => item.paidBy === '신부')
        .reduce((sum, item) => sum + item.amount, 0)
    const spentByBoth = budgetItems
        .filter(item => item.paidBy === '공동')
        .reduce((sum, item) => sum + item.amount, 0)

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

    return (
        <div className="space-y-6">
            {/* 헤더 */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">예산 관리</h1>
                    <p className="text-secondary-600 mt-1">
                        웨딩 예산을 체계적으로 관리하세요
                    </p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="btn-primary"
                >
                    {showAddForm ? '취소' : '항목 추가'}
                </button>
            </div>

            {/* 예산 요약 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                        총 예산
                    </h3>
                    <p className="text-2xl font-bold text-secondary-900">
                        {totalBudget.toLocaleString()}원
                    </p>
                </div>
                <div className="card">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                        신랑 카드/계좌
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">
                        {spentByGroom.toLocaleString()}원
                    </p>
                </div>
                <div className="card">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                        신부 카드/계좌
                    </h3>
                    <p className="text-2xl font-bold text-pink-600">
                        {spentByBride.toLocaleString()}원
                    </p>
                </div>
                <div className="card">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                        공동 계좌
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                        {spentByBoth.toLocaleString()}원
                    </p>
                </div>
            </div>

            {/* 새 항목 추가 폼 */}
            {showAddForm && (
                <div className="card">
                    <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                        새 예산 항목 추가
                    </h2>
                    <form onSubmit={handleAddItem} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    카테고리 *
                                </label>
                                <select
                                    value={newItem.category}
                                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                    className="input-field"
                                    required
                                >
                                    <option value="">카테고리 선택</option>
                                    <option value="스드메">스드메 (스튜디오, 드레스, 메이크업)</option>
                                    <option value="웨딩홀">웨딩홀</option>
                                    <option value="예물">예물</option>
                                    <option value="꽃">꽃</option>
                                    <option value="기타">기타</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    항목명 *
                                </label>
                                <input
                                    type="text"
                                    value={newItem.item}
                                    onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
                                    className="input-field"
                                    placeholder="항목명을 입력하세요"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    금액 (원) *
                                </label>
                                <input
                                    type="number"
                                    value={newItem.amount}
                                    onChange={(e) => setNewItem({ ...newItem, amount: parseInt(e.target.value) || 0 })}
                                    className="input-field"
                                    placeholder="금액을 입력하세요"
                                    required
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    결제 방식 *
                                </label>
                                <select
                                    value={newItem.paidBy}
                                    onChange={(e) => setNewItem({ ...newItem, paidBy: e.target.value })}
                                    className="input-field"
                                    required
                                >
                                    <option value="신랑">신랑 카드/계좌</option>
                                    <option value="신부">신부 카드/계좌</option>
                                    <option value="공동">공동 계좌</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button type="submit" className="btn-primary">
                                추가
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="btn-secondary"
                            >
                                취소
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* 예산 항목 목록 */}
            <div className="card">
                <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                    예산 항목 목록
                </h2>
                {budgetItems.length > 0 ? (
                    <div className="space-y-3">
                        {budgetItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-secondary-500 bg-secondary-100 px-2 py-1 rounded">
                                            {item.category}
                                        </span>
                                        <span className="font-medium text-secondary-900">
                                            {item.item}
                                        </span>
                                        <span className={`text-sm px-2 py-1 rounded ${item.paidBy === '신랑' ? 'bg-blue-100 text-blue-800' :
                                            item.paidBy === '신부' ? 'bg-pink-100 text-pink-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                            {item.paidBy}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-lg font-semibold text-secondary-900">
                                    {item.amount.toLocaleString()}원
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-secondary-500 text-center py-8">
                        등록된 예산 항목이 없습니다. 새 항목을 추가해보세요!
                    </p>
                )}
            </div>
        </div>
    )
}
