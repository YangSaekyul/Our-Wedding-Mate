'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store'
import { Vendor, CreateVendorData } from '@/types'

export default function VendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [showAddForm, setShowAddForm] = useState(false)
    const [newVendor, setNewVendor] = useState<CreateVendorData>({
        name: '',
        category: '',
        contact: '',
        cost: undefined,
        pros: '',
        cons: '',
        status: '고려 중'
    })
    const { token } = useAuthStore()

    useEffect(() => {
        if (token) {
            fetchVendors()
        } else {
            setError('로그인이 필요합니다.')
            setIsLoading(false)
        }
    }, [token])

    const fetchVendors = async () => {
        try {
            const response = await fetch('/api/vendors', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || '업체 목록을 불러오는데 실패했습니다.')
            }

            setVendors(data.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddVendor = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newVendor.name.trim()) return

        try {
            const response = await fetch('/api/vendors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newVendor)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || '업체 추가에 실패했습니다.')
            }

            setNewVendor({
                name: '',
                category: '',
                contact: '',
                cost: undefined,
                pros: '',
                cons: '',
                status: '고려 중'
            })
            setShowAddForm(false)
            fetchVendors()
        } catch (err) {
            setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
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

    return (
        <div className="space-y-6">
            {/* 헤더 */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">업체 관리</h1>
                    <p className="text-secondary-600 mt-1">
                        웨딩 관련 업체 정보를 관리하세요
                    </p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="btn-primary"
                >
                    {showAddForm ? '취소' : '업체 추가'}
                </button>
            </div>

            {/* 새 업체 추가 폼 */}
            {showAddForm && (
                <div className="card">
                    <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                        새 업체 추가
                    </h2>
                    <form onSubmit={handleAddVendor} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    업체명 *
                                </label>
                                <input
                                    type="text"
                                    value={newVendor.name}
                                    onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                                    className="input-field"
                                    placeholder="업체명을 입력하세요"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    카테고리 *
                                </label>
                                <select
                                    value={newVendor.category}
                                    onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}
                                    className="input-field"
                                    required
                                >
                                    <option value="">카테고리 선택</option>
                                    <option value="웨딩홀">웨딩홀</option>
                                    <option value="스튜디오">스튜디오</option>
                                    <option value="드레스">드레스</option>
                                    <option value="메이크업">메이크업</option>
                                    <option value="헤어">헤어</option>
                                    <option value="꽃">꽃</option>
                                    <option value="기타">기타</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    연락처
                                </label>
                                <input
                                    type="text"
                                    value={newVendor.contact}
                                    onChange={(e) => setNewVendor({ ...newVendor, contact: e.target.value })}
                                    className="input-field"
                                    placeholder="연락처를 입력하세요"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    비용 (원)
                                </label>
                                <input
                                    type="number"
                                    value={newVendor.cost || ''}
                                    onChange={(e) => setNewVendor({ ...newVendor, cost: e.target.value ? parseInt(e.target.value) : undefined })}
                                    className="input-field"
                                    placeholder="비용을 입력하세요"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                장점
                            </label>
                            <textarea
                                value={newVendor.pros}
                                onChange={(e) => setNewVendor({ ...newVendor, pros: e.target.value })}
                                className="input-field"
                                rows={3}
                                placeholder="장점을 입력하세요"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                단점
                            </label>
                            <textarea
                                value={newVendor.cons}
                                onChange={(e) => setNewVendor({ ...newVendor, cons: e.target.value })}
                                className="input-field"
                                rows={3}
                                placeholder="단점을 입력하세요"
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

            {/* 업체 목록 */}
            <div className="card">
                <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                    업체 목록
                </h2>
                {vendors.length > 0 ? (
                    <div className="space-y-4">
                        {vendors.map((vendor) => (
                            <div key={vendor.id} className="border border-secondary-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-lg font-semibold text-secondary-900">
                                            {vendor.name}
                                        </h3>
                                        <p className="text-secondary-600">{vendor.category}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-sm ${vendor.status === '계약 완료' ? 'bg-green-100 text-green-800' :
                                            vendor.status === '고려 중' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {vendor.status}
                                    </span>
                                </div>
                                {vendor.contact && (
                                    <p className="text-sm text-secondary-600 mb-2">
                                        연락처: {vendor.contact}
                                    </p>
                                )}
                                {vendor.cost && (
                                    <p className="text-sm text-secondary-600 mb-2">
                                        비용: {vendor.cost.toLocaleString()}원
                                    </p>
                                )}
                                {vendor.pros && (
                                    <div className="mb-2">
                                        <p className="text-sm font-medium text-green-700">장점:</p>
                                        <p className="text-sm text-secondary-600">{vendor.pros}</p>
                                    </div>
                                )}
                                {vendor.cons && (
                                    <div>
                                        <p className="text-sm font-medium text-red-700">단점:</p>
                                        <p className="text-sm text-secondary-600">{vendor.cons}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-secondary-500 text-center py-8">
                        등록된 업체가 없습니다. 새 업체를 추가해보세요!
                    </p>
                )}
            </div>
        </div>
    )
}
