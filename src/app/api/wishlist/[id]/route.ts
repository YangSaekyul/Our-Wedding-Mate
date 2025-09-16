import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'
import { UpdateWishlistItemData } from '@/types'

interface RouteParams {
    params: {
        id: string
    }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const user = requireAuth(request)
        const { id } = params

        if (!user.coupleId) {
            return NextResponse.json(
                { error: '커플 정보가 필요합니다.' },
                { status: 400 }
            )
        }

        const body: UpdateWishlistItemData = await request.json()
        const { itemName, itemUrl, price, isPurchased } = body

        // 위시리스트 항목 존재 여부 및 권한 확인
        const existingItem = await prisma.wishlistItem.findFirst({
            where: {
                id,
                coupleId: user.coupleId
            }
        })

        if (!existingItem) {
            return NextResponse.json(
                { error: '위시리스트 항목을 찾을 수 없습니다.' },
                { status: 404 }
            )
        }

        const updateData: any = {}
        if (itemName !== undefined) updateData.itemName = itemName
        if (itemUrl !== undefined) updateData.itemUrl = itemUrl
        if (price !== undefined) updateData.price = price
        if (isPurchased !== undefined) updateData.isPurchased = isPurchased

        const wishlistItem = await prisma.wishlistItem.update({
            where: { id },
            data: updateData
        })

        return NextResponse.json({
            success: true,
            data: wishlistItem,
            message: '위시리스트 항목이 수정되었습니다.'
        })

    } catch (error) {
        console.error('Update wishlist item error:', error)

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
