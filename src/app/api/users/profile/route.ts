import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'

export async function GET(request: NextRequest) {
    try {
        const user = requireAuth(request)

        // 사용자 정보 조회
        const userData = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                email: true,
                name: true,
                coupleId: true,
                createdAt: true
            }
        })

        if (!userData) {
            return NextResponse.json(
                { error: '사용자를 찾을 수 없습니다.' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: userData,
            message: '프로필 정보를 성공적으로 불러왔습니다.'
        })

    } catch (error) {
        console.error('Get profile error:', error)

        if (error instanceof Error && error.message === '인증이 필요합니다.') {
            return NextResponse.json(
                { error: '인증이 필요합니다.' },
                { status: 401 }
            )
        }

        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 }
        )
    }
}
