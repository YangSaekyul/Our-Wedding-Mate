import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'
import { DashboardData } from '@/types'

export async function GET(request: NextRequest) {
    try {
        const user = requireAuth(request)

        if (!user.coupleId) {
            return NextResponse.json({
                success: true,
                data: {
                    weddingDate: undefined,
                    totalBudget: 0,
                    spentAmount: 0,
                    remainingBudget: 0,
                    recentTodos: [],
                    recentVendors: [],
                    recentBudgetItems: [],
                } as DashboardData
            })
        }

        // 커플 정보 조회
        const couple = await prisma.couple.findUnique({
            where: { id: user.coupleId },
            include: {
                todos: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
                vendors: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
                budgetItems: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
            }
        })

        if (!couple) {
            return NextResponse.json(
                { error: '커플 정보를 찾을 수 없습니다.' },
                { status: 404 }
            )
        }

        // 예산 계산
        const totalBudget = couple.budgetItems.reduce((sum, item) => sum + item.amount, 0)
        const spentAmount = couple.budgetItems
            .filter(item => item.paidBy !== '예정')
            .reduce((sum, item) => sum + item.amount, 0)
        const remainingBudget = totalBudget - spentAmount

        // Prisma returns nullable fields (e.g. Date | null), convert null -> undefined
        const mapTodo = (t: any) => ({ ...t, dueDate: t.dueDate ?? undefined })
        const mapVendor = (v: any) => ({
            ...v,
            contact: v.contact ?? undefined,
            cost: v.cost ?? undefined,
            pros: v.pros ?? undefined,
            cons: v.cons ?? undefined,
        })
        const mapBudgetItem = (b: any) => ({ ...b })

        const dashboardData: DashboardData = {
            weddingDate: couple.weddingDate ?? undefined,
            totalBudget,
            spentAmount,
            remainingBudget,
            recentTodos: couple.todos.map(mapTodo),
            recentVendors: couple.vendors.map(mapVendor),
            recentBudgetItems: couple.budgetItems.map(mapBudgetItem),
        }

        return NextResponse.json({
            success: true,
            data: dashboardData
        })

    } catch (error) {
        console.error('Dashboard error:', error)

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
