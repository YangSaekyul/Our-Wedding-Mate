import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'
import { CreateVendorData } from '@/types'

export async function GET(request: NextRequest) {
    try {
        const user = requireAuth(request)

        if (!user.coupleId) {
            return NextResponse.json({
                success: true,
                data: []
            })
        }

        const vendors = await prisma.vendor.findMany({
            where: { coupleId: user.coupleId },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({
            success: true,
            data: vendors
        })

    } catch (error) {
        console.error('Get vendors error:', error)

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

export async function POST(request: NextRequest) {
    try {
        const user = requireAuth(request)

        if (!user.coupleId) {
            return NextResponse.json(
                { error: '커플 정보가 필요합니다.' },
                { status: 400 }
            )
        }

        const body: CreateVendorData = await request.json()
        const { name, category, contact, cost, pros, cons, status } = body

        if (!name || !category) {
            return NextResponse.json(
                { error: '업체명과 카테고리를 입력해주세요.' },
                { status: 400 }
            )
        }

        const vendor = await prisma.vendor.create({
            data: {
                name,
                category,
                contact,
                cost,
                pros,
                cons,
                status: status || '고려 중',
                coupleId: user.coupleId,
            }
        })

        return NextResponse.json({
            success: true,
            data: vendor,
            message: '업체가 추가되었습니다.'
        })

    } catch (error) {
        console.error('Create vendor error:', error)

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
