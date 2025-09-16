import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'
import { CreateBudgetItemData } from '@/types'

export async function GET(request: NextRequest) {
    try {
        const user = requireAuth(request)

        if (!user.coupleId) {
            return NextResponse.json({
                success: true,
                data: []
            })
        }

        const budgetItems = await prisma.budgetItem.findMany({
            where: { coupleId: user.coupleId },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({
            success: true,
            data: budgetItems
        })

    } catch (error) {
        console.error('Get budget items error:', error)

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

        const body: CreateBudgetItemData = await request.json()
        const { category, item, amount, paidBy } = body

        if (!category || !item || !amount || !paidBy) {
            return NextResponse.json(
                { error: '모든 필드를 입력해주세요.' },
                { status: 400 }
            )
        }

        if (amount <= 0) {
            return NextResponse.json(
                { error: '금액은 0보다 커야 합니다.' },
                { status: 400 }
            )
        }

        const budgetItem = await prisma.budgetItem.create({
            data: {
                category,
                item,
                amount,
                paidBy,
                coupleId: user.coupleId,
            }
        })

        return NextResponse.json({
            success: true,
            data: budgetItem,
            message: '예산 항목이 추가되었습니다.'
        })

    } catch (error) {
        console.error('Create budget item error:', error)

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
