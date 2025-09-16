import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                coupleId: true,
                createdAt: true,
            }
        })

        return NextResponse.json({
            success: true,
            data: users,
            count: users.length
        })

    } catch (error) {
        console.error('Get users error:', error)
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 }
        )
    }
}
