import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'
import { CreateWishlistItemData } from '@/types'

export async function GET(request: NextRequest) {
    try {
        const user = requireAuth(request)

        if (!user.coupleId) {
            return NextResponse.json({
                success: true,
                data: []
            })
        }

        const wishlistItems = await prisma.wishlistItem.findMany({
            where: { coupleId: user.coupleId },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({
            success: true,
            data: wishlistItems
        })

    } catch (error) {
        console.error('Get wishlist items error:', error)

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

        const body: CreateWishlistItemData = await request.json()
        const { itemName, itemUrl, price } = body

        if (!itemName) {
            return NextResponse.json(
                { error: '항목명을 입력해주세요.' },
                { status: 400 }
            )
        }

        const wishlistItem = await prisma.wishlistItem.create({
            data: {
                itemName,
                itemUrl,
                price,
                coupleId: user.coupleId,
            }
        })

        return NextResponse.json({
            success: true,
            data: wishlistItem,
            message: '위시리스트 항목이 추가되었습니다.'
        })

    } catch (error) {
        console.error('Create wishlist item error:', error)

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
