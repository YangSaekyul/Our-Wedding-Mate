import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'
import { CreateTodoData } from '@/types'

export async function GET(request: NextRequest) {
    try {
        const user = requireAuth(request)

        if (!user.coupleId) {
            return NextResponse.json({
                success: true,
                data: []
            })
        }

        const todos = await prisma.todo.findMany({
            where: { coupleId: user.coupleId },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({
            success: true,
            data: todos
        })

    } catch (error) {
        console.error('Get todos error:', error)

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

        const body: CreateTodoData = await request.json()
        const { content, dueDate } = body

        if (!content) {
            return NextResponse.json(
                { error: '할 일 내용을 입력해주세요.' },
                { status: 400 }
            )
        }

        const todo = await prisma.todo.create({
            data: {
                content,
                dueDate: dueDate ? new Date(dueDate) : null,
                coupleId: user.coupleId,
            }
        })

        return NextResponse.json({
            success: true,
            data: todo,
            message: '할 일이 추가되었습니다.'
        })

    } catch (error) {
        console.error('Create todo error:', error)

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
