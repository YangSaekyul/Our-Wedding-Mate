'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '@/lib/store'

export default function ProfilePage() {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const { user, token, updateUser } = useAuthStore()

    const fetchUserProfile = useCallback(async () => {
        try {
            const response = await fetch('/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || '프로필을 불러오는데 실패했습니다.')
            }

            updateUser(data.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
        } finally {
            setIsLoading(false)
        }
    }, [token, updateUser])

    useEffect(() => {
        if (token) {
            fetchUserProfile()
        } else {
            setError('로그인이 필요합니다.')
            setIsLoading(false)
        }
    }, [token, fetchUserProfile])

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
            <div>
                <h1 className="text-3xl font-bold text-secondary-900">프로필</h1>
                <p className="text-secondary-600 mt-1">
                    내 정보를 확인하고 관리하세요
                </p>
            </div>

            {/* 프로필 정보 */}
            <div className="card">
                <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                    내 정보
                </h2>
                {user ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1">
                                이름
                            </label>
                            <p className="text-secondary-900">{user.name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1">
                                이메일
                            </label>
                            <p className="text-secondary-900">{user.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1">
                                커플 ID
                            </label>
                            <p className="text-secondary-900">{user.coupleId || '없음'}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-secondary-500">사용자 정보를 불러올 수 없습니다.</p>
                )}
            </div>
        </div>
    )
}
