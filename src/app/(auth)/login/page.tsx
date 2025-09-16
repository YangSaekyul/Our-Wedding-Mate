'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberEmail, setRememberEmail] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const router = useRouter()
    const { login } = useAuthStore()

    // 저장된 이메일 불러오기
    useEffect(() => {
        const savedEmail = localStorage.getItem('remembered-email')
        if (savedEmail) {
            setEmail(savedEmail)
            setRememberEmail(true)
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || '로그인에 실패했습니다.')
            }

            // 이메일 저장 처리
            if (rememberEmail) {
                localStorage.setItem('remembered-email', email)
            } else {
                localStorage.removeItem('remembered-email')
            }

            // 로그인 성공 시 상태 업데이트
            login(data.user, data.token)

            // 대시보드로 리다이렉트
            router.push('/dashboard')
        } catch (err) {
            setError(err instanceof Error ? err.message : '로그인에 실패했습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full space-y-8 p-8 card">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-primary-600 mb-2">
                        로그인
                    </h1>
                    <p className="text-secondary-600">
                        Our Wedding Mate에 오신 것을 환영합니다
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                            이메일
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            placeholder="비밀번호를 입력하세요"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            id="remember-email"
                            type="checkbox"
                            checked={rememberEmail}
                            onChange={(e) => setRememberEmail(e.target.checked)}
                            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label htmlFor="remember-email" className="ml-2 text-sm text-secondary-700">
                            아이디 저장
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? '로그인 중...' : '로그인'}
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-secondary-600">
                        아직 계정이 없으신가요?{' '}
                        <Link href="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
                            회원가입
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
