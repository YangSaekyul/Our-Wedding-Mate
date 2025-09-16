import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password } = body

        // 입력 검증
        if (!email || !password) {
            return NextResponse.json(
                { error: '이메일과 비밀번호를 입력해주세요.' },
                { status: 400 }
            )
        }

        // 사용자 찾기
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                coupleId: true,
                createdAt: true,
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
                { status: 401 }
            )
        }

        // 비밀번호 검증
        const isPasswordValid = await verifyPassword(password, user.password)
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
                { status: 401 }
            )
        }

        // JWT 토큰 생성
        const token = generateToken({
            userId: user.id,
            email: user.email,
            coupleId: user.coupleId || undefined,
        })

        // 비밀번호 제외하고 사용자 정보 반환
        const { password: _, ...userWithoutPassword } = user

        return NextResponse.json({
            success: true,
            user: userWithoutPassword,
            token,
            message: '로그인이 완료되었습니다.'
        })

    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 }
        )
    }
}
