'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const router = useRouter()
    const { login } = useAuthStore()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        // 비밀번호 확인
        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.')
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || '회원가입에 실패했습니다.')
            }

            // 회원가입 성공 시 자동 로그인
            login(data.user, data.token)

            // 대시보드로 리다이렉트
            router.push('/dashboard')
        } catch (err) {
            setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full space-y-8 p-8 card">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-primary-600 mb-2">
                        회원가입
                    </h1>
                    <p className="text-secondary-600">
                        Our Wedding Mate와 함께 웨딩 준비를 시작하세요
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
                            이름
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="이름을 입력하세요"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                            이메일
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="이메일을 입력하세요"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                            비밀번호
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="비밀번호를 입력하세요"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 mb-2">
                            비밀번호 확인
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="비밀번호를 다시 입력하세요"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? '회원가입 중...' : '회원가입'}
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-secondary-600">
                        이미 계정이 있으신가요?{' '}
                        <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                            로그인
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
