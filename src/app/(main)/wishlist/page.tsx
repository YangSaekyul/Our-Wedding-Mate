'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '@/lib/store'
import { WishlistItem, CreateWishlistItemData } from '@/types'
import { getRecommendations, getAllCategories } from '@/lib/recommendations'

export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [showAddForm, setShowAddForm] = useState(false)
    const [showRecommendations, setShowRecommendations] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('')
    const [newItem, setNewItem] = useState<CreateWishlistItemData>({
        itemName: '',
        itemUrl: '',
        price: undefined
    })
    const { token } = useAuthStore()

    const fetchWishlistItems = useCallback(async () => {
        try {
            const response = await fetch('/api/wishlist', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || '위시리스트를 불러오는데 실패했습니다.')
            }

            setWishlistItems(data.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
        } finally {
            setIsLoading(false)
        }
    }, [token])

    useEffect(() => {
        if (token) {
            fetchWishlistItems()
        } else {
            setError('로그인이 필요합니다.')
            setIsLoading(false)
        }
    }, [token, fetchWishlistItems])

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newItem.itemName.trim()) return

        try {
            const response = await fetch('/api/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newItem)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || '위시리스트 항목 추가에 실패했습니다.')
            }

            setNewItem({
                itemName: '',
                itemUrl: '',
                price: undefined
            })
            setShowAddForm(false)
            fetchWishlistItems()
        } catch (err) {
            setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
        }
    }

    const handleTogglePurchase = async (id: string, isPurchased: boolean) => {
        try {
            const response = await fetch(`/api/wishlist/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isPurchased: !isPurchased })
            })

            if (!response.ok) {
                throw new Error('위시리스트 항목 수정에 실패했습니다.')
            }

            fetchWishlistItems()
        } catch (err) {
            setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
        }
    }

    const handleAddRecommendation = async (item: { name: string; price: number; url: string }) => {
        try {
            const response = await fetch('/api/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    itemName: item.name,
                    itemUrl: item.url,
                    price: item.price
                })
            })

            if (!response.ok) {
                throw new Error('추천 아이템 추가에 실패했습니다.')
            }

            fetchWishlistItems()
        } catch (err) {
            setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
        }
    }

    // 통계 계산
    const totalItems = wishlistItems.length
    const purchasedItems = wishlistItems.filter(item => item.isPurchased).length
    const remainingItems = totalItems - purchasedItems
    const totalPrice = wishlistItems.reduce((sum, item) => sum + (item.price || 0), 0)
    const purchasedPrice = wishlistItems
        .filter(item => item.isPurchased)
        .reduce((sum, item) => sum + (item.price || 0), 0)

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
                    <h1 className="text-3xl font-bold text-secondary-900">위시리스트</h1>
                    <p className="text-secondary-600 mt-1">
                        웨딩 관련 필요한 물건들을 관리하세요
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="btn-primary"
                    >
                        {showAddForm ? '취소' : '항목 추가'}
                    </button>
                    <button
                        onClick={() => setShowRecommendations(!showRecommendations)}
                        className="btn-secondary"
                    >
                        {showRecommendations ? '추천 닫기' : '추천 아이템'}
                    </button>
                </div>
            </div>

            {/* 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                        총 항목
                    </h3>
                    <p className="text-2xl font-bold text-secondary-900">
                        {totalItems}개
                    </p>
                </div>
                <div className="card">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                        구매 완료
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                        {purchasedItems}개
                    </p>
                </div>
                <div className="card">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                        남은 항목
                    </h3>
                    <p className="text-2xl font-bold text-orange-600">
                        {remainingItems}개
                    </p>
                </div>
                <div className="card">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                        총 예상 비용
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">
                        {totalPrice.toLocaleString()}원
                    </p>
                </div>
            </div>

            {/* 추천 아이템 */}
            {showRecommendations && (
                <div className="card">
                    <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                        추천 아이템
                    </h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                            카테고리 선택
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="input-field"
                        >
                            <option value="">카테고리를 선택하세요</option>
                            {getAllCategories().map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    {selectedCategory && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {getRecommendations(selectedCategory).map((item, index) => (
                                <div key={index} className="border border-secondary-200 rounded-lg p-4">
                                    <h3 className="font-medium text-secondary-900 mb-2">{item.name}</h3>
                                    <p className="text-lg font-semibold text-primary-600 mb-3">
                                        {item.price.toLocaleString()}원
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAddRecommendation(item)}
                                            className="btn-primary text-sm py-1 px-3"
                                        >
                                            위시리스트에 추가
                                        </button>
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-secondary text-sm py-1 px-3"
                                        >
                                            상품 보기
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* 새 항목 추가 폼 */}
            {showAddForm && (
                <div className="card">
                    <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                        새 위시리스트 항목 추가
                    </h2>
                    <form onSubmit={handleAddItem} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                항목명 *
                            </label>
                            <input
                                type="text"
                                value={newItem.itemName}
                                onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                                className="input-field"
                                placeholder="항목명을 입력하세요"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                링크 (쿠팡 파트너스 등)
                            </label>
                            <input
                                type="url"
                                value={newItem.itemUrl}
                                onChange={(e) => setNewItem({ ...newItem, itemUrl: e.target.value })}
                                className="input-field"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                예상 가격 (원)
                            </label>
                            <input
                                type="number"
                                value={newItem.price || ''}
                                onChange={(e) => setNewItem({ ...newItem, price: e.target.value ? parseInt(e.target.value) : undefined })}
                                className="input-field"
                                placeholder="예상 가격을 입력하세요"
                                min="0"
                            />
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

            {/* 위시리스트 목록 */}
            <div className="card">
                <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                    위시리스트 목록
                </h2>
                {wishlistItems.length > 0 ? (
                    <div className="space-y-3">
                        {wishlistItems.map((item) => (
                            <div key={item.id} className={`flex items-center justify-between p-3 border rounded-lg ${item.isPurchased ? 'border-green-200 bg-green-50' : 'border-secondary-200'
                                }`}>
                                <div className="flex items-center space-x-3 flex-1">
                                    <input
                                        type="checkbox"
                                        checked={item.isPurchased}
                                        onChange={() => handleTogglePurchase(item.id, item.isPurchased)}
                                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                    />
                                    <div className="flex-1">
                                        <span className={`font-medium ${item.isPurchased ? 'line-through text-secondary-500' : 'text-secondary-900'
                                            }`}>
                                            {item.itemName}
                                        </span>
                                        {item.itemUrl && (
                                            <div className="mt-1">
                                                <a
                                                    href={item.itemUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-primary-600 hover:text-primary-700"
                                                >
                                                    링크 보기 →
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {item.price && (
                                    <span className={`text-lg font-semibold ${item.isPurchased ? 'text-green-600' : 'text-secondary-900'
                                        }`}>
                                        {item.price.toLocaleString()}원
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-secondary-500 text-center py-8">
                        등록된 위시리스트 항목이 없습니다. 새 항목을 추가해보세요!
                    </p>
                )}
            </div>
        </div>
    )
}
